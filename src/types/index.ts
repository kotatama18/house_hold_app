//型定義専門のファイル
//Transaction
export type TransactionType = "income" | "expense";
export type IncomeCategory = "給与" | "副収入" | "お小遣い";
export type ExpenseCategory = "食費" | "日用品" | "住居費" | "交際費" | "娯楽" | "交通費";
//Todo
export type TodoType = "予定" | "タスク";
export type TodoCategory = "会社" | "勉強" | "プライベート";
export type TodoStatus = "未完了" | "完了";

// Transactionsテーブルのdbの値をカラム毎に定義
export interface Transaction {
    id: string,
    date: string,
    amount: number,
    content: string,
    type: TransactionType,
    category: IncomeCategory | ExpenseCategory;
}

// Transactionsテーブルのdbの値をカラム毎に定義
export interface Todo {
    id: string,
    title: string,
    type: TodoType,
    category: TodoCategory,
    status: TodoStatus,
    date: string,
    memo: string,
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