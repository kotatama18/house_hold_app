import {z} from "zod"

export const todoSchema = z.object({
    //enumは引数の配列のいずれかが入らないとエラーが起こる
    type: z.enum(["予定", "タスク", ""]),
    date: z.string().optional(),
    status: z.enum(["完了", "未完了", ""]),
    title: z.string().min(1, { message: "タイトルは必須です"}),
    memo: z.string().optional(),
    category: z
    .union([
        z.enum(["会社", "プライベート", "勉強"]), 
        z.string(),
    ])
    //valには選択肢のいずれかが入る。選択肢のどれでもない場合にメッセージが出力される
    .refine((val) => val !== "", {
        message: "カテゴリを選択してください",
    }),
})

//以上のバリデーションを以下の記述でtypescriptの型に当てはめることができる
export type TodoSchema = z.infer<typeof todoSchema>