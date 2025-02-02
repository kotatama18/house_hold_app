import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MonthlySummary from '../components/MonthlySummary.tsx'
import Calendar from '../components/Calendar.tsx'
import TransactionMenu from '../components/TransactionMenu.tsx'
import TransactionForm from '../components/TransactionForm.tsx'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/schema.ts'

interface HomeProps{
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  onSaveTransaction: (transaction: Schema) => Promise<void>
  onDeleteTransaction: (transacrionId: string) => Promise<void>
  onUpdateTransaction:  (transaction: Schema, transacrionId: string) => Promise<void>
}

// monthlyTransactions: 今月のTransactionsテーブルのデータ
const Todo = ({monthlyTransactions, setCurrentMonth, onSaveTransaction, onDeleteTransaction, onUpdateTransaction
  }: HomeProps, ) => {
  const today = format(new Date(), "yyyy-MM-dd");
  //選択した日付をステートとして管理する（初期値は今日の日付）
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false)
  //選択した取引を持つステート,何も持っていない場合はnull
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  //Transactionsテーブルから選択した日付のデータのみを取得する
  const dairyTransactions = monthlyTransactions.filter((transaction)=>{
    return transaction.date === currentDay;
  });

  //フォーム閉じるボタンでフォームの中身を空にする
  const closeForm = () =>{
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
    setSelectedTransaction(null);
  }

  //フォームの開閉処理
  const handleAddTransactionForm = () =>{
    //フォームに表示される内容を空にする(取引カードをクリックした時に反映されたものを空にする)
    //フォームに値が入っている場合はそれを空にして、値が何もない場合はフォームを閉じる
    if(selectedTransaction){
      setSelectedTransaction(null)
    }else{
      setIsEntryDrawerOpen(!isEntryDrawerOpen)
    }
  }

  //取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) =>{
    //フォームが開く(何度教えても開きっぱ)
    setIsEntryDrawerOpen(true)
    setSelectedTransaction(transaction)
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


  return (
    <Box sx={{display:'flex'}}>
      {/* 左側のコンテンツ */}
      {/* flexGrowを使えば画面幅を狭くした場合にここが画面いっぱいに残るようになる */}
      <Box sx={{flexGrow: 1}}> 
        <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calendar 
          monthlyTransactions={monthlyTransactions} 
          setCurrentMonth={setCurrentMonth} 
          setCurrentDay={setCurrentDay} 
          currentDay={currentDay} 
          today={today}
          onDateClickOpenForm={handleDateClickOpenForm}
        />
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        <TransactionMenu  
          dairyTransactions={dairyTransactions} 
          currentDay={currentDay} 
          onAddTransactionForm={handleAddTransactionForm} 
          onSelectTransaction={handleSelectTransaction}
        />
        <TransactionForm 
          onCloseForm={closeForm} 
          isEntryDrawerOpen={isEntryDrawerOpen} 
          currentDay={currentDay} 
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
        />
      </Box>
    </Box>
  )
}

export default Todo