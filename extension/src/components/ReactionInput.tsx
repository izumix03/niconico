import React from 'react'
import { Button } from '@material-ui/core';
import axiosBase from 'axios';
import { Config } from '../config';

const axios = axiosBase.create({
  baseURL: Config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

interface State {
  comment: string | undefined
}

/**
 * リアクション入力部品
 */
export default class ReactionInput extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <input onChange={this.handleCommentChange.bind(this)}/>
        <Button variant="contained" onClick={this.postComment.bind(this)}>Comment!!</Button>
      </div>
    )
  }

  /**
   * コメント変更時にstateに反映する
   * @param e イベント
   */
  handleCommentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    this.setState({ comment: title })
  }

  /**
   * コメントを送信する
   * TODO: axiosで登録する
   */
  postComment() {
    console.log(this.state?.comment)
    if (!this.state?.comment) {
      return
    }
    axios.post('/comment', {
      comment: this.state.comment
    })
  }
}
