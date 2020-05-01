import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios'





export type TOnGoingAJAXPromises = {
    [requestType: string]: Promise<any>;
};

export type TSingleTandemAJAXOptions = {
    axiosRequestConfig:                 string | AxiosRequestConfig;
    requestType?:                       string | number;
    axiosInstance?:                     AxiosInstance;
    shouldDisableWarningOfSkippedAJAX?: boolean;
};

export type TSingleTandemAJAX = {
    <TResponseData>(options:TSingleTandemAJAXOptions): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>;
    preCreatedAxiosInstance: AxiosInstance;
};




// 旧版本采用了含错别字的函数名，在此也故意保留该旧版函数名。
export const createSingleTandomAJAXController = createSingleTandemAJAXController




export function createSingleTandemAJAXController(
    axiosRequestConfig?: AxiosRequestConfig
): TSingleTandemAJAX {
    const onGoingAJAXPromises: TOnGoingAJAXPromises = {}



    const preCreatedAxiosInstance = axios.create(axiosRequestConfig)
    singleTandemAJAX.preCreatedAxiosInstance = preCreatedAxiosInstance



    async function singleTandemAJAX<TResponseData>(
        options: TSingleTandemAJAXOptions
    ): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined> {
        if (!options) { return }

        const {
            requestType,
            axiosInstance: providedAxiosInstance,
            shouldDisableWarningOfSkippedAJAX,
        } = options

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

        if (onGoingAJAXPromise) {
            if (!shouldDisableWarningOfSkippedAJAX) {
                console.warn(`An AJAX request is skipped due to another AJAX of the same "requestType" is on going.\nThe requestType is "${requestType}".`)
            }
        } else {
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
