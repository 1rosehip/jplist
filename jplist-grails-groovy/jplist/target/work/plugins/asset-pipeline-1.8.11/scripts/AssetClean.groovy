target(assetClean: "Cleaning Compiled Assets") {
	// Clear compiled assets folder
  def assetDir = new File("target/assets")
  if(assetDir.exists()) {
  	assetDir.deleteDir()
  }
}

setDefaultTarget(assetClean)
