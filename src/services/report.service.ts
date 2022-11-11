import * as fileSystem from 'fs'
import { ReportMetric } from '../interfaces/report-metric.interface'
import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ShortCommentAnalyzer } from '../classes/short-comment-analyzer'

export class ReportService {
    private readonly documentsPath = './docs'

    public async compileCommentsReport(): Promise<ReportMetric[]> {
        return new Promise((resolve, reject) => {
            fileSystem.promises.readdir(this.documentsPath).then(allFiles => {
                const commentFileRegex = new RegExp(/comments-([0-9]{4}-[0-9]{2}-[0-9]{2})\.txt/)
                const commentAnalyzers: ReportDataAnalyzer[] = [
                    new ShortCommentAnalyzer()
                ]

                const commentFiles: { name: string, date: Date }[] = []
                allFiles.forEach(file => {
                    const matchInfo = commentFileRegex.exec(file)

                    if (matchInfo) {
                        const date = new Date(matchInfo[1])
                        commentFiles.push({ name: file, date })
                    }
                })

                const promises = commentFiles.map(file => fileSystem.promises.readFile(this.documentsPath + '/' + file.name))
                Promise.all(promises).then(files => {
                    files.forEach(result => {
                        const lines = result.toString().split('\r\n')
                        lines.forEach(line => {
                            commentAnalyzers.forEach(commentAnalyzer => {
                                commentAnalyzer.analyze(line)
                            })
                        })
                    })

                    const reportMetrics: ReportMetric[] = commentAnalyzers.map(commentAnalyzer => {
                        return commentAnalyzer.compileReportMetric()
                    })
                    this.logReportToConsole('Comments Report', reportMetrics)

                    resolve(reportMetrics)
                }).catch(error => {
                    reject(error)
                })
            }).catch(error => reject(error))
        })
    }

    /* eslint-disable no-console */
    private logReportToConsole(reportName: string, reportMetrics: ReportMetric[]): void {
        console.log('')
        console.log(reportName)
        console.log('==================')
        reportMetrics.forEach(reportMetric => {
            console.log(reportMetric.name + ' : ' + reportMetric.value.toString())
        })
        console.log('')
    }
}