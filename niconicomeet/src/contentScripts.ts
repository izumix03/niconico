import { Config } from './config'
import * as io from 'socket.io-client';
import { Message } from './models/message'
import { DisplayedDiv } from './models/displayDiv';
import axiosBase from 'axios';

const axios = axiosBase.create({
  baseURL: Config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

class NicoNico {
  private socket?: SocketIOClient.Socket = undefined
  private lastPass?: string

  constructor() {
    this.setBackGroundListener()
  }

  configure(url: string) {
    console.log('configure!!')
    this.checkEnabled().then((enabled) => {
      this.lastPass = url.split('/').pop()?.split('?').shift()
      enabled ? this.setup() : this.disconnect()
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

  private setup() {
    this.setListener()
    this.connect()
  }

  private connect() {
    if (this.socket) return

    console.log(Config.SERVER_URL + `/id-${this.lastPass}`)
    this.socket = io.connect(Config.SERVER_URL + `/${this.lastPass}`, { 'forceNew': true })
    this.socket.on('comment', NicoNico.handleComment)
    console.log(`niconico: connect to ${Config.SERVER_URL}`)
  }

  private disconnect() {
    if (!this.socket) return

    this.socket.disconnect()
    this.socket = undefined

    console.log(`niconico: disconnect from ${Config.SERVER_URL}`)
  }

  private static handleComment(msg: Message) {
    console.dir(msg)
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const size = msg.size || 56

    new DisplayedDiv(msg.comment, size, color, shadow)
      .append()
      .animate(msg.duration)
  }

  private setListener() {
    const chatButton = document.querySelector('[aria-label="他の参加者とチャット"]')
    chatButton?.removeEventListener('click', this.setupInput.bind(this))
    chatButton?.addEventListener('click', this.setupInput.bind(this))
  }

  private setupInput() {
    const button = document.querySelector('[data-tooltip="メッセージを送信"]')
    if (!button) {
      console.log('failed to find button')
    }
    button?.removeEventListener('mouseup', this.postMessage.bind(this))
    button?.addEventListener('mouseup', this.postMessage.bind(this), true)
    NicoNico.getInput()?.addEventListener('keydown', this.pressEnterKey.bind(this), true)

    console.log('success to setup!!')
  }

  private pressEnterKey(e: KeyboardEvent) {
    if (e.keyCode !== 13) {
      return false
    }
    this.postMessage()
  }

  private postMessage() {
    console.log('postMessage')
    const inputEls = document.getElementsByName('chatTextInput')
    if (!inputEls || inputEls.length !== 1) {
      return
    }

    const text = NicoNico.getInput()?.value
    console.log(text)
    if (!text) return


    axios.post(`/comment?id=${this.lastPass}`, {
      comment: text
    })
    console.log('posted')
  }

  private static getInput(): HTMLTextAreaElement | undefined {
    const inputEls = document.getElementsByName('chatTextInput')
    if (!inputEls || inputEls.length !== 1) {
      return undefined
    }

    return (<HTMLTextAreaElement>inputEls[0])
  }

  private setBackGroundListener() {
    chrome.runtime.onMessage.addListener((req, sender, res) => {
      console.log('listen!!', req)
      if (req.message === 'update') {
        this.configure(req.url)
        res()
        return true
      }
    })
  }
}

new NicoNico()
