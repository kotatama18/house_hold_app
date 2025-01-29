import {z} from "zod"

export const transacitonSchema = z.object({
    //enumは引数の配列のいずれかが入らないとエラーが起こる
    type: z.enum(["income", "expense"]),
    date: z.string().min(1, { message: "日付は必須です"}),
    amount: z.number().min(1, { message: "金額は1円以上が必須です"}),
    content: z
    .string()
    .min(1, { message: "内容を入力してください"})
    .max(50, { message: "内容は50字以内にしてください"}),
    category: z
    .union([
        z.enum(["食費", "日用品", "住居費", "交際費", "娯楽", "交通費"]), 
        z.enum(["給与", "副収入", "お小遣い"]),
        //literalの空文字と上記のenumの相性が悪かったため、strignで代用。stringであればなんでもokになっている。
        z.string(),
    ])
    //valには選択肢のいずれかが入る。選択肢のどれでもない場合にメッセージが出力される
    .refine((val) => val !== "", {
        message: "カテゴリを選択してください",
    }),
})

//以上のバリデーションを以下の記述でtypescriptの型に当てはめることができる
export type Schema = z.infer<typeof transacitonSchema>