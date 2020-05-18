import { Response } from 'express'
import socketio from 'socket.io'

import { SingleValueProvider } from '../models/requests'

export function handleRequest<T extends SingleValueProvider>(
  body: T,
  resource: string,
  res: Response,
  io: socketio.Server,
) {
  try {
    console.log(`post ${resource} body: `, body)
    io.emit(resource, body.value())
    res.send('OK')
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}
