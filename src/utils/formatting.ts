import { format } from "date-fns";

// 日付の年-月をstringで返すメソッド
export function formatMonth(date: Date):string{
    return format(date, "yyyy-MM");
}