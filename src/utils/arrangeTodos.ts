import { Todo } from "../types"

//日付毎の収支を計算する関数
export function groupbyDailyTodos(todos: Todo[]):Record<string, Todo[]>{
    const dailyTodos:Record<string, Todo[]> ={}
    todos.forEach((todo) =>{
        if(!dailyTodos[todo.date]){
            dailyTodos[todo.date] =[]
        }
        dailyTodos[todo.date].push(todo)
    })
    return dailyTodos
}