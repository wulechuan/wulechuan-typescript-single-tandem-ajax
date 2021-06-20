import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CancelToken,
    CancelTokenSource,
} from 'axios'

const { CancelToken } = axios

const messagePrefix1 = '吴乐川的单串式AJAX控制器（ @wulechuan/single-tandem-ajax ）：'
const messagePrefix2 = '@wulechuan/single-tandem-ajax:'




export type 类型定义之发起新AJAX时若已存在同型号在行AJAX时之应对策略 = (
    | '允许反复发起同型号的 AJAX 请求'
    | '先中止业已在行之同型号 AJAX 请求，再发起新的 AJAX 请求'
    | '若有同型号 AJAX 业已在行，则等待之，而不再发起新的 AJAX 请求'
)

export type TPolicyOfStartingNewAJAX = (
    | 'allow to start AJAXes of the same type'
    | 'cancel ongoing AJAX and then start new AJAX'
    | 'wait for exiting AJAX of the same type and not start new AJAX'
)

export type 类型定义之各型号所有在行AJAX记录之字典 = {
    [requestType: string]: 类型定义之单一型号所有在行AJAX之公共记录;
};

export type 类型定义之AJAX型号 = string | number;

export type 类型定义之单一型号所有在行AJAX之公共记录 = {
    该AJAX完结之诺: Promise<any>;
    // promiseOfLastAjaxSettled: Promise<any>;

    用以取消该型号所有AJAX之公共配置?: CancelTokenSource;
    // cancelTokenSourceOfAllAjaxesOfThisType?: CancelTokenSource;
};

export type TAJAXRequestType = 类型定义之AJAX型号;
export type TDictOfAllRequestTypesOfAllOnGoingAJAXes = 类型定义之各型号所有在行AJAX记录之字典;
export type TRecordOfSingleRequestTypeAllOnGoingAJAXes = 类型定义之单一型号所有在行AJAX之公共记录;
export type TSingleTandemAJAXOptions = 类型定义之单串式AJAX控制器之配置项;

export type 类型定义之单串式AJAX控制器之配置项 = {
    该AJAX之Axios请求之配置?: string | AxiosRequestConfig;
    该AJAX之型号?: 类型定义之AJAX型号;
    该AJAX要求采用的Axios实例?: AxiosInstance;
    存在同型号在行AJAX时之应对策略?: 类型定义之发起新AJAX时若已存在同型号在行AJAX时之应对策略;
    应禁止在控制台打印关于在行AJAX被取消的警告信息?: boolean;
    应禁止在控制台打印关于新AJAX被堵截的警告信息?: boolean;

    axiosRequestConfig?:                        string | AxiosRequestConfig;
    requestType?:                               TAJAXRequestType;
    axiosInstance?:                             AxiosInstance;
    policyOfStartingNewAJAX?:                   TPolicyOfStartingNewAJAX;
    shouldDisableWarningOfCanceledOnGoingAJAX?: boolean;
    shouldDisableWarningOfNewAJAXSkipped?:      boolean;
};



export type 类型定义之单串式AJAX控制器<TResponseData = any> = {
    (options: 类型定义之单串式AJAX控制器之配置项): Promise<(
        | AxiosResponse<TResponseData>
        | undefined
    )>;

    该控制器预备的Axios实例: AxiosInstance;
    取消该型号之AJAX请求: (欲取消之AJAX之型号: 类型定义之AJAX型号) => void;
    取消该控制器所辖一切AJAX请求: () => void;

    (options: TSingleTandemAJAXOptions): Promise<(
        | AxiosResponse<TResponseData>
        | undefined
    )>;

    preCreatedAxiosInstance: AxiosInstance;
    cancelTheAJAXOfThisType: (theRequestType: TAJAXRequestType) => void;
    cancelAll: () => void;
};

export type TSingleTandemAJAX = 类型定义之单串式AJAX控制器;





function _取消该型号所有在行AJAX请求(各AJAX之记录字典: 类型定义之各型号所有在行AJAX记录之字典, 该AJAX之型号: 类型定义之AJAX型号): void {
    const 查得记录 = 各AJAX之记录字典[该AJAX之型号]
    if (!查得记录) {
        return
    }

    const { 用以取消该型号所有AJAX之公共配置 } = 查得记录
    if (!用以取消该型号所有AJAX之公共配置 ) {
        return
    }

    const { cancel, token } = 用以取消该型号所有AJAX之公共配置
    if (!(token instanceof CancelToken) || typeof cancel !== 'function') {
        return
    }

    cancel()
    delete 各AJAX之记录字典[该AJAX之型号]
}



export function createSingleTandemAJAXController(
    axiosRequestInitialConfig?: AxiosRequestConfig
): TSingleTandemAJAX {
    return 构建单串式AJAX控制器(axiosRequestInitialConfig)
}



export function 构建单串式AJAX控制器(
    axios请求之预设配置?: AxiosRequestConfig
): 类型定义之单串式AJAX控制器 {
    const 各AJAX之记录字典: 类型定义之各型号所有在行AJAX记录之字典 = {}



    const 该控制器预备的Axios实例 = axios.create(axios请求之预设配置)

    本单串式AJAX控制器.该控制器预备的Axios实例 = 该控制器预备的Axios实例
    本单串式AJAX控制器.取消该型号之AJAX请求 = function (欲取消之AJAX之型号: 类型定义之AJAX型号): void {
        _取消该型号所有在行AJAX请求(各AJAX之记录字典, 欲取消之AJAX之型号)
    }
    本单串式AJAX控制器.取消该控制器所辖一切AJAX请求 = function (): void {
        Object.keys(各AJAX之记录字典).forEach(某AJAX之型号 => {
            _取消该型号所有在行AJAX请求(各AJAX之记录字典, 某AJAX之型号)
        })
    }

    本单串式AJAX控制器.preCreatedAxiosInstance = 该控制器预备的Axios实例
    本单串式AJAX控制器.cancelTheAJAXOfThisType = function (theRequestType: TAJAXRequestType): void {
        _取消该型号所有在行AJAX请求(各AJAX之记录字典, theRequestType)
    }
    本单串式AJAX控制器.cancelAll = 本单串式AJAX控制器.取消该控制器所辖一切AJAX请求



    function 本单串式AJAX控制器<TResponseData>(
        总配置项: 类型定义之单串式AJAX控制器之配置项
    ): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined> {
        type 类型定义之本次AJAX之响应之诺 = Promise<(
            | AxiosResponse<TResponseData | undefined>
            | TResponseData
            | undefined
        )>;



        if (!总配置项) { return Promise.resolve(undefined) }

        const {
            该AJAX之Axios请求之配置,
            axiosRequestConfig,

            该AJAX之型号,
            requestType,

            该AJAX要求采用的Axios实例,
            axiosInstance,

            存在同型号在行AJAX时之应对策略,
            policyOfStartingNewAJAX,

            应禁止在控制台打印关于在行AJAX被取消的警告信息,
            shouldDisableWarningOfCanceledOnGoingAJAX,

            应禁止在控制台打印关于新AJAX被堵截的警告信息,
            shouldDisableWarningOfNewAJAXSkipped,
        } = 总配置项

        let _应对策略: 类型定义之发起新AJAX时若已存在同型号在行AJAX时之应对策略 = '若有同型号 AJAX 业已在行，则等待之，而不再发起新的 AJAX 请求'

        if (typeof 存在同型号在行AJAX时之应对策略 === 'string' && [
            '允许反复发起同型号的 AJAX 请求',
            '先中止业已在行之同型号 AJAX 请求，再发起新的 AJAX 请求',
            '若有同型号 AJAX 业已在行，则等待之，而不再发起新的 AJAX 请求',
        ].includes(存在同型号在行AJAX时之应对策略)) {
            _应对策略 = 存在同型号在行AJAX时之应对策略
        } else if (policyOfStartingNewAJAX === 'allow to start AJAXes of the same type') {
            _应对策略 = '允许反复发起同型号的 AJAX 请求'
        } else if (policyOfStartingNewAJAX === 'cancel ongoing AJAX and then start new AJAX') {
            _应对策略 = '先中止业已在行之同型号 AJAX 请求，再发起新的 AJAX 请求'
        } else if (policyOfStartingNewAJAX === 'wait for exiting AJAX of the same type and not start new AJAX') {
            _应对策略 = '若有同型号 AJAX 业已在行，则等待之，而不再发起新的 AJAX 请求'
        }

        let _最终决定的Axios请求之配置: AxiosRequestConfig | undefined

        if (typeof 该AJAX之Axios请求之配置 === 'string') {
            _最终决定的Axios请求之配置 = {
                // method: 'GET',
                url: 该AJAX之Axios请求之配置,
            }
        } else if (typeof 该AJAX之Axios请求之配置 === 'object' && !!该AJAX之Axios请求之配置) {
            _最终决定的Axios请求之配置 = 该AJAX之Axios请求之配置
        } else if (typeof axiosRequestConfig === 'string') {
            _最终决定的Axios请求之配置 = {
                // method: 'GET',
                url: axiosRequestConfig,
            }
        } else if (typeof axiosRequestConfig === 'object' && !!axiosRequestConfig) {
            _最终决定的Axios请求之配置 = axiosRequestConfig
        }

        if (!_最终决定的Axios请求之配置 || typeof _最终决定的Axios请求之配置.url !== 'string' || !_最终决定的Axios请求之配置.url.trim()) {
            return Promise.resolve(undefined)
        }

        _最终决定的Axios请求之配置.url = _最终决定的Axios请求之配置.url.trim()



        let _本次AJAX确已标明型号 = false
        let _该AJAX之型号之字符串值: string = ''
        if (该AJAX之型号 !== undefined && 该AJAX之型号 !== null && 该AJAX之型号 !== '') {
            _该AJAX之型号之字符串值 = `${该AJAX之型号}`
        } else if (requestType !== undefined && requestType !== null && requestType !== '') {
            _该AJAX之型号之字符串值 = `${requestType}`
        }



        let 旧有诺: 类型定义之本次AJAX之响应之诺 | undefined
        let 诺: 类型定义之本次AJAX之响应之诺 | undefined
        let 同类型AJAX之管理记录: 类型定义之单一型号所有在行AJAX之公共记录 | undefined

        if (_本次AJAX确已标明型号) {
            同类型AJAX之管理记录 = 各AJAX之记录字典[_该AJAX之型号之字符串值]
            if (同类型AJAX之管理记录) {
                旧有诺 = 同类型AJAX之管理记录.该AJAX完结之诺
            }
        }

        if (旧有诺 instanceof Promise) {
            if (_应对策略 === '允许反复发起同型号的 AJAX 请求') {
            } else if (_应对策略 === '先中止业已在行之同型号 AJAX 请求，再发起新的 AJAX 请求') {
                _取消该型号所有在行AJAX请求(各AJAX之记录字典, _该AJAX之型号之字符串值)

                let 应当打印警告信息 = true
                if (应禁止在控制台打印关于在行AJAX被取消的警告信息 !== undefined && 应禁止在控制台打印关于在行AJAX被取消的警告信息 !== null) {
                    应当打印警告信息 = !应禁止在控制台打印关于在行AJAX被取消的警告信息
                } else if (shouldDisableWarningOfCanceledOnGoingAJAX !== undefined && shouldDisableWarningOfCanceledOnGoingAJAX !== null) {
                    应当打印警告信息 = !shouldDisableWarningOfCanceledOnGoingAJAX
                }

                if (应当打印警告信息) {
                    console.warn(`${messagePrefix1} 另有一个同型号之 AJAX 业已在行。因欲发起新的 AJAX，在行 AJAX 已中止。\n所涉型号：“${_该AJAX之型号之字符串值}”。`)
                    console.warn(`${messagePrefix2} An already on going AJAX request has canceled due to the "requestType" being the same as that of the coming new AJAX.\nThe requestType is "${_该AJAX之型号之字符串值}".`)
                }
            } else if (_应对策略 === '若有同型号 AJAX 业已在行，则等待之，而不再发起新的 AJAX 请求') {
                诺 = 旧有诺

                let 应当打印警告信息 = true
                if (应禁止在控制台打印关于新AJAX被堵截的警告信息 !== undefined && 应禁止在控制台打印关于新AJAX被堵截的警告信息 !== null) {
                    应当打印警告信息 = !应禁止在控制台打印关于新AJAX被堵截的警告信息
                } else if (shouldDisableWarningOfNewAJAXSkipped !== undefined && shouldDisableWarningOfNewAJAXSkipped !== null) {
                    应当打印警告信息 = !shouldDisableWarningOfNewAJAXSkipped
                }

                if (应当打印警告信息) {
                    console.warn(`${messagePrefix1} 另有一个同型号之 AJAX 业已在行。新的 AJAX 已作罢。\n所涉型号：“${_该AJAX之型号之字符串值}”。`)
                    console.warn(`${messagePrefix2} An AJAX request has skipped due to another AJAX of the same "requestType" is on going.\nThe requestType is "${_该AJAX之型号之字符串值}".`)
                }
            }
        }

        if (!诺) {
            let 最终采纳的Axios实例: AxiosInstance = 该控制器预备的Axios实例

            if (该AJAX要求采用的Axios实例) {
                最终采纳的Axios实例 = 该AJAX要求采用的Axios实例
            } else if (axiosInstance) {
                最终采纳的Axios实例 = axiosInstance
            }

            const {
                cancelToken,
            } = _最终决定的Axios请求之配置

            let 取消之功能须由外部代码自行管理 = false

            if (cancelToken instanceof CancelToken) {
                取消之功能须由外部代码自行管理 = true
                console.warn(`${messagePrefix1} 本工具内部采用 Axios 。因 Axios 原初设计所限，本工具无法管理外部给出的 cancelToken 。故本次 AJAX 请求之取消功能不归本工具管理。`)
                console.warn(`${messagePrefix2} This tool utilies Axios internally. Due to the limitation of Axios design, this tool is not able to manage the cancelToken provided via the "Options". Thus, although the AJAX can be canceled, the cancelation must handled outside this tool.`)
            } else {
                if (cancelToken) {
                    console.warn(`${messagePrefix1} 配置项中给出的 cancelToken 无效。已废弃。`)
                    console.warn(`${messagePrefix2} The "cancelToken" provided by the "Options" is invalid. Thus is ignored.`)
                }
            }

            let 用以取消该型号所有AJAX之公共配置: CancelTokenSource | undefined
            let 用以取消该型号所有AJAX之公共令牌: CancelToken | undefined

            if (_本次AJAX确已标明型号) {
                if (!取消之功能须由外部代码自行管理) {
                    if (同类型AJAX之管理记录) {
                        const {
                            用以取消该型号所有AJAX之公共配置: 用以取消之公共配置,
                        } = 同类型AJAX之管理记录

                        if (用以取消之公共配置) {
                            用以取消该型号所有AJAX之公共配置 = 用以取消之公共配置
                            用以取消该型号所有AJAX之公共令牌 = 用以取消该型号所有AJAX之公共配置.token
                        }
                    }

                    if (!用以取消该型号所有AJAX之公共配置) {
                        用以取消该型号所有AJAX之公共配置 = CancelToken.source()
                    }
                }
            }

            if (用以取消该型号所有AJAX之公共令牌) {
                _最终决定的Axios请求之配置.cancelToken = 用以取消该型号所有AJAX之公共令牌
            }



            诺 = 最终采纳的Axios实例(_最终决定的Axios请求之配置)



            if (_本次AJAX确已标明型号) {
                if (同类型AJAX之管理记录) {
                    同类型AJAX之管理记录.该AJAX完结之诺 = 诺
                    // 同类型AJAX之管理记录.promiseOfLastAjaxSettled = 诺
                } else {
                    各AJAX之记录字典[_该AJAX之型号之字符串值] = {
                        该AJAX完结之诺: 诺,
                        // promiseOfLastAjaxSettled: 诺,
                    }

                    同类型AJAX之管理记录 = 各AJAX之记录字典[_该AJAX之型号之字符串值]
                }

                if (用以取消该型号所有AJAX之公共配置) {
                    同类型AJAX之管理记录.用以取消该型号所有AJAX之公共配置 = 用以取消该型号所有AJAX之公共配置
                    // 同类型AJAX之管理记录.cancelTokenSourceOfAllAjaxesOfThisType = 用以取消该型号所有AJAX之公共配置
                }

                诺.finally(() => {
                    // FIXME 如果允许多个同型号 AJAX 并行，则此处草率 delete 记录是不妥的，可能导致早先在行之诺无法取消。
                    delete 各AJAX之记录字典[_该AJAX之型号之字符串值]
                })
            }
        }

        return 诺
    }



    return 本单串式AJAX控制器
}
