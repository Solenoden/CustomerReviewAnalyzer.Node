import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class QuestionCommentAnalyzer implements ReportDataAnalyzer {
    reportMetric: ReportMetric = { name: 'QUESTIONS', value: 0 }

    analyze(commentText: string): void {
        if (commentText && commentText.toLowerCase().includes('?')) {
            this.reportMetric.value = Number(this.reportMetric.value) + 1
        }
    }

    compileReportMetric(): ReportMetric {
        return this.reportMetric
    }
}