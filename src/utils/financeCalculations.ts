import { da } from "date-fns/locale";
import { Balance, Transaction } from "../types";

//引数で与えられたデータの収支を計算するメソッド
export function financeCalculations(transactions: Transaction[]):Balance{
    //.reduceの戻り値を{income :0, expense:0, balance:0}とし、accがそれを指す。
    return  transactions.reduce((acc, transaction) =>{
        if(transaction.type == "income"){
            acc.income += Number(transaction.amount)
        }else{
            acc.expense += Number(transaction.amount)
        }
         acc.balance = Number(acc.income) - Number(acc.expense);
         return acc
         
    },{income:0, expense:0, balance:0})
}

//日付毎の収支を計算する関数
export function caluculateDailyBalances(transactions: Transaction[]):Record<string, Balance>{
    return transactions.reduce<Record<string, Balance>>((acc, transaction) =>{
        const day = transaction.date
        if(!acc[day]){
            acc[day] = {income:0, expense:0, balance:0}
        }

        if(transaction.type === "income"){
            acc[day].income += Number(transaction.amount)
        }else{
            acc[day].expense += Number(transaction.amount)
        }

        acc[day].balance = Number(acc[day].income) - Number(acc[day].expense)
        return acc
    },{})
}