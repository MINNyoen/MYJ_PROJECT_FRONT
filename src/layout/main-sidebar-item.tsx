import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NextLink from 'next/link';
import type { FC } from 'react';
import { Fragment, useState } from 'react';
import { MenuType } from 'types/menu';

interface MainSidebarItemProps {
  item: MenuType,
  handleSideChange: VoidFunction
}

export const MainSidebarItem: FC<MainSidebarItemProps> = (props) => {
  const { item, handleSideChange } = props;
  const [open, setOpen] = useState(false);

  const handleMenuOpen = () => setOpen(!open);


  return (
      <Fragment > 
        <ListItemButton onClick={handleMenuOpen}>
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.links && item.links.map((itemDetail,index2)=>{
              return(
              <NextLink
                key={index2}
                href={itemDetail.href ? itemDetail.href : "#"}
                passHref>
                <ListItemButton sx={{ pl: 6 }} onClick={handleSideChange}>
                  <ListItemIcon>
                    {itemDetail.icon}
                  </ListItemIcon>
                  <ListItemText primary={itemDetail.title} primaryTypographyProps={{sx:{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}}  />
                </ListItemButton>
              </NextLink>);
            })}
          </List>
        </Collapse>
      </Fragment>
  );
};
