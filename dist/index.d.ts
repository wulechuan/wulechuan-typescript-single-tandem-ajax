import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
declare type TSingleTandemAJAXOptions = {
    requestType?: string | number;
    axiosInstance?: AxiosInstance;
    axiosRequestConfig: string | AxiosRequestConfig;
};
declare type TSingleTandemAJAX = {
    <TResponseData>(options: TSingleTandemAJAXOptions): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>;
    preCreatedAxiosInstance: AxiosInstance;
};
export declare function createSingleTandomAJAXController(axiosRequestConfig?: AxiosRequestConfig): TSingleTandemAJAX;
export {};
