import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    ListItemIcon,
    MenuItem,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { JSX, useEffect, useState } from "react";
  import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
  import {Controller, SubmitHandler, useForm} from "react-hook-form"
  import { ExpenseCategory, IncomeCategory, Todo, Transaction } from "../../types/index.ts";
  import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
  import ImportContactsIcon from '@mui/icons-material/ImportContacts';
  import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
  import {zodResolver} from "@hookform/resolvers/zod";
  import { TodoSchema, todoSchema } from "../../validations/todoSchema.ts";
  import { Schema, transacitonSchema } from "../../validations/schema.ts";
  import { theme } from "../../theme/theme.ts";
  
  
  interface TransactionFormProps {
    onCloseForm: () => void;
    isEntryDrawerOpen: boolean;
    currentDay: string;
    onSaveTodo: (transaction: TodoSchema)=>Promise<void>
    onUpdateTodo:  (transaction: TodoSchema, transacrionId: string) => Promise<void>
    onDeleteTodo: (transacrionId: string) => Promise<void>
    selectedTodo: Todo | null 
    setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  }
  
  interface CategoryItem{
    label: "会社"| "プライベート" | "勉強";
    icon: JSX.Element
  }

  interface TypeItem{
    label: "予定"| "タスク";
    icon: JSX.Element
  }

  const TransactionForm = ({onCloseForm, isEntryDrawerOpen, currentDay, onSaveTodo, onUpdateTodo, onDeleteTodo, selectedTodo, setSelectedTodo}: TransactionFormProps) => {
    const formWidth = 320;
  
    const Categories: CategoryItem[] =[
      {label: "会社", icon:<WorkHistoryIcon fontSize="small"/>},
      {label: "プライベート", icon:<EmojiPeopleIcon fontSize="small"/>},
      {label: "勉強", icon:<ImportContactsIcon fontSize="small"/>},
    ]

    const Types: TypeItem[] =[
      {label: "予定", icon:<WorkHistoryIcon fontSize="small"/>},
      {label: "タスク", icon:<EmojiPeopleIcon fontSize="small"/>},
    ]
  
    const[categories, setCategories] = useState(Categories)
    const[types, setTypes] = useState(Types)
  
    //muiとreact-hook-formの統合をするのに必要、フォームの初期値を設定する。
    //react-hook-formが提供してくれテイル機能
    // setValue: valueを設定できる(valueがフォームに入れる値)
    // watch: valueの状態を監視できる
    // resolverがフォームのエラーを感知する。formState{error}でエラーオブジェクトを受け取る
    // reset: フォームの内容を空にする
    const {control, setValue, watch, formState:{errors}, handleSubmit, reset}= useForm<TodoSchema>({
      defaultValues:{
        date: currentDay,
        title: "",
        type: "タスク",
        category: "",
        status: "未完了",
        memo: "",
      },
      resolver : zodResolver(todoSchema)
    })

    //formのvalueにincomeかexpenseか設定する
  const typeToggle = (type: "予定" | "タスク")   =>{
    //フィールドのvalunに値を設定する
    //フィールド名typeに引数で渡されたtyp(income, expense)を設定する
    setValue("type", type)
  }
  
    //選択した日付がフォームの日付に設定される
    //useEffectは第二引数の配列に入れた変数が変化する度に実行する。[]の場合は初回レンダリング時のみ
    // setValueでformの日付を選択された日付に変更する
    useEffect(()=>{
      setValue("date",currentDay)
    }, [currentDay])
  
    //送信処理
    const onSubmit:SubmitHandler<TodoSchema> = (data) =>{
      if(selectedTodo){
        onUpdateTodo(data, selectedTodo.id)
          .then(()=>{
            setSelectedTodo(null)
          })
          .catch((error) =>{
  
          })
      }else{
        onSaveTodo(data)
          .then(()=>{
          })
          .catch((error) =>{
  
          })
      }
      //フォームをリセットする。引数で設定した値はその値でリセットされる。
      reset({
        date: data.date,
        title: "",
        type: "",
        category: "",
        status: "未完了",
        memo: ""
      })
    }
  
  
    //フォーム内容を更新する
    //取引カードをクリックした時にその内容をフォームに表示させる
    useEffect(()=>{
      if(selectedTodo){
        setValue("date", selectedTodo.date)
        setValue("type", selectedTodo.type)
        setValue("category", selectedTodo.category)
        setValue("title", selectedTodo.title)
        setValue("memo", selectedTodo.memo)
      }else{
        reset({
          type: "タスク",
          date: currentDay,
          title: "",
          category: "",
          status: "未完了",
          memo: ""
        })
      }
    },[selectedTodo])
  
    //Todoテーブルにある選択した取引を削除する処理
    const handleDelete= ()=>{
      if(selectedTodo){
        onDeleteTodo(selectedTodo?.id);
        setSelectedTodo(null)
      }
    }
  
    return (
      <Box
        sx={{
          position: "fixed",
          top: 64,
          right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
          width: formWidth,
          height: "100%",
          bgcolor: "background.paper",
          zIndex: (theme) => theme.zIndex.drawer - 1,
          transition: (theme) =>
            theme.transitions.create("right", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          p: 2, // 内部の余白
          boxSizing: "border-box", // ボーダーとパディングをwidthに含める
          boxShadow: "0px 0px 15px -5px #777777",
        }}
      >
        {/* 入力エリアヘッダー */}
        <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Typography variant="h6">入力</Typography>
          {/* 閉じるボタン */}
          <IconButton
            onClick={onCloseForm}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* フォーム要素 */}
        {/*onSubmitはreactの関数で、フォームを送信した時に起動する。handleSubmitはreact-hook-formの関数  */}
        {/* handleSubmit: バリデーションに通った時のみonSubmit関数を使えるようになる */}
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* 日付 */}
            <Controller 
              name="date"
              control={control}
              //恐らくmuiの機能で、手に入れた情報(field)をhtmlにrenderで渡してる(TextFieldが実際のHTML)
              render={({field}) =>(
                  //実際のフォームフィールド
                  <TextField
                    {...field}
                    label="日付"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // !!: その値が入っているとtrueになる
                    error={!!errors.date}
                    // ? : errors.dateがあるとmessageを出力する
                    helperText={errors.date?.message}
                  />
              )}
            />
            {/* タイプ */}
            <Controller 
            name="type"
            control={control}
            render ={({field})=>(
              <ButtonGroup fullWidth>
                <Button 
                onClick={()=>typeToggle("予定")}
                variant={field.value === "予定" ? "contained" : "outlined"}
                sx={{
                  bgcolor: field.value === "予定" ? theme.palette.todoColor.light : "white",
                  color: field.value === "予定" ? "white" : theme.palette.todoColor.light,
                  borderColor: theme.palette.todoColor.light, // 枠線の色を指定
                  borderWidth: "2px", // 枠線の太さ（好みに応じて調整）
                }}
                  >予定
                </Button>
                <Button 
                  //caontained:ボタンを塗りつぶす, outlined: ボタンに輪郭線がつく
                  variant={field.value === "タスク" ? "contained" : "outlined"}
                  sx={{
                    bgcolor: field.value === "タスク" ? theme.palette.todoColor.light : "white",
                    color: field.value === "タスク" ? "white" : theme.palette.todoColor.light,
                    borderColor: theme.palette.todoColor.light, // 枠線の色を指定
                    borderWidth: "2px", // 枠線の太さ（好みに応じて調整）
                  }}
                  onClick={() =>typeToggle("タスク")}
                >
                タスク
                </Button>
              </ButtonGroup>
            )}
          />
            {/* カテゴリ */}
            <Controller
              name="category"
              control={control}
              render={({field})=>(
                <TextField 
                  {...field} 
                  id="カテゴリ" 
                  label="カテゴリ" 
                  select
                  error={!!errors.category}
                    helperText={errors.category?.message}
                >
                  {categories.map((category)=>(
                    <MenuItem value={category.label} key={category.label}>
                    <ListItemIcon>
                      {category.icon}
                    </ListItemIcon>
                    {category.label}
                  </MenuItem>
                  ))}
            </TextField>
              )}
            />
            
            {/* タスクタイトル */}
            <Controller
              name="title"
              control={control}
              render={({field})=>(
                <TextField 
                {...field} 
                value={field.value === "" ? "" : field.value}
                label="タイトル" 
                type="text" 
                error={!!errors.title}
                helperText={errors.title?.message}
                />
              )}
              />
            {/* メモ */}
            <Controller
              name="memo"
              control={control}
              render={({field})=>(
                <TextField 
                  {...field} 
                  label="メモ" 
                  type="text" 
                  error={!!errors.memo}
                  helperText={errors.memo?.message}
                />
              )}
              />
            {/* 保存ボタン */}
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ backgroundColor: theme.palette.todoColor.main }}
              fullWidth
            >
              {selectedTodo ? "更新" : "保存"}
            </Button>
            {/* 削除ボタン */}
            {/* selectedTransactionが存在する(true)の時のみ以下が出現する*/}
            {selectedTodo && (
              <Button 
                onClick={handleDelete}
                variant="outlined" 
                color={"secondary"} 
                fullWidth
               >
                削除
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    );
  };
  export default TransactionForm;
  