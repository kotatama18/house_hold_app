import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Report from './pages/Report.tsx';
import NoMatch from './pages/NoMatch.tsx';
import AppLayout from './components/layout/AppLayout.tsx';
import {theme} from "./theme/theme.ts";
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Transaction } from './types/index.ts';
import { collection, getDocs } from "firebase/firestore";
import {db} from "./firebase.ts"
import { formatMonth } from './utils/formatting.ts';



function App() {
  //fireStoreのエラーか判断する関数 -> firebaseではエラーが起こるとcodeとmessageが返る
  // typeof err === "object"でエラーがオブジェクト型なのがわかる
  function isFireStoreError(err: unknown):err is {code: string, message;string}{
    return typeof err === "object" && err !== null && "code" in err
  }
  // firestoreの内容を取得したい処理
  const[transactions, setTransactions] = useState<Transaction[]>([]);
  //今月の日付をstateとして持つ
  const[currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(()=>{

    //　firebaseのTransactionsテーブルにある値を全て取得するメソッド
    const fetchTransactions = async() => {
      try{
        const querySnapshot = await getDocs(collection(db, "Transactions"))
        const transactionsData = querySnapshot.docs.map((doc) => {
          // doc.dataが実際のデータ(オブジェクト型)
          return{
            ...doc.data(),
            id: doc.id,
          } as Transaction
        });
        setTransactions(transactionsData)
      }catch(err){
        if(isFireStoreError(err)){
          console.error("firebaseのエラーは:",err)
          console.error("firebaseのエラーメッセージは:",err.message)
          console.error("firebaseのエラーコードは:",err.code)
        }else{
          console.error("一般的なエラーは:", err)
        }
      }
    }
    fetchTransactions();
  }, [])
  //Transactionsテーブルの今月のデータだけを抽出する
  const monthlyTransactions = transactions.filter((transacrion) =>{
    return transacrion.date.startsWith(formatMonth(currentMonth))
  })
  return (
    // アプリ全体にテーマを反映させる
    <ThemeProvider theme={theme}>
    {/* ブラウザのデフォルトCSSをリセットしてMUIのテーマを反映させる */}
    <CssBaseline />
    <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}> 
            <Route index element={<Home monthlyTransactions={monthlyTransactions}/>}/>
            <Route path="/report" element={<Report />}/>
            <Route path="*" element={<NoMatch />}/>
          </Route>
        </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
