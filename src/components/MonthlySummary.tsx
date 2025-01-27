import { Card, CardContent, Grid, Stack, Typography} from '@mui/material'
import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BalanceIcon from '@mui/icons-material/Balance';
import { Transaction } from '../types';
import { financeCalculations } from '../utils/financeCalculations.ts';

interface MonthlySummaryprops{
    monthlyTransactions: Transaction[],
}
// monthlyTransactions: 今月のTransactionsテーブルのデータ
const MonthlySummary = ({monthlyTransactions}: MonthlySummaryprops) => {
    const {income, expense, balance} = financeCalculations(monthlyTransactions)

  return (
    // spacingで全Grid毎の間隔をつける  mgで要素全体の下に余白をつける
    <Grid container spacing={{xs: 1, sm:2}} mg={2}>
        {/* 収入 */}
        {/* Grid毎にxs={4}とすることでトータル12を4ずつ使うようにしている */}
        {/* display={flex}とflexDirection={column}をする事でどこかのカードが縦長になると他も同じサイズになる */}
        <Grid item xs={4} display={"flex"} flexDirection={"column"}>
            <Card sx={{bgcolor: (theme)=>theme.palette.incomeColor.main, color: "white", borderRadius: "10px", flexGrow: 1,}}>
                <CardContent sx={{padding:{xs: 1, sm: 2}}}>
                    <Stack direction={"row"}>
                        <ArrowUpwardIcon sx={{fontSize: "2rem"}} />
                        <Typography>収入</Typography>
                    </Stack>
                    <Typography 
                    textAlign={"right"} 
                    variant="h5" 
                    fontWeight={"fontWeightBold"}
                    // wordBreakは文字が大きくなった時用の処理？
                    sx={{wordBreak: "break-word", fontSize:{xs: ".8rem", sm: "1rem", md:"1.2rem"}}}
                    >
                        ¥{income}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        {/* 支出 */}
        <Grid item xs={4} display={"flex"} flexDirection={"column"}>
            <Card sx={{bgcolor: (theme)=>theme.palette.expenceColor.main, color: "white", borderRadius: "10px", flexGrow: 1,}}>
                <CardContent sx={{padding:{xs: 1, sm: 2}}}>
                    <Stack direction={"row"}>
                        <ArrowDownwardIcon sx={{fontSize: "2rem"}} />
                        <Typography>支出</Typography>
                    </Stack>
                    <Typography 
                    textAlign={"right"} 
                    variant="h5" 
                    fontWeight={"fontWeightBold"}
                    sx={{wordBreak: "break-word", fontSize:{xs: ".8rem", sm: "1rem", md:"1.2rem"}}}
                    >
                        ¥{expense}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        {/* 残高 */}
        <Grid item xs={4} display={"flex"} flexDirection={"column"}>
            <Card sx={{bgcolor: (theme)=>theme.palette.balanceColor.main, color: "white", borderRadius: "10px", flexGrow: 1,}}>
                <CardContent sx={{padding:{xs: 1, sm: 2}}}>
                    <Stack direction={"row"}>
                        <BalanceIcon sx={{fontSize: "2rem"}} />
                        <Typography>残高</Typography>
                    </Stack>
                    <Typography 
                    textAlign={"right"} 
                    variant="h5" 
                    fontWeight={"fontWeightBold"}
                    sx={{wordBreak: "break-word", fontSize:{xs: ".8rem", sm: "1rem", md:"1.2rem"}}}
                    >
                        ¥{balance}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
  )
}

export default MonthlySummary