import axios, { ResponseType } from 'axios';
import path from 'components/path.json';

export const commonApi  = async (method: 'get' | 'post' | 'put' | 'delete', url: string, params?:{}, data?: {},headers?: {}, responseType?: ResponseType ) => {
  let returnData: any;
  try {
    await axios({
      method: method,
      url: process.env.NEXT_PUBLIC_BACKEND_URL + url,
      params: params,
      data: data,
      responseType: responseType,
      headers: {Authorization: globalThis.localStorage.getItem("accessToken"), 'Access-Control-Allow-Origin': '*', ...headers},
      withCredentials: true,
    }).then(function (response: any) {
      console.log(response);
      //성공
      if(response.data.status === process.env.NEXT_PUBLIC_HTTP_STATUS_OK){
        returnData = response.data.data;
      }
      else {
        const liveError = [404,500,403];
        if(response.data.code === 401){
          globalThis.localStorage.removeItem('accessToken');
          location.href = path.pages.authentication.login;
        }
        else if(liveError.includes(response.data.status)){
          location.href = "/" + response.data.status;
        }
      }
  });
      return returnData;
  } catch (error: any) {
    console.log(error);
  }

}