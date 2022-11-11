import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class ShortCommentAnalyzer implements ReportDataAnalyzer {
    private readonly maximumShortCommentLength = 14
    reportMetric: ReportMetric = { name: 'SHORTER_THAN_' + (this.maximumShortCommentLength + 1).toString(), value: 0 }

    public analyze(commentText: string): void {
        if (commentText && commentText.trim().length <= this.maximumShortCommentLength) {
            this.reportMetric.value = Number(this.reportMetric.value) + 1
        }
    }

    public compileReportMetric(): ReportMetric {
        return this.reportMetric
    }
}