import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from '@mui/material';
import NextLink from 'next/link';
import { FC, useRef, useState } from 'react';
import { MenuType } from 'types/menu';
import { MainPopover } from './main-popover';

interface MainNavbarPopoverProps {
  title?: string;
  href?: string;
  links?: MenuType[];
}

export const MainNavbarPopover: FC<MainNavbarPopoverProps> = (props) => {
  const mainMenuRef = useRef<HTMLAnchorElement | null>(null); 
  const [bMenu, setBMenu] = useState(false);

  return (
    <>
      <NextLink
         href={props.href ? props.href : "#"}
         passHref>
        <Link
         ref={mainMenuRef}
         color="textSecondary"
         underline="none"
         variant="subtitle2"
         minWidth="50%"
         textAlign='center'
         onMouseEnter={()=>(setBMenu(true))}
         //onMouseLeave={()=>(setBMenu(false))}
         >
          {props.title}
          <KeyboardArrowDownIcon viewBox='0 -3 20 20' />
        </Link>      
    </NextLink>
    <MainPopover anchorEl={mainMenuRef.current} open={bMenu} onClose={()=>setBMenu(false)} links={props.links} />
    </>
  );
};
