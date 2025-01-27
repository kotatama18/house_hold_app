import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridplugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../calendar.css"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import { caluculateDailyBalances } from '../utils/financeCalculations.ts'
import { Balance, CalendarContent, Transaction } from '../types'
import { formatCurrency } from '../utils/formatting.ts'

interface CalendarProps{
    monthlyTransactions: Transaction[],
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}
const Calendar = ({monthlyTransactions, setCurrentMonth}: CalendarProps) => {

    //日付毎の収支を取得するメソッド
    const dailyBalances = caluculateDailyBalances(monthlyTransactions)

    //FullCalender用のイベントを作成する関数
    const createCalendarEvents = (dailyBalances: Record<string, Balance>): CalendarContent[]=> {
        return Object.keys(dailyBalances).map((date)=>{
            const {income, expense, balance}=dailyBalances[date]
            return{
                start: date,
                income: formatCurrency(income),
                expense: formatCurrency(expense),
                balance: formatCurrency(balance)
            }
        })
    };
    const calendarEvents = createCalendarEvents(dailyBalances);

    //カレンダーにその日の収支をレンダリングする処理
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

    //選択した月のデータを取得する
    const handleDateSet= (datesetInfo: DatesSetArg) => {
        setCurrentMonth(datesetInfo.view.currentStart)
    }

  return (
    <FullCalendar
        locale={jaLocale}
        plugins={[dayGridplugin]}
         // 月間ビューのオプション？
        initialView = 'dayGridMonth'
        events={calendarEvents}
        eventContent={renderEventContent}
        datesSet={handleDateSet}
    />
  )
}

export default Calendar