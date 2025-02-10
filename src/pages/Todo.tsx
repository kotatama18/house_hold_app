import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TodoMonthlySummary from '../components/todo/TodoMonthlySummary.tsx'
import TodoCalendar from '../components/todo/TodoCalendar.tsx'
import TodoTransactionMenu from '../components/todo/TodoTransactionMenu.tsx'
import TodoTransactionForm from '../components/todo/TodoTransactionForm.tsx'
import { Todo, Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/schema.ts'
import { TodoSchema } from '../validations/todoSchema.ts'

interface HomeProps{
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  onSaveTransaction: (transaction: Schema) => Promise<void>
  onDeleteTransaction: (transacrionId: string) => Promise<void>
  onUpdateTransaction:  (transaction: Schema, transacrionId: string) => Promise<void>
  onSaveTodo: (transaction: TodoSchema) => Promise<void>
  onDeleteTodo: (transacrionId: string) => Promise<void>
  onUpdateTodo:  (transaction: TodoSchema, transacrionId: string) => Promise<void>
  monthlyTodos: Todo[]
}

// monthlyTransactions: 今月のTransactionsテーブルのデータ
const TodoHome = ({monthlyTransactions, setCurrentMonth, onSaveTransaction, onDeleteTransaction, onUpdateTransaction, onSaveTodo, onDeleteTodo, onUpdateTodo,monthlyTodos
  }: HomeProps, ) => {
  const today = format(new Date(), "yyyy-MM-dd");
  //選択した日付をステートとして管理する（初期値は今日の日付）
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false)
  //選択した取引を持つステート,何も持っていない場合はnull
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  //Transactionsテーブルから選択した日付のデータのみを取得する
  const dairyTransactions = monthlyTransactions.filter((transaction)=>{
    return transaction.date === currentDay;
  });
  //Todoテーブルから選択した日付のデータのみを取得する
  const dairyTodos = monthlyTodos.filter((todo)=>{
    return todo.date === currentDay;
  });

  //フォーム閉じるボタンでフォームの中身を空にする
  const closeForm = () =>{
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
    setSelectedTransaction(null);
  }

  //フォームの開閉処理
  const handleAddTodoForm = () =>{
    //フォームに表示される内容を空にする(取引カードをクリックした時に反映されたものを空にする)
    //フォームに値が入っている場合はそれを空にして、値が何もない場合はフォームを閉じる
    if(selectedTodo){
      setSelectedTodo(null)
    }else{
      setIsEntryDrawerOpen(!isEntryDrawerOpen)
    }
  }

  //取引が選択された時の処理(Todo)
  const handleSelectTodo = (todo: Todo) =>{
    //フォームが開く(何度教えても開きっぱ)
    setIsEntryDrawerOpen(true)
    setSelectedTodo(todo)
  }

  //カレンダーの日付マスをクリックしたらその日付のフォームが開く
  const handleDateClickOpenForm = (dateStr: string) =>{
    setSelectedTransaction(null)
    if(currentDay === dateStr){
      setIsEntryDrawerOpen(!isEntryDrawerOpen)
    }else{
      setIsEntryDrawerOpen(true)
    }
  }

  const handleCheckChange = (task) =>{
    console.log("etas" ,task)
    if(task.status === "完了"){
      task.status = "未完了"
    }else{
    task.status = "完了"
    }
    onUpdateTodo(task, task.id)
  }

  return (
    <Box sx={{display:'flex'}}>
      {/* 左側のコンテンツ */}
      {/* flexGrowを使えば画面幅を狭くした場合にここが画面いっぱいに残るようになる */}
      <Box sx={{flexGrow: 1}}> 
        <TodoMonthlySummary monthlyTransactions={monthlyTransactions}/>
        <TodoCalendar 
          setCurrentMonth={setCurrentMonth} 
          setCurrentDay={setCurrentDay} 
          currentDay={currentDay} 
          today={today}
          onDateClickOpenForm={handleDateClickOpenForm}
          monthlyTodos={monthlyTodos}
          onCheckChange={handleCheckChange}
        />
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        <TodoTransactionMenu  
          dairyTodos={dairyTodos} 
          currentDay={currentDay} 
          onAddTodoForm={handleAddTodoForm} 
          onSelectTodo={handleSelectTodo}
          onUpdateTodo={onUpdateTodo}
          onCheckChange={handleCheckChange}
        />
        <TodoTransactionForm 
          onCloseForm={closeForm} 
          isEntryDrawerOpen={isEntryDrawerOpen} 
          currentDay={currentDay} 
          onSaveTodo={onSaveTodo}
          selectedTodo={selectedTodo}
          onDeleteTodo={onDeleteTodo}
          setSelectedTodo={setSelectedTodo}
          onUpdateTodo={onUpdateTodo}
        />
      </Box>
    </Box>
  )
}

export default TodoHome