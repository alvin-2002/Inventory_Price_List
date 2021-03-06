import axios, { AxiosError, AxiosResponse } from "axios";
import { request } from "http";
import { toast } from "react-toastify";
import { store } from "../store/configureStore";


axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config: any) => {
    // const token = JSON.parse(localStorage.getItem('user')!);
    const token = store.getState().account.user?.token;

    if (!config) {
        config = {};
    }
    if (!config.headers) {
        config.headers = {};
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;

})

axios.interceptors.response.use(async response => {
    
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
            throw data.title;
        
        case 401: 
            toast.error(data.title);
            throw data.title;

        case 403:
            toast.error("You are not authorized to do that!");
            break;
        
        case 500: 
            toast.error("Sorry Internal Server");
            throw data.title;
    
        default:
            break;
    }
    return Promise.reject(error);
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody), // or axios.get(url).then(response => response.data)
    post: (url: string, body?: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser')
}

const Categories = {
    list: () => requests.get('category'),
    add: (name: any) => requests.post('category', name),
    update: (data: any) => requests.put('category', data),
    delete: (id: number) => requests.delete(`category/${id}`) 
}

const Shop = {
    list: () => requests.get('shop'),
    add: (name: any) => requests.post('shop', name),
    update: (data: any) => requests.put('shop', data),
    delete: (id: number) => requests.delete(`shop/${id}`) 
}

const Products = {
    list: (params: URLSearchParams) => requests.get('products', params),
    detail: (id: number) => requests.get(`products/${id}`),
    create: (data: any) => requests.post('products', data),
    update: (data: any) => requests.put('products', data),
    delete: (id: number) => requests.delete(`products/${id}`)
}

const agent = {
    Account,
    Products,
    Shop,
    Categories
}

export default agent;