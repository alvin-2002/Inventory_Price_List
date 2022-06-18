export interface Product {
    id: number;
    name: string;
    totalPrice: number;
    date: Date;
    quantity: number;
    unit: string;
    categoryName?: string;
    shopName?: string;
    pricePerUnit: number;
}

export interface UpdateProduct {
    id: number;
    name: string;
    totalPrice: number;
    date: Date;
    quantity: number;
    unit: number;
    categoryId: number | null;
    shopId: number | null;
}

export interface ProductParams {
    searchTerm?: string;
    categoryId?: number;
    shopId?: number;
}