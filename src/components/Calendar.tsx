import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridplugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../calendar.css"
import { EventContentArg } from '@fullcalendar/core'

const Calendar = () => {
    const events = [
        { title: 'Me', start: "2025-01-20"},
        { title: 'Ma', start: "2025-01-29", income:300, expense: 200, balance:100}
    ]


    const renderEventContent = (eventInfo: EventContentArg) => {
        console.log(eventInfo)
        return(
            <div>
                <div className='money' id="event-income">
                    {eventInfo.event.extendedProps.income}
                </div>
                <div className='money' id="event-expense">
                    {eventInfo.event.extendedProps.expense}
                </div>
                <div className='money' id="event-balance">
                    {eventInfo.event.extendedProps.balance}
                </div>
            </div>
        )
    }

  return (
    <FullCalendar
        locale={jaLocale}
        plugins={[dayGridplugin]}
         // 月間ビューのオプション？
        initialView = 'dayGridMonth'
        events={events}
        eventContent={renderEventContent}
    />
  )
}

export default Calendar