import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class SpamCommentAnalyzer implements ReportDataAnalyzer {
    private readonly spamRegex = new RegExp(/(http|www)/)
    reportMetric: ReportMetric = { name: 'SPAM', value: 0 }

    analyze(commentText: string): void {
        if (commentText && this.spamRegex.test(commentText)) {
            this.reportMetric.value = Number(this.reportMetric.value) + 1
        }
    }

    compileReportMetric(): ReportMetric {
        return this.reportMetric
    }
}