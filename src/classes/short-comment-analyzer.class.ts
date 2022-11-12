import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class ShortCommentAnalyzer implements ReportDataAnalyzer<number> {
    private readonly maximumShortCommentLength = 14
    identifier = 'ShortCommentAnalyzer'
    reportMetric: ReportMetric<number> = {
        name: 'SHORTER_THAN_' + (this.maximumShortCommentLength + 1).toString(),
        value: 0
    }

    public analyze(commentText: string): void {
        if (commentText && commentText.trim().length <= this.maximumShortCommentLength) {
            this.reportMetric.value = Number(this.reportMetric.value) + 1
        }
    }

    public compileReportMetric(): ReportMetric<number> {
        return this.reportMetric
    }

    public consolidateAnalyzerValues(reportDataAnalyzer: ShortCommentAnalyzer): void {
        this.reportMetric.value += reportDataAnalyzer.reportMetric.value
    }
}