// @flow

import React, { Component } from 'react'
import { computed, observable } from 'mobx'
import { observer, inject } from 'mobx-react'

import Greeting from 'lib/greeting'

import type Account from 'src/models/Account'

import List from './List'
import EventCell from './EventCell'
import CalendarSelect from './CalendarSelect'

import style from './style'

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

type tProps = {
  account: Account
}

@inject('account')
@observer
class Agenda extends Component<tProps> {
  /**
   * Create an observable to track the selected calendar. Default is All
   */
  @observable selectedCalendar = {
    id: 'All',
  };

  /**
   * Return events from all calendars, sorted by date-time.
   * Returned objects contain both Event and corresponding Calendar
   */
  @computed
  get events (): Array<{ calendar: Calendar, event: Event }> {
    const events = this.props.account.calendars.filter(c => c.id === this.selectedCalendar.id || this.selectedCalendar.id === 'All')
      .map((calendar) => (
        calendar.events.map((event) => (
          { calendar, event }
        ))
      ))
      .flat()

    // Sort events by date-time, ascending
    events.sort((a, b) => (a.event.date.diff(b.event.date).valueOf()))

    return events
  }

  // Function to handle users input of selected calendar. Passed to the CalendarSelect Component
  handleCalendarChange = (e) => {
    this.selectedCalendar = {
      id: e.target.value,
    }
  }
  render () {
    return (
      <div className={style.outer}>
        <div className={style.container}>

          <div className={style.header} style={{display: 'flex', justifyContent: 'space-around'}}>
            <div>
              <span className={style.title}>
                <Greeting />
              </span>
            </div>
            <CalendarSelect
              calendars={this.props.account.calendars}
              handleCalendarChange={this.handleCalendarChange} />
          </div>
          <List>
            {this.events.map(({ calendar, event }) => (
              <EventCell key={event.id} calendar={calendar} event={event} />
            ))}
          </List>

        </div>
      </div>
    )
  }
}

export default Agenda
