import axios, { AxiosRequestConfig } from "axios";
import AxiosRetry from "axios-retry";
import { message } from 'antd';
// const [messageApi] = message.useMessage();

const BASE_CONFIG: Partial<AxiosRequestConfig> = {
  baseURL: "http://192.168.2.91:8000/",
};
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
const client = axios.create(BASE_CONFIG);

AxiosRetry(client, { retries: 3 }); // 错误自动重试请求，最多尝试3次

const http = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  config?: AxiosRequestConfig
) => {
  try {
    const r = await client(url, { method, ...config });
    if (r?.data?.status) {
      // 存在错误，弹窗处理
      // messageApi.open({
      //   type: 'error',
      //   content: r?.data?.prompts ?? "默认错误内容",
      // });
    }
    return r?.data as T;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const httpGET = <T>(url: string, config?: AxiosRequestConfig) => http<T>('GET', url, config)

const httpPOST = <T>(url: string, data?: AxiosRequestConfig['data'], config?: AxiosRequestConfig) =>
  http<T>('POST',url,{ data, ...config })

const httpDELETE = <T>(url: string, data?: AxiosRequestConfig['data'], config?: AxiosRequestConfig) =>
  http<T>('DELETE', url, { params: data, ...config })

const httpPUT = <T>(url: string, data?: AxiosRequestConfig['data'], config?: AxiosRequestConfig) =>
  http<T>('PUT', url, { data, ...config })

export { httpGET, httpPOST, httpDELETE, httpPUT, http };