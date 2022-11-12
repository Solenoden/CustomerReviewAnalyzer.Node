import { ReportDataAnalyzer } from '../interfaces/report-data-analyzer.interface'
import { ReportMetric } from '../interfaces/report-metric.interface'

export class QuestionCommentAnalyzer implements ReportDataAnalyzer<number> {
    identifier = 'QuestionCommentAnalyzer'
    reportMetric: ReportMetric<number> = { name: 'QUESTIONS', value: 0 }

    public analyze(commentText: string): void {
        if (commentText && commentText.toLowerCase().includes('?')) {
            this.reportMetric.value++
        }
    }

    public compileReportMetric(): ReportMetric<number> {
        return this.reportMetric
    }

    public consolidateAnalyzerValues(reportDataAnalyzer: QuestionCommentAnalyzer): void {
        this.reportMetric.value += reportDataAnalyzer.reportMetric.value
    }
}