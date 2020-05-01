# Wulechuan's Single Tandem AJAX Controller

<link rel="stylesheet" href="./node_modules/@wulechuan/css-stylus-markdown-themes/dist/css/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">



## Multilingual Editions of this Article

- 《[本文之简体中文版](../ReadMe.md)》




## NPM Page

<dl>
<dt>NPM Package Name</dt>
<dd>

[@wulechuan/single-tandem-ajax](https://www.npmjs.com/package/@wulechuan/single-tandem-ajax)

</dd>
<dt>Author</dt>
<dd><p>wulechuan (南昌吴乐川)</p></dd>
</dl>





## Introduction

### Why should this Tool Exist

Simply put, this tool starts AJAX reuqests. This tool utilizes the famous
[Axios](https://www.npmjs.com/package/axios) internally. So, what extra functionalities are provided by this tool over axios? Or, why should this tool exist?

We probably keep facing such type of problems: for a given AJAX API, we **don't** want:

-   The same browser tab or window starts more than one AJAX requests to the given API at the same time.

**Instead, we want:**

-   When there is already an on going AJAX request to the given API, let's call it reuqest A. If another request (request B) also tends to start to the same API, then the request B should be ignored, so that we don't request the same API repeatedly.

-   What's more, those codes that were to wait for the request B, which is ignored and not exists at all, should turn to wait for request A.

**This tool should be the right one to choose to solve above problem. As a plus, this tool is written in TypeScript.**


> Note that this tool is **not** an AJAX requests queueing tool. A queue delays later tasks but not abandones them. While this tool is to prevent duplications of a running task, thus it abandones later tasks.


### The Idea

The idea is actually quite simple. It holds an object, as the dictionary of all ongoing(aka unsettled) AJAX Promises. The keys are so-called `requestType`. If another AJAX request is pending by some JavaScript(or TypeScript) codes, but with exactly the same `requestType` of some unsettled AJAX Promise, then the pending AJAX request is simply ignored, and the unsettled Promise is returned.


> In face, boolean and number values are also valid `requestType`s. But these two types are less meaningful than strings. Thus neither boolean nor number is recommended.




## Usage

### Concepts

I call those stuffs provided by this package, for controlling AJAX requests, "single tandem AJAX controllers". Let's call them "controllers" for short.

But this package provides no single tandem AJAX controllers directly. Instead, it provides a creator of them. That is, the package provides a JavaScript fucntion, for creating as many controller as you need.

A so-called controller is an enhanced axios instance. But the usage changes a bit from that of an original axios instance. See below.

Whereas a controller is not an axios instacne, they do have common points. First of all, both are functions. You invoke a controller once, you might start an AJAX request.

**So basically, the way to use this pacakage is, to invoke the creator function to get the controller function; then to invoke the controller function to start AJAX requests.**

Then, why do we need to create multiple controllers? Why don't we simply provide one controller directly, and just use the only controller to do all AJAX requests?

Well, in a complex or scaled project, we might start AJAX reuqests all over the source code base, especially across multiple modules. To manually ensure the uniqueness of `requestType`s for **any** AJAX requests is neither easy, nor necessary. We often need to keep the uniqueness of AJAX `requestType`s within a relative small scope, so as to keep these AJAX single tandem. As a plus, this helps avoiding modules from being uncessarily coupled. When mulitple controllers are created, each for a module, the problem is solved.

There come additional rules:

-   If two different controllers start an AJAX request each, with happenly the same `requestType`, either request blocks the other, both AJAX requests start as normal.
-   If the same controller starts two AJAX requests in sequence, then the subsequent one is blocked by the early started and on going one. In other words, the subsequent AJAX request does **not** exist in fact.



### For TypeScript Developers

See the example below.

> Note that when working with TypeScript, for the `import` statement of this package, the `from` part points to the npm package name of its, aka the `main` file metioned in the `package.json`. To be specific, the main file is in fact `./source/index.ts`.


```ts
import {
    createSingleTandemAJAXController,
} from '@wulechuan/single-tandem-ajax'

const singleTandomAJAX = createSingleTandemAJAXController()
singleTandomAJAX.preCreatedAxiosInstance.interceptors.response.use(
    response => response.data
)



type TYourResponseData = {
    name: string;
    favorite: string[];
};

const responseData = await singleTandomAJAX<TYourResponseData>({
    requestType: 'any non-empty string you prefer, as the unique id',
    axiosRequestConfig: {
        method: 'POST',
        url: 'https://nan-chang.wulechuan.cn/non-exsiting/restful-api/update-info',
        data: {
            message: 'Hello! I\'m from China.',
        },
    },
})

console.log(responseData)
```


### For JavaScript (ECMAScript) Developers

See the example below.

> Note that when working with JavaScript(ECMAScript), for the `import` statement, the `from` part points to `./dist`, which is in fact `./dist/index.js`.

```js
import {
    createSingleTandemAJAXController,
} from '@wulechuan/single-tandem-ajax'

const singleTandomAJAX = createSingleTandemAJAXController()
singleTandomAJAX.preCreatedAxiosInstance.interceptors.response.use(
    response => response.data
)



type TYourResponseData = {
    name: string;
    favorite: string[];
};

const responseData = await singleTandomAJAX({
    requestType: 'any non-empty string you prefer, as the unique id',
    axiosRequestConfig: {
        method: 'POST',
        url: 'https://nan-chang.wulechuan.cn/non-exsiting/restful-api/update-info',
        data: {
            message: 'Hello! I\'m from China.',
        },
    },
})

console.log(responseData)
```


---


## API


### The Creator of Single Tandem AJAX Controllers

The creator, is naturally a function, named `createSingleTandemAJAXController`. It is used to create a single tandem AJAX controller, of type `TSingleTandemAJAX`.

Just like the original axios, this tool allows us to configure some common features beforehand, for a set of AJAX requests, or maybe **all** AJAX requests. Such as the `baseURL`, `timeout` and `headers`, etc. To configure AJAX controller beforehand, you provide one and the only one argument to the creator function.

The argument of the creator function, if provided, is of type `AxiosRequestConfig`. It is used to create an axios instance function, of type `axiosInstance` behind the scene. Naturally, the `axios.create()` is invoke to create the axios instance, and the the argument is passed to the `axios.create()` as is. See the [related part of the official documentation of axios](https://www.npmjs.com/package/axios#axioscreateconfig).


If no arguments are provide while invoking the creator, then a raw `axios` is used behind the scene.



The related source code snippet reads:

```ts
import { AxiosRequestConfig } from 'axios'

export function createSingleTandemAJAXController(
    axiosRequestConfig?: AxiosRequestConfig
): TSingleTandemAJAX
```




### The Single Tandem AJAX Controller

A so-called **controller** is an enhanced axios instance. But the usage changes a bit from that of an original axios instance


The related source code snippet reads:

```ts
import { AxiosResponse } from 'axios'



type TSingleTandemAJAXOptions = {
    axiosRequestConfig:                 string | AxiosRequestConfig;
    requestType?:                       string | number;
    axiosInstance?:                     AxiosInstance;
    shouldDisableWarningOfSkippedAJAX?: boolean;
};



async function singleTandemAJAX<TResponseData>(
    options: TSingleTandemAJAXOptions
): Promise<AxiosResponse<TResponseData | undefined> | TResponseData | undefined>
```



#### `options`

The type of the options is `TSingleTandemAJAXOptions`. It contains 4 properties. Among them, 3 are optional, and 1 is required.


##### `options.axiosRequestConfig`

This property is **required**.

The allow type is `AxiosRequestConfig`. As the type hints, the property is for configuring an AJAX request. And, just like using the original axios, this property is allowed to simplified to be just a string, treated as the URL of a `GET` request.



##### `options.requestType?`

This property is optional.

This is the unique ID of an AJAX request. If this AJAX is still on going, and another AJAX request with exactly the same ID is pending, then the new AJAX request is simple blocked.

If this property is omitted, or its value is an empty string, then the AJAX request has no ID, and will **not** block any subsequence AJAX requests. In other words, this progam works just as the original axios.



##### `options.axiosInstance?`

This property is optional.

In case you'd like to temporarily use a certain axios instance, you provide the axios instance to this property. Thus, the AJAX request will start via this axios instance, just this time.

If you have already prepared a pre-built axios instance by passing an option to the controller creator, then you provide another axios instance here temporarily, the temporary axios instance is used, just this time.



##### `options.shouldDisableWarningOfSkippedAJAX?`

This property is optional.

It's a value of Boolean type. The name describes the usage well, I think.


#### The So-called Static Property

Each single tandem AJAX controller, can carry its own properties, as any JavaScript function can.

And a single tandem AJAX controller does carry one special property, named `preCreatedAxiosInstance`.


##### `TSingleTandemAJAX.preCreatedAxiosInstance`

The value type is `AxiosInstance`.

As we often configure an axios instance of its `interceptors` property, to output the "pure" `data` property of the raw response, we can also do the same configuration to this `preCreatedAxiosInstance` property, like this:

```ts
const singleTandomAJAX = createSingleTandemAJAXController()
singleTandomAJAX.preCreatedAxiosInstance.interceptors.response.use(
    response => response.data
)
```


---

## TODOs

Nothing at present.



---

## License

WTFPL

> NOTE:
>
> I'm not an expert about license types. So I temporarily use WTFPL. But I guess this type of license might conflict with the ones used by those npm packages I'm utilizing.

