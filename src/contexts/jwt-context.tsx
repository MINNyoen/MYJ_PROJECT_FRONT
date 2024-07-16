import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { authApi } from 'api/auth-api';
import type { Login, User } from 'types/user';
import { Cookies } from "react-cookie";
import Router from 'next/router';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
}

export interface AuthContextValue extends State {
  login: (login: Login) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: User) => Promise<void>;
  modifyUserAvatar: (img: File) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

enum ActionType {
  INITIALIZE = 'INITIALIZE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: ActionType.LOGIN;
  payload: {
    accessToken : string;
    user: User;
  };
};

type LogoutAction = {
  type: ActionType.LOGOUT;
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction

type Handler = (state: State, action: any) => State;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  accessToken: null,
  user: null
};

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user
      };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user, accessToken } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      accessToken: accessToken,
      user
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    accessToken: null,
    user: null
  }),
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  modifyUserAvatar: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const cookie = new Cookies;
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const accessToken = globalThis.localStorage.getItem('accessToken');
      if (accessToken) {
          const {user} = await authApi.me();
          if(user) {
            dispatch({
              type: ActionType.INITIALIZE,
              payload: {
                isAuthenticated: true,
                user: user
              }
            });
          }
          else {
            dispatch({
              type: ActionType.INITIALIZE,
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
            globalThis.localStorage.removeItem('accessToken');
            Router.push("/authentication/login");
          }
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    }
    initialize();
  }, []);

  const login = async (login?: Login): Promise<void> => {
    const {accessToken, user} = await authApi.login(login);
    globalThis.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: ActionType.LOGIN,
      payload: {
        accessToken: accessToken,
        user: user
      }
    });
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: ActionType.LOGOUT });
    globalThis.localStorage.removeItem('accessToken');
  };

  const register = async (user: User): Promise<void> => {
    await authApi.register(user);
  };

  const modifyUserAvatar = async (img: File): Promise<void> => {
    const {user} = await authApi.modifyUserAvatar(img);
    if(user) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: true,
          user: user
        }
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        modifyUserAvatar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
