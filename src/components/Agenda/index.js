// @flow

import React, { Component } from 'react'
import { computed, observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'

import Greeting from 'lib/greeting'

import type Account from 'src/models/Account'

import List from './List'
import EventCell from './EventCell'
import CalendarSelect from './CalendarSelect'
import SectionHeader from './SectionHeader';

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

  /*
  * Create an observable to track whether the group toggle is on or off
  */
 @observable groupToggle = {
   on: false,
 };

  /**
   * Return events from all calendars, sorted by date-time.
   * Returned objects contain both Event and corresponding Calendar
   */
  @computed
  get events(): Array<{ calendar: Calendar, event: Event }> {
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

  // Function to handle users toggling the group functionality
  handleGroupToggle = (e) => {
    this.groupToggle = e.target.checked
  }

  // Use this function to get dept grouping if the toggle is on
  renderEvents = () => {
    const depts = _.groupBy(this.events, function (currentObject) {
      return currentObject.event.department === undefined ? 'No Dept' : currentObject.event.department
    })
    let groupedResults = []
    for (let dept in depts) {
      groupedResults.push(
        <div key={dept}>
          <SectionHeader label={dept} />
          <List>
            {this.events.filter(e => e.event.department === dept || (e.event.department === undefined && dept === 'No Dept')).map(({ calendar, event }) => (
              <EventCell key={event.id} calendar={calendar} event={event} />
            ))}
          </List>
        </div>,
      )
    }   
    if (this.groupToggle === true) {
      return groupedResults
    } else {
      return <List>
        {this.events.map(({ calendar, event }) => (
          <EventCell key={event.id} calendar={calendar} event={event} />
        ))}
      </List>
    }
  }

  render () {
    return (
      <div className={style.outer}>
        <div className={style.container}>
          <div className={style.header} >
            <div>
              <span className={style.title}>
                <Greeting />
              </span>
            </div>
          </div>
          <div className={style.header} style={{display: 'flex', justifyContent: 'space-around'}} >
            <CalendarSelect
              calendars={this.props.account.calendars}
              handleCalendarChange={this.handleCalendarChange} />
            <div className={style.checkboxContainer}>
              <span>Group Results: </span>
              <input type='checkbox' onChange={this.handleGroupToggle} />
            </div>
          </div>
          {this.renderEvents()}
        </div>
      </div>
    )
  }
}

export default Agenda
