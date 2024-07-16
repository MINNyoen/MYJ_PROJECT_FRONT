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
      //성공
      if(response.data.status === process.env.NEXT_PUBLIC_HTTP_STATUS_OK){
        returnData = response.data.data;
      }
  });
      return returnData;
  } catch (error: any) {
    console.log(error);
    const liveError = [404,500,403];
    if(error.response.code === 401){
      location.href = path.pages.authentication.login;
      globalThis.localStorage.removeItem('accessToken');
    }
    else if(liveError.includes(error.response.status)){
      location.href = "/"+error.response.status;
    }
    //만들어지지 않은 페이지
    else {
      //location.href = "/500";
    }
  }

}