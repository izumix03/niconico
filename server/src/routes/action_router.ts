import { Request, Response } from 'express'
import socketio from 'socket.io'

import { ActionRequest } from '../models/requests'
import { handleRequest } from './simple_router'

export function handleAction(req: Request, res: Response, io: socketio.Server) {
  handleRequest<ActionRequest>(req.body, 'action', res, io)
}