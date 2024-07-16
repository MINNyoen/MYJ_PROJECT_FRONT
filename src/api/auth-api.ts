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
    await wait(500);
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("post", "/login", login ?{
            loginId : login.loginId,
            pwd : login.pwd,
        } : undefined).then((response: any)=> {
          if(response.result) {
            resolve({accessToken : response.accessToken, user : response.user});
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
    await wait(1000);

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

  async autoLogin(): Promise<{user: User}> {
    await wait(500);
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("get", "/autoLogin").then((response: any)=> {
          if(response.result) {
            resolve({user : response.user});
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


  async me(): Promise<{user: User | undefined}> {
    await wait(500);
    return new Promise( async (resolve, reject) => {
      try {
        await commonApi("get", "/user/getMyInfo").then((response: any)=> {
          if(response) {
            const user : User = {
              userSid: response.userSid,
              userNm: response.userNm,
              birthDt: response.birthDt,
              loginId: response.id,
              pwd: response.pwd,
              avatar: process.env.NEXT_PUBLIC_BACKEND_URL + response.avatar
            } 
            resolve({user : user});
          }
          else {
            resolve({user : undefined});
          }
          
        })
        
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async modifyUserAvatar(img : File): Promise<{user: User}> {
    await wait(500);
    return new Promise( async (resolve, reject) => {
      try {
        console.log(img);
        await commonApi("post", "/user/modifyUserAvatar", undefined, transFormData({img : img}),{'Content-Type': `multipart/form-data;`}).then((response: any)=> {
          if(response) {
            const user : User = {
              userSid: response.userSid,
              userNm: response.userNm,
              birthDt: response.birthDt,
              loginId: response.id,
              pwd: response.pwd,
              avatar: process.env.NEXT_PUBLIC_BACKEND_URL + response.avatar
            } 
            resolve({user : user});
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
}

export const authApi = new AuthApi();
