import Tab = chrome.tabs.Tab;

const details = {
  path: {
    '19': 'icon19.png',
    '38': 'icon38.png'
  }
}

const disabledDetails = {
  path: {
    '19': 'icon19_disabled.png',
    '38': 'icon38_disabled.png'
  }
}

class BackGround {
  private enabled: boolean

  constructor() {
    this.enabled = false
  }

  configure() {
    chrome.browserAction.onClicked.addListener((tab) => {
      this.enabled = !this.enabled
      this.update(tab)
    })

    chrome.runtime.onMessage.addListener((req, sender, res) => {
      if (req.message === 'checkEnabled') {
        res({ enabled: this.enabled })
        return true
      }
    })
  }

  private update(tab: Tab) {
    chrome.storage.sync.set({ enabled: this.enabled })
    const detailIcons = this.enabled ? details : disabledDetails
    chrome.browserAction.setIcon(detailIcons)

    chrome.tabs.sendMessage(tab.id || 1, { message: 'update', url: tab.url })
    // TODO: considering other tab
  }
}

new BackGround().configure()
