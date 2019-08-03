import { DateTime } from 'luxon'
import { Component } from 'react'
// @flow

/**
 * Greeting string depending on the time of day.
 */

class Greeting extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hour: DateTime.local().hour,
    }
  }

  componentDidMount () {
    this.intervalID = setInterval(
      () => this.tick(),
      1000,
    )
  }
  componentWillUnmount () {
    clearInterval(this.intervalID)
  }

  // keep track of the hour within the state of this component
  tick () {
    this.setState({
      hour: DateTime.local().hour,
    })
  }

  render () {
    let { hour } = this.state
    if (hour < 6) {
      return 'Good night'
    }
    else if (hour < 12) {
      return 'Good morning'
    }
    else if (hour < 18) {
      return 'Good afternoon'
    }
    else if (hour < 22) {
      return 'Good evening'
    }
    else {
      return 'Good night'
    }
  }
}

export default Greeting
