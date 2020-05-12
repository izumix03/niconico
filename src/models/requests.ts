type ActionType = 'thumb' | 'bitkey'

export interface SingleValueProvider {
  value(): string
}

export class ActionRequest implements SingleValueProvider {
  constructor(private action: ActionType) {}

  value(): string {
    return this.action
  }
}

export class CommentRequest implements SingleValueProvider {
  constructor(private comment: string) {}

  value(): string {
    return this.comment
  }
}
