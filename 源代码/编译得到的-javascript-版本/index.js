import axios from 'axios';
export function createSingleTandemAJAXController(axiosRequestConfig) {
    const onGoingAJAXPromises = {};
    const preCreatedAxiosInstance = axios.create(axiosRequestConfig);
    singleTandemAJAX.preCreatedAxiosInstance = preCreatedAxiosInstance;
    function singleTandemAJAX(options) {
        if (!options) {
            return Promise.resolve(undefined);
        }
        const { requestType, axiosInstance: providedAxiosInstance, shouldDisableWarningOfSkippedAJAX, } = options;
        let { axiosRequestConfig } = options;
        if (typeof axiosRequestConfig === 'string') {
            axiosRequestConfig = {
                url: axiosRequestConfig,
            };
        }
        if (!axiosRequestConfig || !axiosRequestConfig.url || typeof axiosRequestConfig.url !== 'string') {
            return Promise.resolve(undefined);
        }
        const requestTypeIsProvided = requestType !== undefined && requestType !== '';
        const requestTypeString = `${requestType}`;
        let onGoingAJAXPromise;
        if (requestTypeIsProvided) {
            onGoingAJAXPromise = onGoingAJAXPromises[requestTypeString];
        }
        if (onGoingAJAXPromise) {
            if (!shouldDisableWarningOfSkippedAJAX) {
                console.warn(`An AJAX request is skipped due to another AJAX of the same "requestType" is on going.\nThe requestType is "${requestType}".`);
            }
        }
        else {
            const usedAxiosInstance = providedAxiosInstance || preCreatedAxiosInstance; // || axios
            onGoingAJAXPromise = usedAxiosInstance(axiosRequestConfig);
            if (requestTypeIsProvided) {
                onGoingAJAXPromises[requestTypeString] = onGoingAJAXPromise;
            }
        }
        onGoingAJAXPromise.finally(() => {
            if (requestTypeIsProvided) {
                delete onGoingAJAXPromises[requestTypeString];
            }
        });
        return onGoingAJAXPromise;
    }
    return singleTandemAJAX;
}
