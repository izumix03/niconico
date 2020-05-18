import Button from '@material-ui/core/Button'
import React from 'react'
import ReactionInput from './ReactionInput'

/**
 * 画面全体
 */
export default class Layout extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <ReactionInput/>
        <h1>It is me!</h1>
        <Button variant="contained">Click Here</Button>
      </div>
    )
  }
}
