export interface Product {
    id: number;
    name: string;
    totalPrice: number;
    date: Date;
    quantity: number;
    unit: string;
    categoryName?: string;
    pricePerUnit: number;
}

export interface UpdateProduct {
    id: number;
    name: string;
    totalPrice: number;
    date: Date;
    quantity: number;
    unit: number;
    categoryName: number | null;
}