import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class ShakerMentionsCommentAnalyzer implements ReportDataAnalyzer {
    reportMetric: ReportMetric = { name: 'SHAKER_MENTIONS', value: 0 }

    analyze(commentText: string): void {
        if (commentText && commentText.toLowerCase().includes('shaker')) {
            this.reportMetric.value = Number(this.reportMetric.value) + 1
        }
    }

    compileReportMetric(): ReportMetric {
        return this.reportMetric
    }
}