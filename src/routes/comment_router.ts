import { Request, Response } from 'express'
import socketio from 'socket.io'

import { CommentRequest } from '../models/requests'
import { handleRequest } from './simple_router'

export function handleComment(req: Request, res: Response, io: socketio.Server) {
  handleRequest<CommentRequest>(req.body, 'comment', res, io)
}