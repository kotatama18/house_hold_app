import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import SideBar from '../common/SideBar.tsx';

const drawerWidth = 240;


export default function AppLayout() {
  //mobileOpenが状態を表す変数, setMobileOpenは状態変数(mobileOpen)を更新する関数
  //useStateはReactのフックで初期状態を設定するのに使う
  //モバイル用のドロワーが開いているかどうか
  const [mobileOpen, setMobileOpen] = React.useState(false);
  //ドロワーが閉じるアニメーションの管理
  const [isClosing, setIsClosing] = React.useState(false);

  //ドロワーを閉じる関数
  const handleDrawerClose = () => {
    setIsClosing(true); //ドロワーが閉じるアクションを始める
    setMobileOpen(false); //ドロワーを閉じる
  };

  //ドロワーを閉じるアクションが終わるとアニメーションをfalseにする
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);//ドロワーが閉じるアクションが終わったらfalseに戻す
  };

   //ドロワーの開閉を逆転させる
  const handleDrawerToggle = () => {
    if (!isClosing) {  //閉じるアニメーション中(isClsing is true)の時は実行しない 
      setMobileOpen(!mobileOpen); //ドロワーの開閉状態を逆転させる
    }
  };

  


  return (
    // 100vh = 画面全体の高さを示す
    <Box sx={{ display: 'flex', bgcolor: (theme) => theme.palette.grey[100], minHeight: "100vh" }}>
      <CssBaseline />
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            {/* 実際の三本線のアイコン。これをIconButtonで囲う事によってアイコンをボタン要素として扱う */}
            <MenuIcon />
          </IconButton>
          {/* 実際のヘッダーの文字 */}
          <Typography variant="h6" noWrap component="div" fontWeight="fontWeightBold">
            家計簿だよん
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* サイドバー */}
      <SideBar 
        drawerWidth={drawerWidth}
        mobileOpen ={mobileOpen}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        handleDrawerClose={handleDrawerClose}
      />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* Toolbarは余白を出すためのもの */}
        <Toolbar />
        {/* ここでhome,report等のコンポーネントを呼び出す */}
        <Outlet />
      </Box>
    </Box>
  );
}
