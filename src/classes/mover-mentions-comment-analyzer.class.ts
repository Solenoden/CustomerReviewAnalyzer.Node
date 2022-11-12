import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class MoverMentionsCommentAnalyzer implements ReportDataAnalyzer<number> {
    identifier = 'MoverMentionsCommentAnalyzer'
    reportMetric: ReportMetric<number> = { name: 'MOVER_MENTIONS', value: 0 }

    public analyze(commentText: string): void {
        if (commentText && commentText.toLowerCase().includes('mover')) {
            this.reportMetric.value++
        }
    }

    public compileReportMetric(): ReportMetric<number> {
        return this.reportMetric
    }

    public consolidateAnalyzerValues(reportDataAnalyzer: MoverMentionsCommentAnalyzer): void {
        this.reportMetric.value += reportDataAnalyzer.reportMetric.value
    }
}