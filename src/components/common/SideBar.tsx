import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import React, {CSSProperties} from 'react'
import CottageIcon from '@mui/icons-material/Cottage';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import { NavLink } from 'react-router-dom';

interface SideBarProps {
    drawerWidth:number,
    mobileOpen:boolean,
    handleDrawerClose: ()=> void, 
    handleDrawerTransitionEnd: ()=> void,
    setActiveScreen: (string)=>void;
}

//サイドバーに出てくる要素の型定義
interface menuItem {
    text: string,
    path: string,
    icon: React.ComponentType,
}

const SideBar = ({drawerWidth, mobileOpen, handleDrawerClose, handleDrawerTransitionEnd, setActiveScreen}:SideBarProps) => {

    //　サイドバーに出てくる要素を定義する
    const MenuItems: menuItem[] =[
        {text: "Home", path: "/", icon: CottageIcon},
        {text: "TODO", path: "/todo", icon: DomainVerificationIcon}
    ]

    const baseLinkStyle :CSSProperties ={
        textDecoration: "none",
        color: "inherit",
        display: "block"
    }

    //サイドバーの要素をクリックすると、背景色が変化する
    const activeLinkStyle:CSSProperties = {
        backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
    const drawer = (
        <div>
          <Toolbar />
          {/* Dividerは斜線 */}
          <Divider />
          <List>
            {MenuItems.map((item, index) => (
            // NavLink = aタグのようなもの, to = href, isActiveは選択された要素がtrueを持つ
            <NavLink onClick={()=>setActiveScreen(item.text)} key={item.text} to={item.path} style={({isActive}) =>{
                return {
                    ...baseLinkStyle,
                    ...(isActive ? activeLinkStyle: {})
                }
            }}>
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* アイコン画像 */}
                    <item.icon/>
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              </NavLink>
            ))}
          </List>
          <Divider />
        </div>
      );
  return (
    <Box
    component="nav"
    sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    aria-label="mailbox folders"
  >
    {/* モバイル用 */}
    <Drawer
      // トリガーによってdrawerの表示・非表示を切り変えられる
      variant="temporary"
      open={mobileOpen}
      onTransitionEnd={handleDrawerTransitionEnd}
      onClose={handleDrawerClose}
      // ドロワーの開く動作が向上するらしい、、、、
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      // sx = styleのようなもの、xs=0px~ sm=600px~
      // display :block は要素が改行され上から下に積まれる見た目になる
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {drawer}
    </Drawer>
    {/* PC用 */}
    <Drawer
    //常に固定でdrawerが表示される(トリガー等があって変わるのではなく、下の画面サイズで自動で変わる)
      variant="permanent"
      // sx = styleのようなもの、xs=0px~ sm=600px~
      // display :block は要素が改行され上から下に積まれる見た目になる
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open
    >
      {drawer}
    </Drawer>
  </Box>
  )
}

export default SideBar
