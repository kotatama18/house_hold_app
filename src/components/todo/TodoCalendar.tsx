import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridplugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../../todoCalendar.css"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import { Todo, Transaction } from '../../types'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'
import { groupbyDailyTodos } from '../../utils/arrangeTodos.ts'



interface CalendarProps{
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
    setCurrentDay: React.Dispatch<React.SetStateAction<string>>
    currentDay: string
    today: string
    onDateClickOpenForm: (dateStr: string) => void,
    monthlyTodos: Todo[]
    onCheckChange: (task: any) => void
}
const Calendar = ({setCurrentMonth, setCurrentDay, currentDay, today, onDateClickOpenForm, monthlyTodos, onCheckChange}: CalendarProps) => {
    const theme = useTheme()
    //日付毎にタスクをまとめるメソッド
    const dailyTodos = groupbyDailyTodos(monthlyTodos)

    //FullCalender用のイベントを作成する関数
    const createCalendarEvents = (dailyTodos: Record<string, Todo[]>)=> {
        return Object.keys(dailyTodos).map((data)=>{
            return{
                start: data,
                extendedProps: {
                    title: dailyTodos[data].map(todo => todo.title), // ここでタスクのタイトルのみを渡す
                    type: dailyTodos[data].map(todo => todo.type),
                    category: dailyTodos[data].map(todo => todo.category),
                    status: dailyTodos[data].map(todo => todo.status),
                    all: dailyTodos[data]
                }
            }
        })
    };
    const calendarEvents = createCalendarEvents(dailyTodos);


    // 選択した日付(currentDay)のバックグラウンドカラーが変わる
    const backgroundEvent = {
        start: currentDay,
        display: "background",
        backgroundColor: theme.palette.todoColor.light
    }

    const handleClick = () =>{
        console.log("success")
    }

    //カレンダーにその日の内容をレンダリングする処理
    const renderEventContent = (eventInfo: EventContentArg) => {
        const title = eventInfo.event.extendedProps.title || [];
        const categories = eventInfo.event.extendedProps.category || [];
        const types = eventInfo.event.extendedProps.type || []; // 各todoのtypeを取得
        const statuses = eventInfo.event.extendedProps.status || []; 
        const dailyAllData = eventInfo.event.extendedProps.all || []; 
        return (
            <div>
                {title.length > 0 ? (
                    <ul>
                        {title.map((todo: string, index: number) => {
                            const category = categories[index]; 
                            const type = types[index];// 予定かタスクかを判断
                            const status = statuses[index];
                            const data = dailyAllData[index];
                            
                            
                            // チェックボックスと立体感を加えるスタイル
                            return (
                                <li 
                                    key={index} 
                                    className={`task ${type}`}
                                    onClick={() => handleClick()}
                                >
                                    {type === "タスク" ? (
                                        <>
                                            <span className={`task ${category}`}>
                                            <label>
                                            <input 
                                                type="checkbox" 
                                                className="task-checkbox" 
                                                checked={status==="完了"}
                                                // onChange={()=>onCheckChange(data)}
                                            />
                                            </label>
                                                {todo}
                                            </span>
                                        </>
                                    ) : (
                                        <span className={`scheduled ${category}`}>
                                            {todo}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : null}
            </div>
        );
    };
    
    

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
        // eventClick={(info) => {
        //     console.log("Event clicked:", info.event);
        //     alert(`イベント「${info.event.title}」がクリックされました！`);
        // }}
    />
  )
}

export default Calendar