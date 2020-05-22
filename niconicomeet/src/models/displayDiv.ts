export class DisplayedDiv {
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
