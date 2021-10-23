export interface SearchRequestData {
    brand: string,
    category: string;
    price: number;
    quantity: string;
    minRange?: number;
    maxRange?: number;
}