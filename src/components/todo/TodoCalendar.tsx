import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridplugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../../todoCalendar.css"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import { caluculateDailyBalances } from '../../utils/financeCalculations.ts'
import { Balance, CalendarContent, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatting.ts'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'



interface CalendarProps{
    monthlyTransactions: Transaction[],
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
    setCurrentDay: React.Dispatch<React.SetStateAction<string>>
    currentDay: string
    today: string
    onDateClickOpenForm: (dateStr: string) => void
}
const Calendar = ({monthlyTransactions, setCurrentMonth, setCurrentDay, currentDay, today, onDateClickOpenForm}: CalendarProps) => {
    const theme = useTheme()
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

    // 選択した日付(currentDay)のバックグラウンドカラーが変わる
    const backgroundEvent = {
        start: currentDay,
        display: "background",
        backgroundColor: theme.palette.todoColor.light
    }

    //カレンダーにその日の収支をレンダリングする処理
    const renderEventContent = (eventInfo: EventContentArg) => {
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

    //選択した月のデータを取得する、今月月を表示している時のみ今日の日付をステートに入れる
    const handleDateSet= (datesetInfo: DatesSetArg) => {
        const currentMonth = datesetInfo.view.currentStart
        setCurrentMonth(currentMonth)
        const todayDate = new Date()
        //表示月と今日の日付が合致するか確認する、その場合今日ボタンを押すと今日の日付を取得できる
        if(isSameMonth(todayDate, currentMonth)){
            setCurrentDay(today);
        }  
    }

    //選択した日付の情報を受け取る
    const handleDateClick = (dateInfo: DateClickArg) =>{
        onDateClickOpenForm(dateInfo.dateStr)
        setCurrentDay(dateInfo.dateStr)
    }

  return (
    <FullCalendar
        locale={jaLocale}
        plugins={[dayGridplugin, interactionPlugin]}
         // 月間ビューのオプション？
        initialView = 'dayGridMonth'
        events={[...calendarEvents, backgroundEvent]}
        eventContent={renderEventContent}
        datesSet={handleDateSet}
        dateClick={handleDateClick}
    />
  )
}

export default Calendar