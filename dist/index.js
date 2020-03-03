var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
export function createSingleTandomAJAXController(axiosRequestConfig) {
    const onGoingAJAXPromises = {};
    if (typeof axiosRequestConfig === 'object' && !!axiosRequestConfig) {
        singleTandemAJAX.preCreatedAxiosInstance = axios.create(axiosRequestConfig);
    }
    else {
        singleTandemAJAX.preCreatedAxiosInstance = null;
    }
    function singleTandemAJAX(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return;
            }
            const { requestType, axiosInstance } = options;
            let { axiosRequestConfig } = options;
            if (typeof axiosRequestConfig === 'string') {
                axiosRequestConfig = {
                    url: axiosRequestConfig,
                };
            }
            if (!axiosRequestConfig || !axiosRequestConfig.url || typeof axiosRequestConfig.url !== 'string') {
                return;
            }
            const requestTypeIsProvided = requestType !== undefined && requestType !== '';
            const requestTypeString = `${requestType}`;
            let onGoingAJAXPromise;
            if (requestTypeIsProvided) {
                onGoingAJAXPromise = onGoingAJAXPromises[requestTypeString];
            }
            if (!onGoingAJAXPromise) {
                const usedAxiosInstance = axiosInstance || singleTandemAJAX.preCreatedAxiosInstance || axios;
                onGoingAJAXPromise = usedAxiosInstance(axiosRequestConfig);
                if (requestTypeIsProvided) {
                    onGoingAJAXPromises[requestTypeString] = onGoingAJAXPromise;
                }
            }
            const responseRawOrResponseData = yield onGoingAJAXPromise;
            if (requestTypeIsProvided) {
                delete onGoingAJAXPromises[requestTypeString];
            }
            return responseRawOrResponseData;
        });
    }
    return singleTandemAJAX;
}
//# sourceMappingURL=index.js.map