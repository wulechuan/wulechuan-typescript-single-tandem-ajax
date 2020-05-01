import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export declare type TOnGoingAJAXPromises = {
    [requestType: string]: Promise<any>;
};
export declare type TSingleTandemAJAXOptions = {
    axiosRequestConfig: string | AxiosRequestConfig;
    requestType?: string | number;
    axiosInstance?: AxiosInstance;
    shouldDisableWarningOfSkippedAJAX?: boolean;
};
export declare type TSingleTandemAJAX = {
    <TResponseData>(options: TSingleTandemAJAXOptions): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>;
    preCreatedAxiosInstance: AxiosInstance;
};
export declare const createSingleTandomAJAXController: typeof createSingleTandemAJAXController;
export declare function createSingleTandemAJAXController(axiosRequestConfig?: AxiosRequestConfig): TSingleTandemAJAX;
