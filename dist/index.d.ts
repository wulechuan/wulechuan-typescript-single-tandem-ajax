import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export declare type TOnGoingAJAXPromises = {
    [requestType: string]: Promise<any>;
};
export declare type TSingleTandemAJAXOptions = {
    requestType?: string | number;
    axiosInstance?: AxiosInstance;
    axiosRequestConfig: string | AxiosRequestConfig;
};
export declare type TSingleTandemAJAX = {
    <TResponseData>(options: TSingleTandemAJAXOptions): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>;
    preCreatedAxiosInstance: AxiosInstance;
};
export declare function createSingleTandomAJAXController(axiosRequestConfig?: AxiosRequestConfig): TSingleTandemAJAX;
