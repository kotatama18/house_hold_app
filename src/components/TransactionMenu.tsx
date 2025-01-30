import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
//アイコン
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DailySummary from "./DailySummary.tsx";
import { Transaction } from "../types/index.ts";
import { formatCurrency } from "../utils/formatting.ts";
import IconComponents from "./common/iconComponents.tsx";


interface TransactionMenuProps {
  dairyTransactions: Transaction[],
  currentDay: string,
  onAddTransactionForm: ()=> void,
  onSelectTransaction: (transaction: Transaction)=> void;
}

const TransactionMenu = ({dairyTransactions, currentDay, onAddTransactionForm, onSelectTransaction}:TransactionMenuProps) => {
  const menuDrawerWidth = 320;
  return (
    //メニュー全体
    <Drawer
      sx={{
        width: menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: menuDrawerWidth,
          boxSizing: "border-box",
          p: 2,
          top: 64,
          height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
        },
      }}
      variant={"permanent"}
      anchor={"right"}
    >
      {/* stackで囲むことで要素が均等に配置される。 */}
      <Stack sx={{ height: "100%" }} spacing={2}>
        {/* 選択した日付の出力 */}
        <Typography fontWeight={"fontWeightBold"}>日時： {currentDay}</Typography>
        {/* 選択した日付の収支を確認する */}
        <DailySummary dairyTransactions={dairyTransactions}/>
        {/* 内訳タイトル&内訳追加ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* 左側のメモアイコンとテキスト */}
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>
          {/* 右側の追加ボタン */}
          <Button startIcon={<AddCircleIcon />} color="primary" onClick={onAddTransactionForm}>
            内訳を追加
          </Button>
        </Box>
        {/* 取引一覧 */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
               {/* これで1取引単位 */}
              {dairyTransactions.map((transaction, index)=>(
                <ListItem disablePadding key={index}>
                {/* 複数の取引カードを制御できる。 */}
                <Card
                  sx={{
                    width: "100%",
                    backgroundColor: transaction.type==="income"?(theme)=> theme.palette.incomeColor.light : (theme)=> theme.palette.expenseColor.light
                  }}
                  //取引カードを選択した時
                  onClick={()=> onSelectTransaction(transaction)}
                >
                  <CardActionArea>
                    <CardContent>
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        wrap="wrap"
                      >
                        <Grid item xs={1}>
                          {/* icon */}
                          {IconComponents[transaction.category]}
                        </Grid>
                        <Grid item xs={2.5}>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            {transaction.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" gutterBottom>
                          {transaction.content}
                          </Typography>
                        </Grid>
                        <Grid item xs={4.5}>
                          <Typography
                            gutterBottom
                            textAlign={"right"}
                            color="text.secondary"
                            sx={{
                              wordBreak: "break-all",
                            }}
                          >
                            ¥{formatCurrency(transaction.amount)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};
export default TransactionMenu;
