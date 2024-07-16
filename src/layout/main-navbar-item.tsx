import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Divider, Grid, Link, ListItemText, MenuItem, Tooltip, Typography, Zoom } from '@mui/material';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { MenuType } from 'types/menu';

interface MenuItemDetailProps {
  links?: MenuType[];
}

const MenuItemDetail: FC<MenuItemDetailProps> = (props) => {
  
  const { links, ...other } = props;
  return(
  <>
    <Grid container sx={{p: 2}} direction="row" spacing={2}>
      {links && links.map((item, index)=>{
        return(
          <Grid  key={index} item xs={ links.length < 2 ? 12 : 6}>
            <Typography variant="subtitle1" color={'primary.contrastText'} fontWeight={'bold'} key={'MenuItem - ' + index.toString()} pb={2} whiteSpace={'nowrap'}>
             {item.title}
            </Typography>
            {item.links && item.links.map((item_d: MenuType, index_d: number) => (
              <NextLink
              href={item_d.href ? item_d.href : "#"}
              key={'bMenuItem - ' + index_d.toString()}
              passHref>
                <Link
                  color={'primary.contrastText'}
                  underline="none"
                  variant="subtitle2"
                  >
                  <MenuItem
                    onClick={()=>{!item_d.href && toast('현재 개발 중인 메뉴입니다!', {icon : '🧑🏻‍💻'})}}
                  >
                    <ListItemText
                      primary={(
                        <Box sx={{display: 'inline-flex'}}>
                        {item_d.icon}
                        <Typography variant="subtitle2" fontWeight={'bold'} ml={'5px'}>
                          {item_d.title}
                        </Typography>
                        </Box>
                      )}
                    />
                  </MenuItem>
                </Link>
              </NextLink>
            ))}
            <Divider orientation="vertical" flexItem />
        </Grid>
        );
      })}
    </Grid>
  </>
  );
}
interface MainNavbarItemProps {
  title?: string;
  icon?: ReactNode;
  href?: string;
  links?: MenuType[];
}

export const MainNavbarItem: FC<MainNavbarItemProps> = (props) => {
  return (
    <>
        <Tooltip arrow title={<MenuItemDetail links={props.links}/>} TransitionComponent={Zoom} TransitionProps={{timeout : 300}} leaveDelay={100} 
        PopperProps={{sx: {'&.MuiTooltip-popper' : {inset: '20px auto auto -35px !important'}}}}
        >
          <Link
          color="primary.contrastText"
          underline="none"
          minWidth={"50%"}
          textAlign='center'
          sx={{pt: 1, cursor: 'pointer'}}
          display={'inline-flex'}
          >
            <>
            {props.icon}
            <Typography variant="h6" pt={'1px'}>
            {props.title}
            </Typography>
            <KeyboardArrowDownIcon fontSize={'large'}viewBox='0 0 35 35'/>
            </>
          </Link>  
        </Tooltip>    
    </>
  );
};
