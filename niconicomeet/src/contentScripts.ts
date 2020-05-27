import { Config } from './config'
import * as io from 'socket.io-client';
import { Message } from './models/message'
import { DisplayedDiv } from './models/displayDiv';
import axiosBase from 'axios';

/**
 * 通信用インスタンス
 */
const axios = axiosBase.create({
  baseURL: Config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

/**
 * タブ単位のニコニコ風エクステンションイベントハンドラー
 */
class NicoNico {
  private socket?: SocketIOClient.Socket = undefined
  private readonly lastPass: string

  constructor() {
    this.lastPass = location.href.split('/').pop()?.split('?').shift()!
    this.setBackGroundListener()
  }

  /***
   * 初期起動時処理
   */
  configure() {
    console.log('configure!!')
    this.checkEnabled().then((enabled) => {
      enabled ? this.setup() : this.disconnect()
    })
  }

  /**
   * niconicomeetが有効かどうか判定
   */
  private async checkEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        message: 'checkEnabled'
      }, (response: { enabled: boolean }) => {
        resolve(response.enabled)
      })
    })
  }

  /**
   * アクティブになった時の初期処理
   */
  private setup() {
    this.connect()
    this.addClickEventToChatOpenButton()
    this.addEventsToChatComponent()
  }

  /**
   * web socket接続する
   */
  private connect() {
    if (this.socket) return

    this.socket = io.connect(Config.SERVER_URL + `/${this.lastPass}`, { 'forceNew': true })
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
    console.dir(msg)
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const size = msg.size || 56

    new DisplayedDiv(msg.comment, size, color, shadow)
      .append()
      .animate(msg.duration)
  }

  /**
   * チャット画面を開くボタンのクリックイベント設定
   */
  private addClickEventToChatOpenButton() {
    const chatButton = document.querySelector('[aria-label="他の参加者とチャット"]')
    chatButton?.removeEventListener('click', this.addEventsToChatComponent.bind(this))
    chatButton?.addEventListener('click', this.addEventsToChatComponent.bind(this))
  }

  /**
   * チャット画面のイベント設定
   */
  private addEventsToChatComponent() {
    const button = document.querySelector('[data-tooltip="メッセージを送信"]')
    button?.removeEventListener('mouseup', this.postMessage.bind(this))
    button?.addEventListener('mouseup', this.postMessage.bind(this), true)
    NicoNico.getChatInputElement()?.addEventListener('keydown', this.postMessageIfKeydownEnterKey.bind(this), true)
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
    console.log('postMessage')
    const inputEls = document.getElementsByName('chatTextInput')
    if (!inputEls || inputEls.length !== 1) {
      return
    }

    const text = NicoNico.getChatInputElement()?.value
    console.log(text)
    if (!text) return


    axios.post(`/comment?id=${this.lastPass}`, {
      comment: text
    })
    console.log('posted')
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

    return (<HTMLTextAreaElement>inputEls[0])
  }

  /**
   * アイコンクリック時のイベントをback groundから受け取る
   */
  private setBackGroundListener() {
    chrome.runtime.onMessage.addListener((req, sender, res) => {
      console.log('listen!!', req)
      if (req.message === 'update') {
        this.configure()
        res()
        return true
      }
    })
  }
}

new NicoNico().configure()
