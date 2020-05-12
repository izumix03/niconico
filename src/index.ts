import bodyParser from 'body-parser'
import express from 'express'
import * as http from 'http'
import socketio from 'socket.io'

import { handleAction } from './routes/action_router'
import { handleComment } from './routes/comment_router'

const app = express()
const server: http.Server = http.createServer(app)
const io: socketio.Server = socketio(server)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/action', (req, res) => handleAction(req, res, io))
app.post('/comment', (req, res) => handleComment(req, res, io))

io.on('connection', (socket) => {
  console.log('connected: ' + socket.request.connection.remoteAddress)

  socket.on('disconnect', function () {
    console.log('disconnected: ' + socket.request.connection.remoteAddress)
  })
})

server.listen(80, () => console.log('listening on *:80'))
