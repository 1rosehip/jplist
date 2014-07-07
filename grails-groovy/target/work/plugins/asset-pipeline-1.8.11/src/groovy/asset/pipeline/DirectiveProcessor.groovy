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

import groovy.util.logging.Log4j

@Log4j
class DirectiveProcessor {

    static DIRECTIVES = [require_self: "requireSelfDirective" ,require_tree: "requireTreeDirective", require_full_tree: "requireFullTreeDirective" , require: "requireFileDirective", encoding: "encodingTypeDirective"]

    def contentType
    AssetCompiler precompiler
    def files = []
    def baseFile

    DirectiveProcessor(contentType, precompiler=null) {
        this.contentType = contentType
        this.precompiler = precompiler
    }

    def compile(file) {
        if(file.class.name == 'java.io.File') {
            return file.getBytes()
        }
        this.baseFile = file
        this.files = []
        def tree = getDependencyTree(file)
        def buffer = ""

        buffer = loadContentsForTree(tree,buffer)
        return buffer
    }

    def getFlattenedRequireList(file) {
        if(file.class.name == 'java.io.File') {
            return [path: relativePath(file), encoding: null]
        }
        def flattenedList = []
        def tree = getDependencyTree(file)

        flattenedList = loadRequiresForTree(tree, flattenedList)
        return flattenedList
    }

    def loadRequiresForTree(treeSet, flattenedList) {
        def selfLoaded = false
        for(childTree in treeSet.tree) {
            if(childTree == "self") {
                def extension = treeSet.file.compiledExtension
                def fileName = AssetHelper.fileNameWithoutExtensionFromArtefact(relativePath(treeSet.file.file, true),treeSet.file)
                flattenedList << [path: "${fileName}.${extension}", encoding: treeSet.file.encoding]
                selfLoaded = true
            } else {
                flattenedList = loadRequiresForTree(childTree, flattenedList)
            }
        }

        if(!selfLoaded) {
            def extension = treeSet.file.compiledExtension
            def fileName = AssetHelper.fileNameWithoutExtensionFromArtefact(relativePath(treeSet.file.file, true),treeSet.file)
            flattenedList << [path: "${fileName}.${extension}", encoding: treeSet.file.encoding]
        }
        return flattenedList
    }

    def loadContentsForTree(treeSet,buffer) {
        def selfLoaded = false
        for(childTree in treeSet.tree) {
            if(childTree == "self") {
                buffer += fileContents(treeSet.file) + "\n"
                selfLoaded = true
            } else {
                buffer = loadContentsForTree(childTree,buffer)
            }
        }

        if(!selfLoaded) {
            buffer += fileContents(treeSet.file) + "\n"
        }
        return buffer
    }

    def getDependencyTree(file) {
        this.files << file
        def tree = [file:file,tree:[]]
        if(file.class.name != 'java.io.File') {
            this.findDirectives(file,tree)
        }

        return tree
    }

    def fileContents(file) {
        if(file.class.name == 'java.io.File') {
            return file.bytes
        }
        return file.processedStream(this.precompiler)
    }

    def findDirectives(fileSpec, tree) {
        def lines = fileSpec.file.readLines()
        // def directiveFound = false
        def startTime = new Date().time
        lines.find { line ->
            def directive = fileSpec.directiveForLine(line)
            if(directive) {
            	directive = directive.trim()
                def unprocessedArgs = directive.split(/\s+/)

                def processor = DIRECTIVES[unprocessedArgs[0].toLowerCase()]

                if(processor) {
                    def directiveArguments = unprocessedArgs
                    if(directive.indexOf('$') >= 0) {
                        directiveArguments = new groovy.text.GStringTemplateEngine(this.class.classLoader).createTemplate(directive).make().toString().split(/\s+/)
                    }
                    directiveArguments[0] = directiveArguments[0].toLowerCase()
                    this."${processor}"(directiveArguments, fileSpec,tree)
                }
            }
            return false
        }
    }

    def requireSelfDirective(command, file, tree) {
        tree.tree << "self"
    }

    def encodingTypeDirective(command, fileSpec, tree) {
        if(!command[1]) {
            return;
        }
        if(fileSpec.baseFile) {
           fileSpec.baseFile.encoding = command[1]
        }
        fileSpec.encoding = command[1]
    }

    def requireTreeDirective(command, fileSpec, tree) {
        String directivePath = command[1]

        def parentFile
        if(!directivePath || directivePath == '.') {
            parentFile = new File(fileSpec.file.getParent())
        } else {
            parentFile = new File([fileSpec.file.getParent(),directivePath].join(File.separator))
        }

        if(parentFile.exists() && parentFile.isDirectory()) {
            recursiveTreeAppend(parentFile, tree)
        }
        else {
            def rootPaths = AssetHelper.scopedDirectoryPaths(new File("grails-app/assets").getAbsolutePath())

            rootPaths.each { path ->
                def absolutePath = new File(path, directivePath)

                if (absolutePath.exists() && absolutePath.isDirectory()) {
                    recursiveTreeAppend(absolutePath, tree)
                }
            }
        }
    }

    def requireFullTreeDirective(command, fileSpec, tree) {
        String directivePath = command[1]

        def parentFile
        if(!directivePath || directivePath == '.') {
            parentFile = new File(fileSpec.file.getParent())
        } else {
            parentFile = new File([fileSpec.file.getParent(),directivePath].join(File.separator))
        }

        def relativeParent = relativePath(parentFile,true)

        AssetHelper.getAssetPaths().each { path ->

            def parentFileScoped = new File(path, relativeParent)
            def absolutePath = new File(path, directivePath)

            if(parentFileScoped.exists() && parentFileScoped.isDirectory()) {
                recursiveTreeAppend(parentFileScoped, tree)
            }
            else if (absolutePath.exists() && absolutePath.isDirectory()) {
                recursiveTreeAppend(absolutePath, tree)
            }
        }
    }

    def recursiveTreeAppend(directory,tree) {
        def files = directory.listFiles()
        files = files?.sort { a, b -> a.name.compareTo b.name }
        for(file in files) {
            if(file.isDirectory()) {
                recursiveTreeAppend(file,tree)
            }
            else if(contentType in AssetHelper.assetMimeTypeForURI(file.getAbsolutePath())) {
                if(!isFileInTree(file,tree)) {
                    tree.tree << getDependencyTree(AssetHelper.assetForFile(file,contentType, this.baseFile))
                }
            }
        }
    }

    def isFileInTree(file,currentTree) {
        def realFile = file
        if(file.class.name != 'java.io.File') {
            realFile = file.file
        }
        def result = files.find { it ->
        return (it.class.name == 'java.io.File' && it.getCanonicalPath() == realFile.getCanonicalPath()) || it.file.getCanonicalPath() == realFile.getCanonicalPath()
        }
        if(result) {
            return true
        } else {
            return false
        }
    }

    def requireFileDirective(command, file, tree) {
        def fileName = command[1]

        List fileNameList = fileName.tokenize(',')
        if( fileNameList.size() > 1 ) {
            fileNameList.each{ thisListItem ->
                requireFileDirective( [ command[0], thisListItem ], file, tree )
            }
        }
        else {
            def newFile
            if( fileName.startsWith( AssetHelper.DIRECTIVE_FILE_SEPARATOR ) ) {
                newFile = AssetHelper.fileForUri( fileName, this.contentType, null, this.baseFile )
            }
            else {
                def relativeFileName = [ relativePath( file.file ), fileName ].join( AssetHelper.DIRECTIVE_FILE_SEPARATOR )
                // println "Including Relative File: ${relativeFileName} - ${fileName}"
                newFile = AssetHelper.fileForUri( relativeFileName, this.contentType, null, this.baseFile )
            }

            if( newFile ) {
                if( !isFileInTree( newFile, tree ) ) {
                    // println("Inserting File")
                    tree.tree << getDependencyTree( newFile )
                }
            }
            else if( !fileName.startsWith( AssetHelper.DIRECTIVE_FILE_SEPARATOR ) ) {
                command[ 1 ] = AssetHelper.DIRECTIVE_FILE_SEPARATOR + command[ 1 ]
                requireFileDirective( command, file, tree )
            }
            else {
                log.warn( "Unable to Locate Asset: ${ command[ 1 ] }" )
            }
        }
    }

    def relativePath(file, includeFileName=false) {
        def path
        if(includeFileName) {
            path = file.class.name == 'java.io.File' ? file.getCanonicalPath().split(AssetHelper.QUOTED_FILE_SEPARATOR) : file.file.getCanonicalPath().split(AssetHelper.QUOTED_FILE_SEPARATOR)
        } else {
            path = file.getParent().split(AssetHelper.QUOTED_FILE_SEPARATOR)
        }

        def startPosition = path.findLastIndexOf{ it == "grails-app" }
        if(startPosition == -1) {
            startPosition = path.findLastIndexOf{ it == 'web-app' }
            if(startPosition+2 >= path.length) {
                return ""
            }
            path = path[(startPosition+2)..-1]
        } else {
            if(startPosition+3 >= path.length) {
                return ""
            }
            path = path[(startPosition+3)..-1]
        }
        return path.join(AssetHelper.DIRECTIVE_FILE_SEPARATOR)
    }
}
