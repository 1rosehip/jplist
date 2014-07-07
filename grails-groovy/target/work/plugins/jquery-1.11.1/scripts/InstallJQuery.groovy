// Hard coded for installation purpose
def jQueryVersion = '1.10.2'
def jQuerySources = 'jquery'

includeTargets << grailsScript("_GrailsEvents")

target(installJQuery: "Downloads jQuery from code.jquery.com") {

    event("StatusUpdate", ["Downloading jQuery ${jQueryVersion}"])

    mkdir(dir:"${basedir}/web-app/js/${jQuerySources}")

    ["jquery-${jQueryVersion}.js", "jquery-${jQueryVersion}.min.js"].each {
        get(dest: "${basedir}/web-app/js/${jQuerySources}/${it}",
            src: "http://code.jquery.com/${it}",
            verbose: true)
    }

    event("StatusFinal", ["JQuery ${jQueryVersion} installed successfully"])
}

setDefaultTarget 'installJQuery'
