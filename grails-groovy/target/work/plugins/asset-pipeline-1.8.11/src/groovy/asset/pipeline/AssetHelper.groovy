/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package asset.pipeline

import grails.util.Holders
import org.codehaus.groovy.grails.plugins.GrailsPluginUtils

import java.util.regex.Pattern
import java.security.MessageDigest
import java.nio.channels.FileChannel

class AssetHelper {
    static assetSpecs = [JsAssetFile, CssAssetFile, ManifestAssetFile]
    static QUOTED_FILE_SEPARATOR = Pattern.quote(File.separator)
    static DIRECTIVE_FILE_SEPARATOR = '/'

    static fileForUri(uri, contentType=null,ext=null, baseFile=null) {

        def grailsApplication = Holders.getGrailsApplication()

        if(contentType) {

            def possibleFileSpecs = AssetHelper.getPossibleFileSpecs(contentType)
            if(possibleFileSpecs) {
                    def file =  AssetHelper.fileForUriIfHasAnyAssetType(uri, possibleFileSpecs, baseFile)
                    if(file) return file
            }
            else {
                def assetFile = AssetHelper.fileForFullName(uri + "." + ext)
                if(assetFile) {
                    return assetFile
                }
            }
        } else {
            return AssetHelper.getAssetFileWithExtension(uri, ext)
        }

        return null
    }

    static assetFileClasses() {
        return AssetHelper.assetSpecs
    }

    static assetForFile(file,contentType, baseFile=null) {
        if(contentType == null || file == null) {
            return file
        }

        def grailsApplication = Holders.getGrailsApplication()
        def possibleFileSpecs = AssetHelper.getPossibleFileSpecs(contentType)
        for(fileSpec in possibleFileSpecs) {
            for(extension in fileSpec.extensions) {
                def fileName = file.getAbsolutePath()
                if(fileName.endsWith("." + extension)) {
                    return fileSpec.newInstance(file: file, baseFile:baseFile)
                }
            }
        }

        return file
    }

    @Deprecated
    static artefactForFile(file) {
        println "DEPRECATION WARNING: AssetHelper.artefactForFile() has been renamed to AssetHelper.assetForFile()."
        AssetHelper.assetForFile(file)
    }

    static assetForFile(file) {
        if(file == null) {
            return file
        }

        def possibleFileSpec = AssetHelper.assetForFileName(file.getName())
        if(possibleFileSpec) {
            return possibleFileSpec.newInstance(file:file)
        }
        return file
    }

    static assetForFileName(filename) {
        def grailsApplication = Holders.getGrailsApplication()
        return AssetHelper.assetFileClasses().find{ fileClass ->
            fileClass.extensions.find { filename.endsWith(".${it}") }
        }
    }

    static fileForFullName(uri) {
        def assetPaths = AssetHelper.getAssetPaths()
        for(assetPath in assetPaths) {
            def path = [assetPath, uri].join(File.separator)
            def fileDescriptor = new File(path)
            if(fileDescriptor.exists() && fileDescriptor.file) {
                return fileDescriptor
            }
        }
        return null
    }

    static getAssetPaths() {
        def assetPaths = AssetHelper.getAssetPathsByPlugin().values().toList().flatten().unique()
        return assetPaths
    }

    static getAssetPathsByPlugin(includeWebApp=true) {
        def assetPaths = [:]
        assetPaths.application = AssetHelper.scopedDirectoryPaths(new File("grails-app/assets").getAbsolutePath())
        for(plugin in GrailsPluginUtils.pluginInfos) {
            def assetPath = [plugin.pluginDir.getPath(), "grails-app", "assets"].join(File.separator)
            def pluginAssetPaths = AssetHelper.scopedDirectoryPaths(assetPath)
            if(includeWebApp) {
                def fallbackPath = [plugin.pluginDir.getPath(), "web-app"].join(File.separator)
                pluginAssetPaths += AssetHelper.scopedDirectoryPaths(fallbackPath)
            }
            pluginAssetPaths.unique()

            assetPaths[plugin.name] = pluginAssetPaths
        }
        return assetPaths
    }

    static scopedDirectoryPaths(assetPath) {
        def assetPaths = []
        def assetFile = new File(assetPath)
        if(assetFile.exists()) {
            def scopedDirectories = assetFile.listFiles()
            for(scopedDirectory in scopedDirectories) {
                if(scopedDirectory.isDirectory() && scopedDirectory.getName() != "WEB-INF" && scopedDirectory.getName() != 'META-INF') {
                    assetPaths << scopedDirectory.getAbsolutePath()
                }

            }
        }
        return assetPaths
    }

    static extensionFromURI(uri) {

        def uriComponents = uri.split("/")
        def lastUriComponent = uriComponents[uriComponents.length - 1]
        def extension
        if(lastUriComponent.lastIndexOf(".") >= 0) {
            extension = uri.substring(uri.lastIndexOf(".") + 1)
        }
        return extension
    }

    static nameWithoutExtension(uri) {
        def uriComponents = uri.split("/")
        def lastUriComponent = uriComponents[uriComponents.length - 1]
        if(lastUriComponent.lastIndexOf(".") >= 0) {
            return uri.substring(0,uri.lastIndexOf("."))
        }
        return uri
    }

    static fileNameWithoutExtensionFromArtefact(filename,assetFile) {
        if(assetFile == null) {
            return null
        }

        def rootName = filename
        assetFile.extensions.each { extension ->

            if(filename.endsWith(".${extension}")) {
                def potentialName = filename.substring(0,filename.lastIndexOf(".${extension}"))
                if(potentialName.length() < rootName.length()) {
                    rootName = potentialName
                }
            }
        }
        return rootName
    }

    static assetMimeTypeForURI(uri) {
        def fileSpec = assetForFileName(uri)
        if(fileSpec) {
            if(fileSpec.contentType instanceof String) {
                return [fileSpec.contentType]
            }
            return fileSpec.contentType
        }
        return null
    }

    /**
    * Copies a files contents from one file to another and flushes.
    * Note: We use FileChannel instead of FileUtils.copyFile to ensure a synchronous forced save.
    * This helps ensures files exist on the disk before a war file is created.
    * @param sourcceFile the originating file we want to copy
    * @param destFile the destination file object we want to save to
    */
    static void copyFile(File sourceFile, File destFile) throws IOException {
        if(!destFile.exists()) {
            destFile.createNewFile()
        }

         FileChannel source
         FileChannel destination
        try {
            source = new FileInputStream(sourceFile).getChannel()
            destination = new FileOutputStream(destFile).getChannel()
            destination.transferFrom(source, 0, source.size())
            destination.force(true)
        }
        finally {
            source?.close()
            destination?.close()
        }
    }

    /**
     *
     * @param uri the string of the asset uri.
     * @param possibleFileSpecs is a list of possible file specs that the file for the uri can belong to.
     * @return an AssetFile for the corresponding uri.
     */
    static fileForUriIfHasAnyAssetType(String uri, possibleFileSpecs, baseFile=null) {
        for(fileSpec in possibleFileSpecs) {
            for(extension in fileSpec.extensions) {
                def fullName = uri
                if(fullName.endsWith(".${fileSpec.compiledExtension}")) {
                    fullName = fullName.substring(0,fullName.lastIndexOf(".${fileSpec.compiledExtension}"))
                }
                if(!fullName.endsWith("." + extension)) {
                    fullName += "." + extension
                }

                def file = AssetHelper.fileForFullName(fullName)
                if(file) {
                    return fileSpec.newInstance(file: file, baseFile: baseFile)
                }
            }
        }
    }

    /**
     *
     * @param uri string representation of the asset file.
     * @param ext the extension of the file
     * @return An instance of the file that the uri belongs to.
     */
    static getAssetFileWithExtension(String uri, String ext) {
        def fullName = uri
        if(ext) {
           fullName = uri + "." + ext
        }
        def assetFile = AssetHelper.fileForFullName(fullName)
        if(assetFile) {
            return assetFile
        }
    }

    static getPossibleFileSpecs(String contentType){
        AssetHelper.assetFileClasses().findAll { (it.contentType instanceof String) ? it.contentType == contentType : contentType in it.contentType }
    }

    static getByteDigest(byte[] fileBytes) {
        // Generate Checksum based on the file contents and the configuration settings
        MessageDigest md = MessageDigest.getInstance("MD5")
        md.update(fileBytes)
        def checksum = md.digest()
        return checksum.encodeHex().toString()
    }

    /**
     * Concatenate multiple byte arrays
     * @param arrays
     * @return an array containing the values of all the arrays
     */
    static byte[] concat(byte[]... arrays) {
        int totalLength = arrays.inject(0, { total, array  -> total + array.length }) as int
        byte[] result = new byte[totalLength]

        // copy the source arrays into the result array
        arrays.inject(0, { int currentIndex, byte[] array ->
            System.arraycopy(array, 0, result, currentIndex, array.length)
            currentIndex + array.length
        })

        return result
    }
}
