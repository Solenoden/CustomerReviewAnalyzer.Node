import { isMainThread, parentPort, workerData } from 'worker_threads'
import * as fileSystem from 'fs'
import { WorkerData } from '../interfaces/worker-data.interface'
import { WorkerOperation } from '../enums/worker-operation.enum'
import { ReportService } from '../services/report.service'

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
if (!isMainThread && workerData && workerData.operation) {
    const data = workerData as WorkerData

    switch (data.operation) {
    case WorkerOperation.ProcessCommentsFile:
        void processCommentsFile()
        break
    case WorkerOperation.WriteFile:
        void writeFile()
        break
    }
}

async function processCommentsFile() {
    const payload = workerData.payload as { filePath: string }
    const commentAnalyzers = Object.values(ReportService.commentAnalyzers).map(x => new x())

    if (payload.filePath) {
        const fileContents = await fileSystem.promises.readFile(payload.filePath)
        const lines = fileContents.toString().split('\r\n')
        lines.forEach(line => {
            commentAnalyzers.forEach(commentAnalyzer => {
                commentAnalyzer.analyze(line)
            })
        })
    }

    parentPort.postMessage({ commentAnalyzers })
    process.exit()
}

async function writeFile() {
    const payload = workerData.payload as { content: string, filePath: string, fileName: string }

    try {
        await fileSystem.promises.writeFile(payload.filePath + '/' + payload.fileName, payload.content)
        process.exit()
    } catch (error) {
        parentPort.postMessage({ error })
        process.exit()
    }
}