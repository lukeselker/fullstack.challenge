// @flow

import React from 'react'
import { observer } from 'mobx-react'

import type Calendar from 'src/models/Calendar'

import style from './style'

/**
 * Select Component to allow user
 * to select a specific calendar to view
 */

type tProps = {
  calendar: Calendar,
}

export default observer(({ calendars, handleCalendarChange }: tProps) => {
  return (
    <div className={style.selectWrapper}>
      <form>
        <select className={style.select} onChange={handleCalendarChange}>
          <option className={style.selectOption} key={'All'} value={'All'}>All Calendars</option>
          {calendars.map((calendar) => (
            <option className={style.selectOption} key={calendar.id} value={calendar.id}>{calendar.id}</option>
          ))}
        </select>
      </form>
    </div>
  )
})
