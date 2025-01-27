import { format } from "date-fns";

// 日付の年-月をstringで返すメソッド
export function formatMonth(date: Date):string{
    return format(date, "yyyy-MM");
}


//受け取った金額を日本円に変換する関数
export function formatCurrency(amount: number){
    return amount.toLocaleString("ja-JP")
}