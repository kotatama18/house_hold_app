import { Box } from '@mui/material'
import React from 'react'
import MonthlySummary from '../components/MonthlySummary.tsx'
import Calender from '../components/Calender.tsx'
import TransactionMenu from '../components/TransactionMenu.tsx'
import TransactionForm from '../components/TransactionForm.tsx'

const Home = () => {
  return (
    <Box sx={{display:'flex'}}>
      {/* 左側のコンテンツ */}
      {/* flexGrowを使えば画面幅を狭くした場合にここが画面いっぱいに残るようになる */}
      <Box sx={{flexGrow: 1}}> 
        <MonthlySummary />
        <Calender />
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