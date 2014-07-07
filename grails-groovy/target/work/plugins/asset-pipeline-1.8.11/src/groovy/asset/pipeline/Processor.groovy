package asset.pipeline


interface Processor {
	def process(inputText, assetFile)
}