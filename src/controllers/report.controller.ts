import { EndpointController } from '../interfaces/endpoint-controller.interface'
import { Express, Request, RequestHandler, Response } from 'express'
import { ReportService } from '../services/report.service'
import { ErrorHandlerService } from '../services/error-handler.service'

export class ReportController implements EndpointController {
    private reportService = new ReportService()
    private errorHandlerService = new ErrorHandlerService()

    public registerEndpoints(app: Express): void {
        app.get('/api/v1/report/comments', this.getCommentsReport.bind(this) as RequestHandler)
    }

    private async getCommentsReport(request: Request, response: Response): Promise<void> {
        try {
            const reportMetrics = await this.reportService.compileCommentsReport()
            response.status(200).send(reportMetrics)
        } catch (error) {
            this.errorHandlerService.handleError(response, error)
        }
    }
}