import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'





type TOnGoingAJAXPromises = {
    [requestType: string]: Promise<any>;
};

type TSingleTandemAJAXOptions = {
    requestType?: string | number;
    axiosInstance?: AxiosInstance;
    axiosRequestConfig: string | AxiosRequestConfig;
};

type TSingleTandemAJAX = {
    <TResponseData>(options:TSingleTandemAJAXOptions): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>;
    preCreatedAxiosInstance: null | AxiosInstance;
};





export function createSingleTandomAJAXController(
    axiosRequestConfig?: AxiosRequestConfig
): TSingleTandemAJAX {
    const onGoingAJAXPromises: TOnGoingAJAXPromises = {}



    if (typeof axiosRequestConfig === 'object' && !!axiosRequestConfig) {
        singleTandemAJAX.preCreatedAxiosInstance = axios.create(axiosRequestConfig)
    } else {
        singleTandemAJAX.preCreatedAxiosInstance = null
    }



    async function singleTandemAJAX<TResponseData>(
        options: TSingleTandemAJAXOptions
    ): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined> {
        if (!options) { return }

        const { requestType, axiosInstance } = options

        let { axiosRequestConfig } = options

        if (typeof axiosRequestConfig === 'string') {
            axiosRequestConfig = {
                url: axiosRequestConfig,
            }
        }

        if (!axiosRequestConfig || !axiosRequestConfig.url || typeof axiosRequestConfig.url !== 'string') {
            return
        }

        const requestTypeIsProvided = requestType !== undefined && requestType !== ''
        const requestTypeString = `${requestType}`

        type TThisAJAXPromise = Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>;

        let onGoingAJAXPromise: TThisAJAXPromise | undefined

        if (requestTypeIsProvided) {
            onGoingAJAXPromise = onGoingAJAXPromises[requestTypeString]
        }

        if (!onGoingAJAXPromise) {
            const usedAxiosInstance: AxiosInstance = axiosInstance || singleTandemAJAX.preCreatedAxiosInstance || axios
            onGoingAJAXPromise = usedAxiosInstance(axiosRequestConfig)
            if (requestTypeIsProvided) {
                onGoingAJAXPromises[requestTypeString] = onGoingAJAXPromise
            }
        }

        const responseRawOrResponseData = await onGoingAJAXPromise

        if (requestTypeIsProvided) {
            delete onGoingAJAXPromises[requestTypeString]
        }

        return responseRawOrResponseData
    }



    return singleTandemAJAX
}
