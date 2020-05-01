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
// 旧版本采用了含错别字的函数名，在此也故意保留该旧版函数名。
export const createSingleTandomAJAXController = createSingleTandemAJAXController;
export function createSingleTandemAJAXController(axiosRequestConfig) {
    const onGoingAJAXPromises = {};
    const preCreatedAxiosInstance = axios.create(axiosRequestConfig);
    singleTandemAJAX.preCreatedAxiosInstance = preCreatedAxiosInstance;
    function singleTandemAJAX(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return;
            }
            const { requestType, axiosInstance: providedAxiosInstance, shouldDisableWarningOfSkippedAJAX, } = options;
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
            const rawResponseOrResponseData = yield onGoingAJAXPromise;
            if (requestTypeIsProvided) {
                delete onGoingAJAXPromises[requestTypeString];
            }
            return rawResponseOrResponseData;
        });
    }
    return singleTandemAJAX;
}
//# sourceMappingURL=index.js.map