import moment from 'moment';
import Router from 'next/router';
import toast from 'react-hot-toast';
import type { Login, User } from 'types/user';
import { transFormData } from 'utils/transFromData';
import { wait } from 'utils/wait';
import { commonApi } from 'api/common-api';
import path from 'components/path.json';




class AuthApi {
  
  async login(login?: Login): Promise<{accessToken : string, user: User}> {
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("post", "/login", login ?{
            loginId : login.loginId,
            pwd : login.pwd,
            remember : login.remember
        } : undefined).then((response: any)=> {
          if(response.result) {
            const user : User = {
              userSid: response.user.userSid,
              userNm: response.user.userNm,
              birthDt: response.user.birthDt,
              loginId: response.user.loginId,
              pwd: response.pwd,
              avatar: process.env.NEXT_PUBLIC_BACKEND_URL + response.user.avatar
            }
            resolve({accessToken : response.accessToken, user : user});
          }
          else {
            toast.error(response.errorMsg, {style: {textAlign: 'center', maxWidth: '100%'}});
          }
        })
        
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async register(user: User): Promise<string> {
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("post", "/user/register",undefined,transFormData({
          loginId : user.loginId,
          pwd : user.pwd,
          userNm : user.userNm,
          birthDt : moment().format('YYYY-MM-DD'),
          email : user.loginId
        }),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          if(response.result){
            Router.push(path.pages.authentication.login);
            toast.success(response.msg);
          }
          else{
            toast.error(response.msg, {style: {textAlign: 'center', maxWidth: '100%'}});
          }

        })
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async lostChangePwd(email: string): Promise<void> {
    await commonApi("put","/user/LostchangePwd",{loginId : email}).then((response)=>{
      if(response.status){
        toast.success(response.msg);
      }
      else{
        toast.error(response.msg);
      }
    });
  }


  async me(): Promise<{user: User}> {
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("get", "/user/getMyInfo").then((response: any)=> {
          if(response) {
            const user : User = {
              userSid: response.userSid,
              userNm: response.userNm,
              birthDt: response.birthDt,
              loginId: response.id,
              pwd: response.password,
              avatar: process.env.NEXT_PUBLIC_BACKEND_URL + response.avatar
            } 
            resolve({user : user});
          }
        })
        
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async modifyUserAvatar(img : File, user : User): Promise<{updateUser: User}> {
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("post", "/user/modifyUserAvatar", undefined, transFormData({img : img}),{'Content-Type': `multipart/form-data;`}).then(async (response: any)=> {
          if(response) {
            const updateUser : User = {
              userSid: user.userSid,
              userNm: user.userNm,
              birthDt: user.birthDt,
              loginId: user.loginId,
              pwd: user.pwd,
              avatar: process.env.NEXT_PUBLIC_BACKEND_URL + response
            }
            await wait(2000);
            resolve({updateUser : updateUser});
          }
        })
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async checkLogin(loginId: string, passowrd : string): Promise<Boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("get", "/user/checkLogin", {
            loginId : loginId,
            pwd : passowrd
        }).then((response: Boolean)=> {
            resolve(response);
        })
        
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async changePwd(loginId: string, newPassowrd : string): Promise<Boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("put", "/user/changePwd", {
            loginId : loginId,
            newPwd : newPassowrd
        }).then((response: any)=> {
          if(response === 1) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        })
        
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async changeMyName(user: User, newName : string): Promise<{updateUser: User}> {
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("put", "/user/changeMyName", {
            loginId : user.loginId,
            newName : newName
        }).then((response: any)=> {
          if(response === 1) {
              const updateUser : User = {
                userSid: user.userSid,
                userNm: newName,
                birthDt: user.birthDt,
                loginId: user.loginId,
                pwd: user.pwd,
                avatar: user.avatar
              }
              resolve({updateUser : updateUser});
          }
        })
        
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async deleteAccount(): Promise<Boolean> {

    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("delete", "/user/deleteUser").then((response: any)=> {
          if(response === 1) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        })
        
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
