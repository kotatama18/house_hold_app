import { Box } from '@mui/material'
import React, { useState } from 'react'
import MonthlySummary from '../components/MonthlySummary.tsx'
import Calendar from '../components/Calendar.tsx'
import TransactionMenu from '../components/TransactionMenu.tsx'
import TransactionForm from '../components/TransactionForm.tsx'
import { Transaction } from '../types'
import { format } from 'date-fns'

interface HomeProps{
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

// monthlyTransactions: 今月のTransactionsテーブルのデータ
const Home = ({monthlyTransactions, setCurrentMonth}: HomeProps, ) => {
  const today = format(new Date(), "yyyy-MM-dd");
  //選択した日付をステートとして管理する（初期値は今日の日付）
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false)
  //Transactionsテーブルから選択した日付のデータのみを取得する
  const dairyTransactions = monthlyTransactions.filter((transaction)=>{
    return transaction.date === currentDay;
  });


  const closeForm = () =>{
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
  }

  //フォームの開閉処理
const handleAddTransactionForm = () =>{
  setIsEntryDrawerOpen(!isEntryDrawerOpen)
}

  return (
    <Box sx={{display:'flex'}}>
      {/* 左側のコンテンツ */}
      {/* flexGrowを使えば画面幅を狭くした場合にここが画面いっぱいに残るようになる */}
      <Box sx={{flexGrow: 1}}> 
        <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calendar monthlyTransactions={monthlyTransactions} setCurrentMonth={setCurrentMonth} setCurrentDay={setCurrentDay} currentDay={currentDay} today={today}/>
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        <TransactionMenu  dairyTransactions={dairyTransactions} currentDay={currentDay} onAddTransactionForm={handleAddTransactionForm}/>
        <TransactionForm onCloseForm={closeForm} isEntryDrawerOpen={isEntryDrawerOpen} currentDay={currentDay}/>
      </Box>
    </Box>
  )
}

export default Home