import { Config } from './config'

const execute = async () => {
  console.log(Config.SERVER_URL)
}

execute().then(() => {
  console.log('finish')
}).catch(e => {
  console.error(e)
})

const links: HTMLCollectionOf<HTMLAnchorElement> = document.getElementsByTagName("a")

// popup.jsからメッセージを受け取って、ページ内で取得したデータを送り返す
chrome.runtime.onMessage.addListener(() => {
  // @ts-ignore
  chrome.runtime.sendMessage({ urlList: [...links].map((a: HTMLAnchorElement) => a.href)});
});
