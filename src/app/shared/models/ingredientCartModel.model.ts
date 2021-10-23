import { CartItem } from "../cart.service";

export class IngredientCartModel {
    userID: number;
    cartID: number;
    title: string;
    brand: string;
    price: number;
    quantity: number;
    barcode: string;
    productID: number;
    
    constructor(userID, cartID, title, brand, price, quantity, barcode, productID) {
        this.userID = userID;
        this.cartID = cartID;
        this.title = title;
        this.brand = brand;
        this.price = price;
        this.quantity = quantity;
        this.barcode = barcode;
        this.productID = productID
    }
}