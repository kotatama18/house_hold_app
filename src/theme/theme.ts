import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material";
import { blue, green, purple, red } from "@mui/material/colors";


declare module "@mui/material/styles"{
    interface Palette{
        incomeColor: PaletteColor,
        expenseColor: PaletteColor,
        balanceColor: PaletteColor,
        todoColor: PaletteColor,
    }

    // 初期設定　プロパティの設定が必須ではない。
    interface PaletteOptions{
        incomeColor?: PaletteColorOptions,
        expenseColor?: PaletteColorOptions,
        balanceColor?: PaletteColorOptions,
        todoColor?: PaletteColorOptions,

    }
}

export const theme = createTheme({
    typography: {
        fontFamily: 'Noto Sans JP, Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },

    palette:{
        //収入用の色
        incomeColor:{
            main: blue[500],
            light:blue[100],
            dark:blue[700],
        },
        //支出用の色
        expenseColor:{
            main: red[500],
            light: red[100],
            dark: red[700],
        },
        //残高用の色
        balanceColor:{
            main: green[500],
            light:green[100],
            dark:green[700],
        },
        todoColor:{
            main: purple[300],
            light:purple[100],
            dark:purple[500],
        }
    }
})