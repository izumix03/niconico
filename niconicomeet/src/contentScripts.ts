import { Config } from './config'
import * as io from 'socket.io-client';

class NicoNico {
  private socket?: SocketIOClient.Socket = undefined

  configure() {
    this.checkEnabled().then((enabled) => {
      enabled ? this.connect() : this.disconnect()
    })
  }

  private async checkEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        message: 'checkEnabled'
      }, (response: { enabled: boolean }) => {
        resolve(response.enabled)
      })
    })
  }

  private connect() {
    if (this.socket) return

    this.socket = io.connect(Config.SERVER_URL, { 'forceNew': true })
    this.socket.on('comment', NicoNico.handleComment)
    console.log(`niconico: connect to ${Config.SERVER_URL}`)
  }

  private disconnect() {
    if (!this.socket) return

    this.socket.disconnect()
    this.socket = undefined

    console.log(`niconico: disconnect from ${Config.SERVER_URL}`)
  }

  private static handleComment(msg: Msg) {
    console.dir(msg)
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const size = msg.size || 56

    new DisplayedDiv(msg.comment, size, color, shadow)
      .append()
      .animate(msg.duration)
  }
}

interface Msg {
  comment: string
  duration?: number
  color?: string
  shadow?: string
  size?: number
}

class DisplayedDiv {
  private readonly div: HTMLDivElement

  constructor(body: string, size: number, color: string, shadow: string) {
    this.div = document.createElement('div')
    this.div.style.position = 'fixed'
    this.div.style.left = window.innerWidth + 'px'
    this.div.style.top = DisplayedDiv.random(window.innerHeight - 40) + 'px'
    this.div.style.fontSize = size + 'pt'
    this.div.style.fontWeight = 'bold'
    this.div.style.color = color
    this.div.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
    this.div.style.whiteSpace = 'pre'
    this.div.style.zIndex = '2147483647'
    this.div.innerText = body
  }

  append(): DisplayedDiv {
    document.body.appendChild(this.div)
    return this
  }

  animate(duration?: number) {
    const effect = [{
      left: window.innerWidth + 'px'
    }, {
      left: -this.div.offsetWidth + 'px'
    }]

    const timing = {
      duration: (duration || 2000) * (window.innerWidth + this.div.offsetWidth) / window.innerWidth,
      iterations: 1,
      easing: 'linear'
    }

    this.div.style.top = DisplayedDiv.random(window.innerHeight - this.div.offsetHeight) + 'px'
    this.div.animate(effect, timing).onfinish = () => {
      document.body.removeChild(this.div)
    }
  }

  private static random(value: number) {
    return Math.floor(value * Math.random())
  }
}

new NicoNico().configure()
