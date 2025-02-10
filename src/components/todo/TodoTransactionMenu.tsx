import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Checkbox,
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

  import { Todo, Transaction } from "../../types/index.ts";
  import { formatCurrency } from "../../utils/formatting.ts";
  import TodoIconComponents from "../common/TodoIconComponents.tsx";
  import { theme } from "../../theme/theme.ts";
import { TodoSchema } from "../../validations/todoSchema.ts";
  
  
  interface TransactionMenuProps {
    dairyTodos: Todo[],
    currentDay: string,
    onAddTodoForm: ()=> void,
    onSelectTodo: (transaction: Todo)=> void;
    onUpdateTodo: (transaction: TodoSchema, transacrionId: string) => Promise<void>
    onCheckChange: (task: any) => void
  }
  
  const TransactionMenu = ({dairyTodos, currentDay, onAddTodoForm, onSelectTodo, onCheckChange}:TransactionMenuProps) => {
    const menuDrawerWidth = 320;

    //Todoテーブルから予約タイプのデータのみを取得する
    const schedules = dairyTodos.filter((todo)=>{
      return todo.type === "予定";
    });
    //Todoテーブルからタスクタイプののデータのみを取得する
    const tasks = dairyTodos.filter((todo)=>{
      return todo.type === "タスク";
    });
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
        {/* 予定*/}
        {/* stackで囲むことで要素が均等に配置される。 */}
        <Stack sx={{ height: "50%" }} spacing={2}>
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
              <Typography variant="body1">予定一覧</Typography>
            </Box>
            {/* 右側の追加ボタン */}
            <Button startIcon={<AddCircleIcon />} sx={{ color: theme.palette.todoColor.main }} onClick={onAddTodoForm}>
              予定を追加
            </Button>
          </Box>
          {/* 予定一覧 */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
               {/* これで1取引単位 */}
              {schedules.map((todo, index)=>(
                <ListItem disablePadding key={index}>
                {/* 複数の取引カードを制御できる。 */}
                <Card
                  sx={{
                    width: "100%",
                    backgroundColor: todo.category==="会社"?(theme)=> theme.palette.workColor.light : todo.category==="プライベート"?(theme)=> theme.palette.privateColor.light : (theme)=> theme.palette.studyColor.light
                  }}
                  //取引カードを選択した時
                  onClick={()=> onSelectTodo(todo)}
                >
                  <CardActionArea>
                    <CardContent>
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        wrap="wrap"
                      >
                        <Grid item xs={3.5}>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                            sx={{
                              fontSize: "0.7rem", // 文字サイズを変更
                              fontWeight: "bold", // 太字にする（必要なら）
                            }}
                          >
                            {todo.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography
                            gutterBottom
                            textAlign={"left"}
                            color="text.secondary"
                            sx={{
                              wordBreak: "break-all",
                              fontSize: "0.8rem", // 文字サイズを変更
                            }}
                          >
                            {todo.title}
                          </Typography>
                        </Grid>
                        {/* <Grid item xs={4}>
                          <Typography variant="body2" gutterBottom>
                          {todo.memo}
                          </Typography>
                        </Grid> */}
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
        {/* タスク*/}
        {/* stackで囲むことで要素が均等に配置される。 */}
        <Stack sx={{ height: "100%" }} spacing={2}>
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
            <Button startIcon={<AddCircleIcon />} sx={{ color: theme.palette.todoColor.main }} onClick={onAddTodoForm}>
              タスクを追加
            </Button>
          </Box>
          {/* タスク一覧 */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
               {/* これで1取引単位 */}
              {tasks.map((todo, index)=>(
                <ListItem disablePadding key={index}>
                {/* 複数の取引カードを制御できる。 */}
                <Card
                  sx={{
                    width: "100%",
                    backgroundColor: todo.category==="会社"?(theme)=> theme.palette.workColor.light : todo.category==="プライベート"?(theme)=> theme.palette.privateColor.light : (theme)=> theme.palette.studyColor.light
                  }}
                  //取引カードを選択した時
                  onClick={()=> onSelectTodo(todo)}
                >
                  <CardActionArea>
                    <CardContent>
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        wrap="wrap"
                      >
                        {/* チェックボックスを追加 */}
                        <Grid item xs={1.1}>
                          <Checkbox
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            checked={todo.status==="完了" ? true : false}
                            onClick={()=>onCheckChange(todo)}
                          />
                        </Grid>
                        <Grid item xs={3.5}>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                            sx={{
                              fontSize: "0.7rem", // 文字サイズを変更
                              fontWeight: "bold", // 太字にする（必要なら）
                            }}
                          >
                            {todo.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography
                            gutterBottom
                            textAlign={"left"}
                            color="text.secondary"
                            sx={{
                              wordBreak: "break-all",
                              fontSize: "0.8rem", // 文字サイズを変更
                            }}
                          >
                            {todo.title}
                          </Typography>
                        </Grid>
                        {/* <Grid item xs={4}>
                          <Typography variant="body2" gutterBottom>
                          {todo.memo}
                          </Typography>
                        </Grid> */}
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
  