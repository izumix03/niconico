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
    chrome.browserAction.onClicked.addListener(() => {
      this.enabled = !this.enabled
      this.update()
    })

    chrome.runtime.onMessage.addListener((req, sender, res) => {
      if (req.message === 'checkEnabled') {
        res({ enabled: this.enabled })
        return true
      }
    })
  }

  private update() {
    chrome.storage.sync.set({ enabled: this.enabled })
    const detailIcons = this.enabled ? details : disabledDetails
    chrome.browserAction.setIcon(detailIcons)

    // TODO: considering other tab
  }
}

new BackGround().configure()
