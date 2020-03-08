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
    preCreatedAxiosInstance: AxiosInstance;
};





export function createSingleTandomAJAXController(
    axiosRequestConfig?: AxiosRequestConfig
): TSingleTandemAJAX {
    const onGoingAJAXPromises: TOnGoingAJAXPromises = {}



    const preCreatedAxiosInstance = axios.create()
    singleTandemAJAX.preCreatedAxiosInstance = preCreatedAxiosInstance



    async function singleTandemAJAX<TResponseData>(
        options: TSingleTandemAJAXOptions
    ): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined> {
        if (!options) { return }

        const { requestType, axiosInstance: providedAxiosInstance } = options

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
            const usedAxiosInstance: AxiosInstance = providedAxiosInstance || preCreatedAxiosInstance // || axios
            onGoingAJAXPromise = usedAxiosInstance(axiosRequestConfig)
            if (requestTypeIsProvided) {
                onGoingAJAXPromises[requestTypeString] = onGoingAJAXPromise
            }
        }

        const rawResponseOrResponseData = await onGoingAJAXPromise

        if (requestTypeIsProvided) {
            delete onGoingAJAXPromises[requestTypeString]
        }

        return rawResponseOrResponseData
    }



    return singleTandemAJAX
}
