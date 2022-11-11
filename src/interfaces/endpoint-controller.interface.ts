import { Express } from 'express'

export interface EndpointController {
    registerEndpoints(app: Express): void
}