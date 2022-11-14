import * as fileSystem from 'fs'
import moment from 'moment'
import { ReportMetric } from '../interfaces/report-metric.interface'
import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ShortCommentAnalyzer } from '../classes/short-comment-analyzer.class'
import { MoverMentionsCommentAnalyzer } from '../classes/mover-mentions-comment-analyzer.class'
import { ShakerMentionsCommentAnalyzer } from '../classes/shaker-mentions-comment-analyzer.class'
import { QuestionCommentAnalyzer } from '../classes/question-comment-analyzer.class'
import { SpamCommentAnalyzer } from '../classes/spam-comment-analyzer.class'
import { WorkerOperation } from '../enums/worker-operation.enum'
import { WorkerService } from './worker.service'
import { WorkerFile } from '../enums/worker-file.enum'

export class ReportService {
    private readonly workerService = new WorkerService()
    private readonly documentsPath = './docs'
    static commentAnalyzers: { [key: string]: { new(): ReportDataAnalyzer<any> } } = {
        'ShortCommentAnalyzer': ShortCommentAnalyzer,
        'MoverMentionsCommentAnalyzer': MoverMentionsCommentAnalyzer,
        'ShakerMentionsCommentAnalyzer': ShakerMentionsCommentAnalyzer,
        'QuestionCommentAnalyzer': QuestionCommentAnalyzer,
        'SpamCommentAnalyzer': SpamCommentAnalyzer
    }

    public async compileCommentsReport(startDate: Date, endDate: Date): Promise<ReportMetric<any>[]> {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line max-len
            const commentAnalyzers: ReportDataAnalyzer<any>[] = Object.values(ReportService.commentAnalyzers).map(x => new x())
            const reportHeading = this.getCommentsReportHeading(startDate, endDate)

            this.getCommentFiles(startDate, endDate).then(commentFiles => {
                if (!commentFiles || commentFiles.length === 0) {
                    const reportMetrics: ReportMetric<any>[] = commentAnalyzers.map(commentAnalyzer => {
                        return commentAnalyzer.compileReportMetric()
                    })
                    this.logReportToConsole(reportHeading, reportMetrics)

                    resolve(reportMetrics)
                    return
                }

                const workerThreads = commentFiles.map(file => {
                    return this.workerService.createWorkerThread(
                        WorkerFile.Report,
                        WorkerOperation.ProcessCommentsFile,
                        {
                            filePath: this.documentsPath + '/' + file.name
                        }
                    )
                })

                let completedWorkers = 0
                workerThreads.forEach(worker => {
                    worker.once('message', (result: { commentAnalyzers: ReportDataAnalyzer<any>[] }) => {
                        completedWorkers++

                        commentAnalyzers.forEach(commentAnalyzer => {
                            const workerAnalyzer = result.commentAnalyzers.find(
                                x => x.identifier === commentAnalyzer.identifier
                            )
                            if (workerAnalyzer) {
                                commentAnalyzer.consolidateAnalyzerValues(workerAnalyzer)
                            }
                        })

                        if (completedWorkers === workerThreads.length) {
                            const reportMetrics: ReportMetric<any>[] = commentAnalyzers.map(commentAnalyzer => {
                                return commentAnalyzer.compileReportMetric()
                            })
                            this.logReportToConsole(reportHeading, reportMetrics)

                            resolve(reportMetrics)
                        }
                    })
                })
            }).catch(error => reject(error))
        })
    }

    private getCommentFiles(startDate: Date, endDate: Date): Promise<{ name: string, date: Date }[]> {
        return new Promise<{ name: string, date: Date }[]>((resolve, reject) => {
            const commentFileRegex = new RegExp(/comments-([0-9]{4}-[0-9]{2}-[0-9]{2})\.txt/)
            const momentStartDate = startDate && moment(startDate)
            const momentEndDate = endDate && moment(endDate)

            fileSystem.promises.readdir(this.documentsPath).then(allFiles => {
                const commentFiles: { name: string, date: Date }[] = []
                allFiles.forEach(file => {
                    const matchInfo = commentFileRegex.exec(file)

                    if (matchInfo) {
                        const date = new Date(matchInfo[1])
                        const momentDate = moment(date)

                        if (
                            (!momentStartDate || momentDate.isSameOrAfter(momentStartDate)) &&
                            (!momentEndDate || momentDate.isSameOrBefore(momentEndDate))
                        ) {
                            commentFiles.push({ name: file, date })
                        }
                    }
                })

                resolve(commentFiles)
            }).catch(error => reject(error))
        })
    }

    /* eslint-disable no-console */
    private logReportToConsole(reportName: string, reportMetrics: ReportMetric<any>[]): void {
        console.log('')
        console.log(reportName)
        console.log('==================')
        reportMetrics.forEach(reportMetric => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            console.log(reportMetric.name + ' : ' + JSON.stringify(reportMetric.value))
        })
        console.log('')
    }

    private getCommentsReportHeading(startDate: Date, endDate: Date): string {
        let reportHeading = 'Comments Report'
        if (startDate && endDate) {
            // eslint-disable-next-line max-len
            reportHeading = `${reportHeading} [${moment(startDate).format('YYYY-MM-DD')} - ${moment(endDate).format('YYYY-MM-DD')}]`
        } else if (startDate && !endDate) {
            reportHeading = `${reportHeading} [${moment(startDate).format('YYYY-MM-DD')} - Present]`
        } else if (endDate && !startDate) {
            reportHeading = `${reportHeading} [Present - ${moment(endDate).format('YYYY-MM-DD')}]`
        } else if (startDate === endDate) {
            reportHeading = `${reportHeading} [${moment(startDate).format('YYYY-MM-DD')}]`
        }

        return reportHeading
    }
}