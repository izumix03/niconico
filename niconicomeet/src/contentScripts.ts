import axiosBase from 'axios'
import * as io from 'socket.io-client'

import { Config } from './config'
import { DisplayedDiv } from './models/displayDiv'
import { Message } from './models/message'

/**
 * 通信用インスタンス
 */
const axios = axiosBase.create({
  baseURL: Config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: 'json',
})

/**
 * タブ単位のニコニコ風エクステンションイベントハンドラー
 */
class NicoNico {
  private socket?: SocketIOClient.Socket = undefined
  private readonly lastPass: string | undefined
  private finishSetUp = false

  constructor() {
    const queryString = location.href.split('/').pop()
    if (!queryString) throw new Error('failed to extract query parameter')
    this.lastPass = queryString.split('?').shift()
    this.setBackGroundListener()
  }

  /***
   * 初期起動時処理
   */
  configure() {
    this.checkEnabled().then((enabled) => {
      enabled ? this.setUp() : this.disconnect()
    })
  }

  /**
   * niconicomeetが有効かどうか判定
   */
  private async checkEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          message: 'checkEnabled',
        },
        (response: { enabled: boolean }) => {
          resolve(response.enabled)
        },
      )
    })
  }

  /**
   * アクティブになった時の初期処理
   */
  private setUp() {
    this.connect()

    if (this.finishSetUp) return

    const result = this.addClickEventToChatOpenButton()
    this.finishSetUp = result || this.onEventsToChatComponent()

    if (!result) setTimeout(this.setUp.bind(this), 5000)
  }

  /**
   * web socket接続する
   */
  private connect() {
    if (this.socket) return

    this.socket = io.connect(Config.SERVER_URL + `/${this.lastPass}`, { forceNew: true })
    this.socket.on('comment', NicoNico.handleComment)
  }

  /**
   * web socket接続を切る
   */
  private disconnect() {
    if (!this.socket) return

    this.socket.disconnect()
    this.socket = undefined
  }

  /**
   * 受け取ったメッセージの表示処理
   * @param msg
   */
  private static handleComment(msg: Message) {
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const size = msg.size || 56

    new DisplayedDiv(msg.comment, size, color, shadow).append().animate(msg.duration)
  }

  /**
   * チャット画面を開くボタンのクリックイベント追加
   */
  private addClickEventToChatOpenButton(): boolean {
    const chatButton = document.querySelector('[aria-label="全員とチャット"]')

    if (!chatButton) return false

    chatButton.addEventListener('click', this.onEventsToChatComponent.bind(this))
    return true
  }

  /**
   * チャット画面のイベント
   */
  private onEventsToChatComponent(): boolean {
    const button = document.querySelector('[data-tooltip="メッセージを送信"]')
    button?.addEventListener('mouseup', this.postMessage.bind(this), true)

    const inputEl = NicoNico.getChatInputElement()

    if (!button || !inputEl) return false

    inputEl.addEventListener('keydown', this.postMessageIfKeydownEnterKey.bind(this), true)
    return true
  }

  /**
   * チャット画面でEnterを押して確定した際のイベント
   * @param e
   */
  private postMessageIfKeydownEnterKey(e: KeyboardEvent) {
    if (e.keyCode !== 13) {
      return false
    }
    this.postMessage()
  }

  /**に送る

   * チャット画面で入力中の内容をニコニコ風サーバ   */
  private postMessage() {
    const inputEls = document.getElementsByName('chatTextInput')
    if (!inputEls || inputEls.length !== 1) {
      return
    }

    const text = NicoNico.getChatInputElement()?.value
    if (!text) return

    axios.post(`/comment?id=${this.lastPass}`, {
      comment: text,
    })
  }

  /**
   * チャット 画面の input 要素を取得する
   * ※チャット 画面が開く度に変わる
   */
  private static getChatInputElement(): HTMLTextAreaElement | undefined {
    const inputEls = document.getElementsByName('chatTextInput')
    if (!inputEls || inputEls.length !== 1) {
      return undefined
    }

    return inputEls[0] as HTMLTextAreaElement
  }

  /**
   * アイコンクリック時のイベントをback groundから受け取る
   */
  private setBackGroundListener() {
    chrome.runtime.onMessage.addListener((req, sender, res) => {
      if (req.message === 'update') {
        this.configure()
        res()
        return true
      }
    })
  }
}

new NicoNico().configure()
