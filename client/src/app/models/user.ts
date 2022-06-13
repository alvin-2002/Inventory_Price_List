import { Product } from "./product";

export interface User {
    email: string;
    token: string;
    products?: Product[];
}