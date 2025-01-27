import { Box } from '@mui/material'
import React from 'react'
import MonthlySummary from '../components/MonthlySummary.tsx'
import Calendar from '../components/Calendar.tsx'
import TransactionMenu from '../components/TransactionMenu.tsx'
import TransactionForm from '../components/TransactionForm.tsx'
import { Transaction } from '../types'

interface HomeProps{
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

// monthlyTransactions: 今月のTransactionsテーブルのデータ
const Home = ({monthlyTransactions, setCurrentMonth}: HomeProps, ) => {
  return (
    <Box sx={{display:'flex'}}>
      {/* 左側のコンテンツ */}
      {/* flexGrowを使えば画面幅を狭くした場合にここが画面いっぱいに残るようになる */}
      <Box sx={{flexGrow: 1}}> 
        <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calendar monthlyTransactions={monthlyTransactions} setCurrentMonth={setCurrentMonth}/>
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        <TransactionMenu />
        <TransactionForm />
      </Box>
    </Box>
  )
}

export default Home