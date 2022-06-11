import axios, { AxiosError, AxiosResponse } from "axios";
import { request } from "http";


axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config: any) => {
    const token = JSON.parse(localStorage.getItem('user')!).token;
    console.log(token)
    if (!config) {
        config = {};
    }
    if (!config.headers) {
        config.headers = {};
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // console.log('sdfsd', config.headers.Authorization)
    return config;

})

axios.interceptors.response.use(response => {

    return response;

}, (error: AxiosError) => {
    const { status } = error.response!;
    const data: any  = error.response!.data;

    switch (status) {
        case 400:
            // transform error from backend
            if (data.errors) {
                const modelStateError: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateError.push(data.errors[key]);
                    }
                }
                throw modelStateError.flat();
            }
            break;
    
        default:
            break;
    }



    return Promise.reject(error);
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody), // or axios.get(url).then(response => response.data)
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
}

const Products = {
    list: () => requests.get('products')
}

const agent = {
    Account,
    Products
}

export default agent;