
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';



interface LogoProps {
  color?: string;
}

export const Logo = styled((props: LogoProps) => {
  const { color, ...other } = props;

  return (
    <Typography
    color={color ? color : 'black'}
    variant="h2"
    >
      MinYeonJin
    </Typography>
  );
})``;