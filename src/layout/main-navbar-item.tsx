import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Divider, Grid, Link, ListItemText, MenuItem, Tooltip, Typography, Zoom } from '@mui/material';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
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
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight={'bold'} key={'MenuItem - ' + index.toString()} pb={2} whiteSpace={'nowrap'}>
             {item.title}
            </Typography>
            {item.links && item.links.map((item_d: MenuType, index_d: number) => (
              <NextLink
              href={item_d.href ? item_d.href : "#"}
              key={'bMenuItem - ' + index_d.toString()}
              passHref>
                <Link
                  color="textSecondary"
                  underline="none"
                  variant="subtitle2"
                  >
                  <MenuItem
                  >
                    <ListItemText
                      primary={(
                        <Box sx={{display: 'inline-flex'}}>
                        {item_d.icon}
                        <Typography variant="subtitle2" ml={'5px'}>
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
      <NextLink
         href={props.href ? props.href : "#"}
         passHref>
        <Tooltip arrow title={<MenuItemDetail links={props.links}/>} TransitionComponent={Zoom} TransitionProps={{timeout : 300}} color={'white'} leaveDelay={100000}>
          <Link
          color="textSecondary"
          underline="none"
          variant="subtitle2"
          minWidth="40%"
          textAlign='center'
          display={'inline-flex'}
          >
            <>
            {props.icon}
            <Typography variant="subtitle2" pt={'1px'}>
            {props.title}
            </Typography>
            <KeyboardArrowDownIcon viewBox='0 -5 35 35'/>
            </>
          </Link>  
        </Tooltip>    
    </NextLink>
    {/* <MainItem anchorEl={mainMenuRef.current} open={bMenu} onClose={()=>setBMenu(false)} links={props.links} /> */}
    </>
  );
};
