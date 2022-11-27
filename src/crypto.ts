import SparkMD5 from 'spark-md5'

export const md5FromFile = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader()
        const spark = new SparkMD5.ArrayBuffer()
        const chunkSize = 2097152 // 2MB
        const chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0

        fileReader.onload = (event: ProgressEvent<FileReader>) => {
            spark.append(event.target?.result as any) // Append array buffer
            ++currentChunk
            currentChunk < chunks ? loadNext() : resolve(window.btoa(spark.end(true)))
        }
        fileReader.onerror = () => reject(fileReader.error)

        const loadNext = () => {
            const start = currentChunk * chunkSize
            const end = start + chunkSize >= file.size ? file.size : start + chunkSize
            fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end))
        }

        loadNext()
    })
}
