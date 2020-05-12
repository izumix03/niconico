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

    io.emit('comment', body.value())
    res.send('OK')
  } catch (e) {
    res.status(500).send(e)
  }
}
