import { Worker } from 'worker_threads'
import { WorkerFile } from '../enums/worker-file.enum'
import { WorkerOperation } from '../enums/worker-operation.enum'
import { WorkerData } from '../interfaces/worker-data.interface'

export class WorkerService {
    private readonly workerRouterPath = './src/workers/worker-router.js'

    public createWorkerThread(
        workerFile: WorkerFile,
        workerOperation: WorkerOperation,
        payload: { [key: string]: any }
    ): Worker {
        const data: WorkerData = {
            file: workerFile,
            operation: workerOperation,
            payload
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return new Worker(this.workerRouterPath, { workerData: data })
    }
}