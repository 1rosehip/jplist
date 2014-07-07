import org.apache.commons.io.FileUtils

class AssetPipelineBootStrap {

    def grailsApplication

    def init = { servletContext ->
        def storagePath = grailsApplication.config.grails.assets.storagePath
        if (!storagePath) {
            return
        }

        def manifestFile = grailsApplication.getParentContext().getResource("assets/manifest.properties").getFile()
        // println("Checking For Parent ${manifestFile.parent}")
        def webAppAssetsDir = new File(manifestFile.parent)
        // def webAppAssetsDir = new File("web-app/assets")
        if (!webAppAssetsDir.exists()) {
            return
        }

        // println "Path Found, Copying Assets"
        def storageFile = new File(storagePath)
        storageFile.mkdirs()
        FileUtils.copyDirectory(webAppAssetsDir, storageFile)
    }
}
