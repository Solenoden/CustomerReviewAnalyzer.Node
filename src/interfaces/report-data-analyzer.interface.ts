import { ReportMetric } from './report-metric.interface'

export interface ReportDataAnalyzer {
    reportMetric: ReportMetric

    analyze(data: any): void
    compileReportMetric(): ReportMetric
}