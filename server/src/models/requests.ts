type ActionType = 'thumb' | 'bitkey'

interface Msg {
  comment: string
  duration?: number
  color?: string
  shadow?: string
  size?: number
}

export interface SingleValueProvider {
  value(): Msg
}

export class ActionRequest implements SingleValueProvider {
  constructor(private action: ActionType) {
  }

  value(): Msg {
    return {
      comment: this.action,
      duration: 2000
    }
  }
}

export class CommentRequest implements SingleValueProvider {
  constructor(private comment: string) {
  }

  value(): Msg {
    return {
      comment: this.comment.toString(),
      duration: this.duration()
    }
  }

  private duration(): number {
    if (this.comment.length <= 5) {
      return 2000
    }
    if (this.comment.length <= 15) {
      return 2500
    }
    return 3000
  }
}
