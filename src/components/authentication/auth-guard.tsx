import path from 'components/path.json';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { changeCheck } from 'slices/common';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';
import { useDispatch, useSelector } from 'store';
import { useAuth } from '../../hooks/use-auth';

interface AuthGuardProps {
  children: ReactNode;
}
let stompClient : Client;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]
  );

  useEffect(()=>{
    if(auth.isAuthenticated){
      connect();
    }
    else {
      stompClient && stompClient.disconnect(()=>{},{});
    }
  },[])

  //WebSocket
  const connect =()=>{
    let Sock = new SockJS('http://localhost:5080/ws');
    stompClient = over(Sock);
    stompClient.connect({},onConnected, onError);
    }

  const onConnected = () => {
    //알림
    console.log(auth.user?.loginId);
    stompClient.send('app/login', {}, JSON.stringify(auth.user?.loginId));
    }

    const onError = (err: any) => {
    console.log(err);
    }
  
  if (!authCheck) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
