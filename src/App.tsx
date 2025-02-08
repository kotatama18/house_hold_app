import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import TODO from './pages/Todo.tsx';
import NoMatch from './pages/NoMatch.tsx';
import AppLayout from './components/layout/AppLayout.tsx';
import { theme } from "./theme/theme.ts";
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Todo, Transaction } from './types/index.ts';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import { formatMonth } from './utils/formatting.ts';
import { Schema } from './validations/schema.ts';
import TodoPage from './pages/Todo.tsx';
import { IsTodayOptions } from 'date-fns';



function App() {
  //fireStoreのエラーか判断する関数 -> firebaseではエラーが起こるとcodeとmessageが返る
  // typeof err === "object"でエラーがオブジェクト型なのがわかる
  function isFireStoreError(err: unknown): err is { code: string, message; string } {
    return typeof err === "object" && err !== null && "code" in err
  }
  // firestore(transactionの内容をもつステート
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // firestore(todoの内容をもつステート
  const [todos, setTodos] = useState<Todo[]>([]);
  //今月の日付をstateとして持つ
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // firestore(Transaciton)の内容を取得したい処理
  useEffect(() => {
    //　firebaseのTransactionsテーブルにある値を全て取得するメソッド
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"))
        const transactionsData = querySnapshot.docs.map((doc) => {
          // doc.dataが実際のデータ(オブジェクト型)
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction
        });
        setTransactions(transactionsData)
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firebaseのエラーは:", err)
          console.error("firebaseのエラーメッセージは:", err.message)
          console.error("firebaseのエラーコードは:", err.code)
        } else {
          console.error("一般的なエラーは:", err)
        }
      }
    }
    fetchTransactions();
  }, [])
  //Transactionsテーブルの今月のデータだけを抽出する
  const monthlyTransactions = transactions.filter((transacrion) => {
    return transacrion.date.startsWith(formatMonth(currentMonth))
  })

  // firestore(Todo)の内容を取得したい処理
  useEffect(() => {
    //　firebaseのTransactionsテーブルにある値を全て取得するメソッド
    const fetchTodo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Todo"))
        const todosData = querySnapshot.docs.map((doc) => {
          // doc.dataが実際のデータ(オブジェクト型)
          return {
            ...doc.data(),
            id: doc.id,
          } as Todo
        });
        setTodos(todosData)
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firebaseのエラーは:", err)
          console.error("firebaseのエラーメッセージは:", err.message)
          console.error("firebaseのエラーコードは:", err.code)
        } else {
          console.error("一般的なエラーは:", err)
        }
      }
    }
    fetchTodo();
  }, [])
  //Todoテーブルの今月のデータだけを抽出する
  const monthlyTodos = todos.filter((todo) => {
    return todo.date.startsWith(formatMonth(currentMonth))
  })


  //取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      //firestoreにデータを保存する
      // Transactionsテーブルに引数で受け取ったtransactinoを保存する
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      console.log("Document written with ID: ", docRef.id);

      //実際に送るオブジェクトを格納
      const newTransaction = {
        //firestoreのレコード毎のid
        id: docRef.id,
        ...transaction
      } as Transaction
      //直前までのトランザクションに今回のトランザクションを追加する。
      setTransactions((prevTransaction) => [...prevTransaction, newTransaction])
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firebaseのエラーは:", err)
        console.error("firebaseのエラーメッセージは:", err.message)
        console.error("firebaseのエラーコードは:", err.code)
      } else {
        console.error("一般的なエラーは:", err)
      }
    }
  }

  //firestoreのデータ削除
  const handleDeleteTransaction = async (transactionId: string) => {
    try{
      await deleteDoc(doc(db, "Transactions", transactionId));
      //削除対象の取引と合致するステートをもつ
      const filterdTransactions = transactions.filter((transaction) => transaction.id !== transactionId)
      setTransactions(filterdTransactions);
    }catch (err) {
      if (isFireStoreError(err)) {
        console.error("firebaseのエラーは:", err)
        console.error("firebaseのエラーメッセージは:", err.message)
        console.error("firebaseのエラーコードは:", err.code)
      } else {
        console.error("一般的なエラーは:", err)
      }
    }
  }

  //firestoreの更新処理
  const handleUpdateTransaction = async (transaction: Schema, transacrionId:string) => {
    try{
      const docRef = doc(db, "Transactions", transacrionId);
      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef, transaction);
      //取引更新
      //このスプレッド構文の記述をすることでtとtransacitonの中のオブジェクトが合体する。後者がプロパティの値を書き換える
      const updatedTransactions = transactions.map((t)=> t.id === transacrionId ? {...t, ...transaction}: t) as Transaction[]
      setTransactions(updatedTransactions);
    }catch (err) {
      if (isFireStoreError(err)) {
        console.error("firebaseのエラーは:", err)
        console.error("firebaseのエラーメッセージは:", err.message)
        console.error("firebaseのエラーコードは:", err.code)
      } else {
        console.error("一般的なエラーは:", err)
      }
    }
  }

  return (
    // アプリ全体にテーマを反映させる
    <ThemeProvider theme={theme}>
      {/* ブラウザのデフォルトCSSをリセットしてMUIのテーマを反映させる */}
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route 
              index 
                element={
                  <Home 
                   monthlyTransactions={monthlyTransactions} 
                   setCurrentMonth={setCurrentMonth} 
                   onSaveTransaction={handleSaveTransaction} 
                   onDeleteTransaction={handleDeleteTransaction}
                   onUpdateTransaction={handleUpdateTransaction}
                   />}
             />
            <Route 
              path="/todo" 
              element={
                <TodoPage 
                   monthlyTransactions={monthlyTransactions} 
                   setCurrentMonth={setCurrentMonth} 
                   onSaveTransaction={handleSaveTransaction} 
                   onDeleteTransaction={handleDeleteTransaction}
                   onUpdateTransaction={handleUpdateTransaction}
                   monthlyTodos={monthlyTodos}
                />} 
                />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
