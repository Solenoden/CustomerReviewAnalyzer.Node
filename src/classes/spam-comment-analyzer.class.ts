import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class SpamCommentAnalyzer implements ReportDataAnalyzer<number> {
    private readonly spamRegex = new RegExp(/(http|www)/)
    identifier = 'SpamCommentAnalyzer'
    reportMetric: ReportMetric<number> = { name: 'SPAM', value: 0 }

    public analyze(commentText: string): void {
        if (commentText && this.spamRegex.test(commentText)) {
            this.reportMetric.value++
        }
    }

    public compileReportMetric(): ReportMetric<number> {
        return this.reportMetric
    }

    public consolidateAnalyzerValues(reportDataAnalyzer: SpamCommentAnalyzer): void {
        this.reportMetric.value += reportDataAnalyzer.reportMetric.value
    }
}