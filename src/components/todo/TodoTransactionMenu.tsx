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

  import { Transaction } from "../../types/index.ts";
  import { formatCurrency } from "../../utils/formatting.ts";
  import IconComponents from "../common/iconComponents.tsx";
  
  
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
              <Typography variant="body1">タスク一覧</Typography>
            </Box>
            {/* 右側の追加ボタン */}
            <Button startIcon={<AddCircleIcon />} color="primary" onClick={onAddTransactionForm}>
              タスクを追加
            </Button>
          </Box>
          <div>タスク一覧がきますよ〜</div>
        </Stack>
      </Drawer>
    );
  };
  export default TransactionMenu;
  