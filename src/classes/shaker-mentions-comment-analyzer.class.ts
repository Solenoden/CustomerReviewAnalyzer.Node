import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class ShakerMentionsCommentAnalyzer implements ReportDataAnalyzer<number> {
    identifier = 'ShakerMentionsCommentAnalyzer'
    reportMetric: ReportMetric<number> = { name: 'SHAKER_MENTIONS', value: 0 }

    public analyze(commentText: string): void {
        if (commentText && commentText.toLowerCase().includes('shaker')) {
            this.reportMetric.value++
        }
    }

    public compileReportMetric(): ReportMetric<number> {
        return this.reportMetric
    }

    public consolidateAnalyzerValues(reportDataAnalyzer: ShakerMentionsCommentAnalyzer): void {
        this.reportMetric.value += reportDataAnalyzer.reportMetric.value
    }
}