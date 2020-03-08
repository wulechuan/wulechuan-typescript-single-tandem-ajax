# 吴乐川的单串式 AJAX 控制器

<link rel="stylesheet" href="./documents/styles/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">


## Multilingual Editions of this Article

- [English version of this ReadMe](./ReadMe.en-US.md)




## NPM 页

<dl>
<dt>NPM 包名</dt>
<dd>

[@wulechuan/single-tandem-ajax](https://www.npmjs.com/package/@wulechuan/single-tandem-ajax)

</dd>
<dt>作者</dt>
<dd><p>南昌吴乐川</p></dd>
</dl>





## 简介

### 存在意义

简而言之，本工具是用于发起单串式 AJAX 请求的。本工具内部采用了
[Axios](https://www.npmjs.com/package/axios) 以实现 AJAX 之功能。Axios 本身已经很成熟了，那么本工具具体又能提供什么样的额外功能呢？

我们常常面临这样的问题：对于一个给定的 AJAX API，我们不想：

-   同一浏览器页签（或窗口）在同一时刻向该 API 发出多次 AJAX 请求。

相反，我们希望：

-   如果已经有一个指向该 API 的【请求甲】在进行，即浏览器仍在等待这次 AJAX 请求结束（或出错），而某段 JavaScript（或 TypeScript）代码此时欲再次发起指向相同 API 的【请求乙】，则【请求乙】应被忽略，以免网络请求重复。
-   同时，我们希望等待【请求乙】的后续代码自动改为等待【请求甲】。

本工具即用于解决上述问题。

并且，本工具支持 TypeScript 语法。

> 须注意，本工具**并非**队列工具。队列仅会延后任务之发起。而本工具的目的是排斥后续任务，即，后续任务会被取消。



### 实现原理

本工具的实现原理很简单，预设一个空的对象（即指一个没有键值对的对象，而非指 `null`）作为在行 AJAX 请求的字典。尔后，每欲发起一次 AJAX 请求时，发起该请求的源代码可以提供一个任意**非空**字符串，作为本次 AJAX 请求的所谓 `requestType`。该请求的 Promise 对象会以上述 `requestType` 为【键】，存放在前述的对象（字典）中。同时，本工具之源代码会返回该 Promise，令调用本工具之代码的后续代码等待该 Promise 被兑现或拒绝。如果在上述 AJAX 请求运转期间，有代码亦将另行发起具有相同 `requestType` 的 AJAX 请求，则该新的 AJAX 请求直接被忽略，且本工具返回的 Promise 是已经在运转的那个 AJAX 请求所对应的 Promise。

> 其实布尔值和数字值也可以用作 `requestType`，但显然不如采用字符串那样明确。




## 用法

### 用法浅析

本人将由本工具构建的 AJAX 控制器称为所谓“**单串式 AJAX 控制器**”，不妨简称**控制器**。

但本工具直接提供的并非所谓控制器，而是提供一个函数，视为控制器之构建函数。调用该构建函数，既可以得到一个控制器。反复调用构建函数，则得到多个互相独立的控制器。

每个所谓的控制器可视作 axios 的加强版，但二者用法略有不同。详见下文。控制器与 axios 的亦有相同点：二者都是函数。调用一次控制器，则可发起一次 AJAX 请求。由于所谓控制器实则一个函数，故亦可称为所谓“控制器函数”。

**综上，使用本工具的基本思路是：调用构建函数得到控制器函数，进而调用控制器函数以发起 AJAX。**

那么，为何允许构建多个控制器函数，而不是提供单一的控制器函数直接使用呢？因为在复杂的程序中，要任务保持整个程序所有犄角旮旯的 AJAX 请求之 `requestType`  互不相同也是一件麻烦甚至较困难的事情。我们可能希望在小范围内的代码中的一组 AJAX API 对应的 AJAX 请求做到“单串式”即可。这样即简便易行，也降低了模块之间的耦合程度。因此，我们实际上是希望多个控制器相互独立运转的。

所谓“多个控制器相互独立”，本质上是指多个控制器的 `requestType` 在不同的命名空间中。因此，

-   由两个**不同**控制器发起 AJAX 的请求，即便两次请求恰好具备相同 `requestType` ，这两次请求也互不排斥;
-   而由**同一个**控制器发起的两次 AJAX 请求，如果 `requestType` 相同，则只要先发起的请求仍为结束，后发起的那一次会被先发起的请求排斥掉，即后发起的 AJAX 请求实际上根本不会执行。




### 针对 TypeScript 编程环境的用法

见下例。

> 注意！采用本工具之 TypeScript 版本时，`import` 语句的 `from` 指向 npm 包名，即指向 npm 包的 `main` 文件。实际上，指向的是 `./index.ts`。

```ts
import {
    createSingleTandomAJAXController,
} from '@wulechuan/single-tandem-ajax'

const singleTandomAJAX = createSingleTandomAJAXController()
singleTandomAJAX.preCreatedAxiosInstance.interceptors.response.use(
    response => response.data
)



type TTheResponseData = {
    name: string;
    favorite: string[];
};

const responseData = await singleTandomAJAX<TTheResponseData>({
    requestType: '随便一个非空字符串，作为唯一标识即可',
    axiosRequestConfig: {
        method: 'POST',
        url: 'https://nan-chang.wulechuan.cn/non-exsiting/restful-api/update-info',
        data: {
            message: '大家好！我来自伟大的中国。',
        },
    },
})

console.log(responseData)
```


### 针对 JavaScript (ECMAScript) 编程环境的用法

见下例。


> 注意！采用本工具之 JavaScript 版本时，`import` 语句的 `from` 指向 `./dist`。实际上，指向的是 `./dist/index.js`。

```js
import {
    createSingleTandomAJAXController,
} from '@wulechuan/single-tandem-ajax'

const singleTandomAJAX = createSingleTandomAJAXController()
singleTandomAJAX.preCreatedAxiosInstance.interceptors.response.use(
    response => response.data
)



type TTheResponseData = {
    name: string;
    favorite: string[];
};

const responseData = await singleTandomAJAX({
    requestType: '随便一个非空字符串，作为唯一标识即可',
    axiosRequestConfig: {
        method: 'POST',
        url: 'https://nan-chang.wulechuan.cn/non-exsiting/restful-api/update-info',
        data: {
            message: '大家好！我来自伟大的中国。',
        },
    },
})

console.log(responseData)
```


---


## 应用编程接口（API）


### 构建函数

构建函数名为 `createSingleTandomAJAXController`，用于构建单串式 AJAX 控制器。不妨将构建出的一个个单串式 AJAX 控制器称为所谓“实例”，实例的类型为 `TSingleTandemAJAX`。

类似于原版的 axios 允许预先配置一些公共的信息，例如 `baseURL`、`timeout` 和 `headers` 等，以方便之后使用，借助本构建程序构建所谓实例时，也可以配置好上述公共信息。欲预先配置上述信息，则在调用该构建程序时，须提供唯一的参数。

参数中提供的配置其实是用于幕后的 `axios.create()`，得到一个 axios 实例函数（类型为 `axiosInstance`），使用也是在幕后。并且本构建函数（即 `createSingleTandomAJAXController` ）的唯一入口参数之类型正是 `AxiosRequestConfig`，之与 `axios.create()` 入口参数之类型吻合。参阅《[axios 官方文档的相关部分](https://www.npmjs.com/package/axios#axioscreateconfig)》。

如果调用该构建程序时，省略了参数，则构建出的实例在发起 AJAX 请求时，幕后会采用 `axios` 本身，而非 `axiosInstance`。



与【构建函数】之**签名**（Signature）有关的源代码片段如下：

```ts
import { AxiosRequestConfig } from 'axios'

export function createSingleTandomAJAXController(
    axiosRequestConfig?: AxiosRequestConfig
): TSingleTandemAJAX
```




### 单串式 AJAX 控制器

单串式 AJAX 控制器，不妨简称“**控制器**”，它是一个函数，因此称其为“**控制器函数**”也无妨。控制器函数由构建函数构建。每个单串式 AJAX 控制器可视作 axios 的加强版，但二者用法略有不同。


与【控制器函数】之**签名**（Signature）有关的源代码片段如下：

```ts
import { AxiosResponse } from 'axios'



type TSingleTandemAJAXOptions = {
    requestType?: string | number;
    axiosInstance?: AxiosInstance;
    axiosRequestConfig: string | AxiosRequestConfig;
};



async function singleTandemAJAX<TResponseData>(
    options: TSingleTandemAJAXOptions
): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>
```



#### `options`

类型为 `TSingleTandemAJAXOptions`。其下有 3 个属性，其中 2 个可选，1 个必须。如下。

##### `options.requestType?`

本参数可以省略。

用于标记一次 AJAX 请求的所谓 ID。如果另有一次 AJAX 请求携带的 ID 与一个正在运转的 AJAX 相同，则后发起的那次 AJAX 请求会被忽略。

如果该值省略，或取“空字符串”，则表示对应的 AJAX 请求没有具体的所谓 ID，亦因此不会排斥任何后续发起的 AJAX 请求。简而言之，此种情形下，本工具之功用完全等同于原版的 axios。


##### `options.axiosInstance?`

本参数可以省略。

提供专门用于本次调用时须采用的 axios 实例（类型为 `AxiosInstance`）。万一你需要在借助本工具排斥后续 AJAX 请求的同时，必须临时启用一个特定的 axios 实例，则将其通过该参数传给单串式 AJAX 控制器实例，即可。

注意，即便在构建函数中预先构建好了 axios 实例，如果此参数（指 `options.axiosInstance`）临时提供了一个 axios 实例，则会采用该临时提供的 axios 实例，而不采用预先构建好的 axios 实例。


##### `options.axiosRequestConfig`

本参数是必须的。

其类型是 `AxiosRequestConfig`，不难猜测，本参数用于配置欲发起的 AJAX 请求。同时，参照原生的 axios 行为，本参数也可以简化为单一字符串，视作以 `GET` 方式发起的 AJAX 请求的 URL。



#### 所谓静态属性

我们知道，JavaScript 中的函数可以视作对象。因此，函数也可以携带键值对，即携带属性。如果一个函数被视作所谓“类”，那么该函数本身携带的键值对被称作所谓“静态”的。此处我们的单串式 AJAX 控制器实例函数并非“类”，但这些实例函数仍各自携带了一些属性。我们不妨借用该术语，称这些实例函数携带的属性也为所谓“静态属性”。

目前，实例函数仅携带一种“静态属性”，名为 `preCreatedAxiosInstance`。



##### `TSingleTandemAJAX.preCreatedAxiosInstance`

该属性的取值类型为 `AxiosInstance`。

在借助“构建函数”构建一个“实例函数”时，构建函数会同时构建好一个 axios 的实例，以便后续对此 axios 实例进行专门的配置，而不影响你的代码中其它地方可能存在的 axios 实例。如果给构建函数传入了配置参数，则此参数会用于构建上述 axios 实例。该实例作为“实例函数”的一个静态属性存在。

我们常常喜欢利用 axios 实例的 `interceptors` 属性来预先配置原始响应数据的预处理，仅传出原始响应数据的 `data` 属性。那么，再此，我们可以对 `preCreatedAxiosInstance` 做同样的配置。例如：

```ts
const singleTandomAJAX = createSingleTandomAJAXController()
singleTandomAJAX.preCreatedAxiosInstance.interceptors.response.use(
    response => response.data
)
```



---

## 未来计划

暂无。


---

## 许可证类型

WTFPL

> 注意：
>
> 我未研究过许可证的约束。因此姑且声明为 WTFPL 类型。但实际上该许可证类型可能与我采用的开源模块有冲突。



