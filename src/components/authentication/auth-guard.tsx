import path from 'components/path.json';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { changeCheck } from 'slices/common';
import { useDispatch, useSelector } from 'store';
import { useAuth } from 'hooks/use-auth';

interface AuthGuardProps {
  children: ReactNode;
}
export const AuthGuard: FC<AuthGuardProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const { authCheck } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      if (!auth.isAuthenticated) {
        router.push({
          pathname: path.pages.authentication.login,
          query: { returnUrl: router.asPath }
        }).catch(console.error);
      } else {
        dispatch(changeCheck(true));
      }
    },

    [router.isReady]
  );
  
  if (!authCheck) {
    return null;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
