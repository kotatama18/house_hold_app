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