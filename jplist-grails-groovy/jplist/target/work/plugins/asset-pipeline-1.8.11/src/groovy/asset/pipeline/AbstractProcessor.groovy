package asset.pipeline

abstract class AbstractProcessor implements Processor {
	AssetCompiler precompiler

	/**
	* Constructor for building a Processor
	* @param precompiler - An Instance of the AssetCompiler class compiling the file or NULL for dev mode.
	*/
	AbstractProcessor(AssetCompiler precompiler) {
		this.precompiler = precompiler
	}
}