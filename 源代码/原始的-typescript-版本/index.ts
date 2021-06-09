import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios'




type 类型定义之发起新AJAX时若已存在同型号在行AJAX时之应对策略 = (
    | '允许反复发起同型号的 AJAX 请求'
    | '先中止业已在行之同型号 AJAX 请求，再发起新的 AJAX 请求'
    | '若有同型号 AJAX 业已在行，则等待之，而不再发起新的 AJAX 请求'
)

export type TPolicyOfStartingNewAJAX = (
    | 'allow to start AJAXes of the same type'
    | 'cancel ongoing AJAX and then start new AJAX'
    | 'wait for exiting AJAX of the same type and not start new AJAX'
)

export type 类型定义之在行各AJAX之记录字典 = {
    [requestType: string]: TConfigOfSingleOnGoingAJAX;
};

export type 类型定义之AJAX型号 = string | number;

export type 类型定义之单条在行AJAX记录 = {
    该AJAX完结之诺: Promise<any>;
    取消该AJAX: () => void;
};

export type TAJAXRequestType = 类型定义之AJAX型号;
export type TDictOfOnGoingAJAXs = 类型定义之在行各AJAX之记录字典;
export type TConfigOfSingleOnGoingAJAX = 类型定义之单条在行AJAX记录;
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



export type 类型定义之单串式AJAX控制器 = {
    <外来类型定义之AJAX响应之Data>(options: 类型定义之单串式AJAX控制器之配置项): Promise<(
        | AxiosResponse<外来类型定义之AJAX响应之Data | undefined>
        | 外来类型定义之AJAX响应之Data
        | undefined
    )>;

    该控制器预备的Axios实例: AxiosInstance;
    取消该型号之AJAX请求: (欲取消之AJAX之型号: 类型定义之AJAX型号) => void;
    取消该控制器所辖一切AJAX请求: () => void;

    <TResponseData>(options: TSingleTandemAJAXOptions): Promise<(
        | AxiosResponse<TResponseData | undefined>
        | TResponseData
        | undefined
    )>;

    preCreatedAxiosInstance: AxiosInstance;
    cancelTheAJAXOfThisType: (theRequestType: TAJAXRequestType) => void;
    cancelAll: () => void;
};

export type TSingleTandemAJAX = 类型定义之单串式AJAX控制器;





function _取消该型号之AJAX请求(各AJAX之记录字典: 类型定义之在行各AJAX之记录字典, 该AJAX之型号: 类型定义之AJAX型号): void {
    const 查得记录 = 各AJAX之记录字典[该AJAX之型号]
    if (!查得记录 || typeof 查得记录.取消该AJAX !== 'function') {
        return
    }

    查得记录.取消该AJAX()
    delete 各AJAX之记录字典[该AJAX之型号]
}

export function createSingleTandemAJAXController(axiosRequestInitialConfig?: AxiosRequestConfig): TSingleTandemAJAX {
    return 构建单串式AJAX控制器(axiosRequestInitialConfig)
}

export function 构建单串式AJAX控制器(
    axios请求之预设配置?: AxiosRequestConfig
): 类型定义之单串式AJAX控制器 {
    const 各AJAX之记录字典: 类型定义之在行各AJAX之记录字典 = {}



    const 该控制器预备的Axios实例 = axios.create(axios请求之预设配置)

    本单串式AJAX控制器.该控制器预备的Axios实例 = 该控制器预备的Axios实例
    本单串式AJAX控制器.取消该型号之AJAX请求 = function (欲取消之AJAX之型号: 类型定义之AJAX型号): void {
        _取消该型号之AJAX请求(各AJAX之记录字典, 欲取消之AJAX之型号)
    }
    本单串式AJAX控制器.取消该控制器所辖一切AJAX请求 = function (): void {
        Object.keys(各AJAX之记录字典).forEach(某AJAX之型号 => {
            _取消该型号之AJAX请求(各AJAX之记录字典, 某AJAX之型号)
        })
    }

    本单串式AJAX控制器.preCreatedAxiosInstance = 该控制器预备的Axios实例
    本单串式AJAX控制器.cancelTheAJAXOfThisType = function (theRequestType: TAJAXRequestType): void {
        _取消该型号之AJAX请求(各AJAX之记录字典, theRequestType)
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



        let 诺: 类型定义之本次AJAX之响应之诺 | undefined

        if (_本次AJAX确已标明型号) {
            const 查得记录 = 各AJAX之记录字典[_该AJAX之型号之字符串值]
            if (查得记录) {
                诺 = 查得记录.该AJAX完结之诺
            }
        }

        let 应当发起新的AJAX请求 = false
        if (诺 instanceof Promise) {
            if (_应对策略 === '允许反复发起同型号的 AJAX 请求') {
                应当发起新的AJAX请求 = true
            } else if (_应对策略 === '先中止业已在行之同型号 AJAX 请求，再发起新的 AJAX 请求') {
                _取消该型号之AJAX请求(各AJAX之记录字典, _该AJAX之型号之字符串值)
                应当发起新的AJAX请求 = true

                let 应当打印警告信息 = true
                if (应禁止在控制台打印关于在行AJAX被取消的警告信息 !== undefined && 应禁止在控制台打印关于在行AJAX被取消的警告信息 !== null) {
                    应当打印警告信息 = !应禁止在控制台打印关于在行AJAX被取消的警告信息
                } else if (shouldDisableWarningOfCanceledOnGoingAJAX !== undefined && shouldDisableWarningOfCanceledOnGoingAJAX !== null) {
                    应当打印警告信息 = !shouldDisableWarningOfCanceledOnGoingAJAX
                }

                if (应当打印警告信息) {
                    console.warn(`另有一个同型号之 AJAX 业已在行。因欲发起新的 AJAX，在行 AJAX 已中止。\n所涉型号：“${_该AJAX之型号之字符串值}”。`)
                    console.warn(`An already on going AJAX request has canceled due to the "requestType" being the same as that of the coming new AJAX.\nThe requestType is "${_该AJAX之型号之字符串值}".`)
                }
            } else {
                应当发起新的AJAX请求 = false

                let 应当打印警告信息 = true
                if (应禁止在控制台打印关于新AJAX被堵截的警告信息 !== undefined && 应禁止在控制台打印关于新AJAX被堵截的警告信息 !== null) {
                    应当打印警告信息 = !应禁止在控制台打印关于新AJAX被堵截的警告信息
                } else if (shouldDisableWarningOfNewAJAXSkipped !== undefined && shouldDisableWarningOfNewAJAXSkipped !== null) {
                    应当打印警告信息 = !shouldDisableWarningOfNewAJAXSkipped
                }

                if (应当打印警告信息) {
                    console.warn(`另有一个同型号之 AJAX 业已在行。新的 AJAX 已作罢。\n所涉型号：“${_该AJAX之型号之字符串值}”。`)
                    console.warn(`An AJAX request is skipped due to another AJAX of the same "requestType" is on going.\nThe requestType is "${_该AJAX之型号之字符串值}".`)
                }
            }
        } else {
            应当发起新的AJAX请求 = true
        }

        if (应当发起新的AJAX请求) {
            let 最终采纳的Axios实例: AxiosInstance = 该控制器预备的Axios实例

            if (该AJAX要求采用的Axios实例) {
                最终采纳的Axios实例 = 该AJAX要求采用的Axios实例
            } else if (axiosInstance) {
                最终采纳的Axios实例 = axiosInstance
            }

            诺 = 最终采纳的Axios实例(_最终决定的Axios请求之配置)

            const {
                cancelToken, // TODO
            } = _最终决定的Axios请求之配置

            if (_本次AJAX确已标明型号) {
                各AJAX之记录字典[_该AJAX之型号之字符串值] = {
                    该AJAX完结之诺: 诺,
                    取消该AJAX () {
                        // TODO
                    },
                }
            }

            诺.finally(() => {
                if (_本次AJAX确已标明型号) {
                    delete 各AJAX之记录字典[_该AJAX之型号之字符串值]
                }
            })
        }

        return 诺 as 类型定义之本次AJAX之响应之诺
    }



    return 本单串式AJAX控制器
}
