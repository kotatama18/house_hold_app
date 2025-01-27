//型定義専門のファイル

export type TransactionType = "income" | "expense";
export type IncomeCategory = "給与" | "副収入" | "お小遣い";
export type ExpenceCategory = "食費" | "日用品" | "娯楽";

// Transactionsテーブルのdbの値をカラム毎に定義
export interface Transaction {
    id: string,
    date: string,
    amount: number,
    content: string,
    type: TransactionType,
    category: IncomeCategory | ExpenceCategory;
}


export interface Balance {
    income: number,
    expense: number,
    balance: number
}


export interface CalendarContent{
    start: string,
    income: string,
    expense: string,
    balance: string,
}