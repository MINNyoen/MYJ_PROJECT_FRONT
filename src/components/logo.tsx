import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

type Variant = 'light' | 'primary';

interface LogoProps {
  variant?: Variant;
}

export const Logo = styled((props: LogoProps) => {
  const { variant, ...other } = props;

  return (
    <Typography
    color={'primary'}
    variant="h2"
    >
      MinYeonJin
    </Typography>
  );
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf<Variant>(['light', 'primary'])
};
