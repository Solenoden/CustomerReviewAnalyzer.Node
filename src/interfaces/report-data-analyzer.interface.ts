import { ReportMetric } from './report-metric.interface'

export interface ReportDataAnalyzer<ReportMetricDataType> {
    identifier: string
    reportMetric: ReportMetric<ReportMetricDataType>

    analyze(data: any): void
    compileReportMetric(): ReportMetric<ReportMetricDataType>
    consolidateAnalyzerValues(reportDataAnalyzer: ReportDataAnalyzer<ReportMetricDataType>): void
}