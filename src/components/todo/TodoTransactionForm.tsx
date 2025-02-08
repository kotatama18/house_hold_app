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
  import FastfoodIcon from "@mui/icons-material/Fastfood";
  import AlarmIcon from "@mui/icons-material/Alarm";
  import AddHomeIcon from "@mui/icons-material/AddHome";
  import Diversity3Icon from "@mui/icons-material/Diversity3";
  import SportsTennisIcon from "@mui/icons-material/SportsTennis";
  import TrainIcon from "@mui/icons-material/Train";
  import WorkIcon from "@mui/icons-material/Work";
  import AddBusinessIcon from "@mui/icons-material/AddBusiness";
  import SavingsIcon from "@mui/icons-material/Savings";
  import {zodResolver} from "@hookform/resolvers/zod";
  import { Schema, transacitonSchema } from "../../validations/schema.ts";
  
  
  interface TransactionFormProps {
    onCloseForm: () => void;
    isEntryDrawerOpen: boolean;
    currentDay: string;
    onSaveTransaction: (transaction: Schema)=>Promise<void>
    selectedTransaction: Transaction | null 
    onDeleteTransaction: (transacrionId: string) => Promise<void>
    setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
    onUpdateTransaction:  (transaction: Schema, transacrionId: string) => Promise<void>
  }
  
  interface CategoryItem{
    label: IncomeCategory| ExpenseCategory;
    icon: JSX.Element
  }
  
  type IncomeExpense = "income" | "expense"
  const TransactionForm = ({onCloseForm, isEntryDrawerOpen, currentDay, onSaveTransaction, selectedTransaction, onDeleteTransaction, setSelectedTransaction, onUpdateTransaction}: TransactionFormProps) => {
    const formWidth = 320;
  
    const expenseCategories: CategoryItem[] =[
      {label: "食費", icon:<FastfoodIcon fontSize="small"/>},
      {label: "日用品", icon:<AlarmIcon fontSize="small"/>},
      {label: "住居費", icon:<AddHomeIcon fontSize="small"/>},
      {label: "交際費", icon:<Diversity3Icon fontSize="small"/>},
      {label: "娯楽", icon:<SportsTennisIcon fontSize="small"/>},
      {label: "交通費", icon:<TrainIcon fontSize="small"/>},
    ]
  
    const incomeCategories: CategoryItem[] =[
      {label: "給与", icon:<WorkIcon fontSize="small"/>},
      {label: "副収入", icon:<SavingsIcon fontSize="small"/>},
      {label: "お小遣い", icon:<AddBusinessIcon fontSize="small"/>},
    ]
  
    const[categories, setCategories] = useState(expenseCategories)
  
    //muiとreact-hook-formの統合をするのに必要、フォームの初期値を設定する。
    //react-hook-formが提供してくれテイル機能
    // setValue: valueを設定できる(valueがフォームに入れる値)
    // watch: valueの状態を監視できる
    // resolverがフォームのエラーを感知する。formState{error}でエラーオブジェクトを受け取る
    // reset: フォームの内容を空にする
    const {control, setValue, watch, formState:{errors}, handleSubmit, reset}= useForm<Schema>({
      defaultValues:{
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "",
        content: ""
      },
      resolver : zodResolver(transacitonSchema)
    })
  
    //formのvalueにincomeかexpenseか設定する
    const incomeExpenseToggle = (type: IncomeExpense)   =>{
      //フィールドのvalunに値を設定する
      //フィールド名typeに引数で渡されたtyp(income, expense)を設定する
      setValue("type", type)
      setValue("category", "")
    }
  
    //収支タイプの監視
    const currentType = watch("type")
    //選択する収支タイプが変わると、カテゴリの収支判別をする
    useEffect(()=>{
      const newCategories = 
        currentType === "expense"? expenseCategories : incomeCategories;
        setCategories(newCategories)
    }, [currentType])
  
    //選択した日付がフォームの日付に設定される
    //useEffectは第二引数の配列に入れた変数が変化する度に実行する。[]の場合は初回レンダリング時のみ
    // setValueでformの日付を選択された日付に変更する
    useEffect(()=>{
      setValue("date",currentDay)
    }, [currentDay])
  
    //送信処理
    const onSubmit:SubmitHandler<Schema> = (data) =>{
      if(selectedTransaction){
        onUpdateTransaction(data, selectedTransaction.id)
          .then(()=>{
            setSelectedTransaction(null)
          })
          .catch((error) =>{
  
          })
      }else{
        onSaveTransaction(data)
          .then(()=>{
          })
          .catch((error) =>{
  
          })
      }
      //フォームをリセットする。引数で設定した値はその値でリセットされる。
      reset({
        type: "expense",
        date: data.date,
        amount: 0,
        category: "",
        content: ""
      })
    }
  
    useEffect(()=>{
      //選択肢が更新されたか確認
      if(selectedTransaction){
        //.someはこの条件式が正しければtrueを返す。
        //現在のカテゴリステートが持つカテゴリ群の中に選択した取引のカテゴリと同一のものがある場合trueを返す
        const categoryExists = categories.some((category) => category.label === selectedTransaction.category)
        setValue("category", categoryExists ? selectedTransaction.category : "")
      }
    },[selectedTransaction, categories])
  
    //フォーム内容を更新する
    //取引カードをクリックした時にその内容をフォームに表示させる
    useEffect(()=>{
      if(selectedTransaction){
        setValue("type", selectedTransaction.type)
        setValue("date", selectedTransaction.date)
        setValue("amount", selectedTransaction.amount)
        setValue("content", selectedTransaction.content)
      }else{
        reset({
          type: "expense",
          date: currentDay,
          amount: 0,
          category: "",
          content: ""
        })
      }
    },[selectedTransaction])
  
    //Transactionテーブルにある選択した取引を削除する処理
    const handleDelete= ()=>{
      if(selectedTransaction){
        onDeleteTransaction(selectedTransaction?.id);
        setSelectedTransaction(null)
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
            {/* 収支切り替えボタン */}
            {/* muiとreact-hook-formの統合をするのにControllerを使う */}
            {/* name: react-hook-formで管理するformの名前 */}
            <Controller 
              name="type"
              control={control}
              //描画の対象を囲む。
              //field: formの中身を管理するものが入っている
              render ={({field})=>(
                <ButtonGroup fullWidth>
                  <Button 
                    //caontained:ボタンを塗りつぶす, outlined: ボタンに輪郭線がつく
                    variant={
                      field.value === "expense" ? "contained": "outlined"
                    } 
                    color="error" 
                    onClick={() =>incomeExpenseToggle("expense")}
                  >
                  支出
                  </Button>
                  <Button 
                  onClick={()=>incomeExpenseToggle("income")}
                  color="primary"
                  variant={field.value === "income" ? "contained": "outlined"}
                    >収入</Button>
                </ButtonGroup>
              )}
            />
            
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
            
            {/* 金額 */}
            <Controller
              name="amount"
              control={control}
              render={({field})=>(
                <TextField 
                {...field} 
                value={field.value === 0 ? "" : field.value}
                onChange={(e) =>{
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額" 
                type="number" 
                error={!!errors.amount}
                helperText={errors.amount?.message}
                />
              )}
              />
            {/* 内容 */}
            <Controller
              name="content"
              control={control}
              render={({field})=>(
                <TextField 
                  {...field} 
                  label="内容" 
                  type="text" 
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              )}
              />
            {/* 保存ボタン */}
            <Button 
              type="submit" 
              variant="contained" 
              color={currentType === "income" ? "primary": "error"} 
              fullWidth
            >
              {selectedTransaction ? "更新" : "保存"}
            </Button>
            {/* 削除ボタン */}
            {/* selectedTransactionが存在する(true)の時のみ以下が出現する*/}
            {selectedTransaction && (
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
  