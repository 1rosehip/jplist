package asset.pipeline

interface AssetFile {
    static contentType
    static List extensions
    static String compiledExtension
    static List processors


    File getFile()
    AssetFile getBaseFile()
    String getEncoding()
    void setFile(File file)
    void setEncoding(String encoding)
    void setBaseFile(AssetFile baseFile)


    String processedStream(precompiler)

    String directiveForLine(String line)

}
