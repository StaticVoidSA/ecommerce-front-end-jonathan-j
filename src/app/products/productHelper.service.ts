import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Favorites } from "../shared/favorites.service";
import { ProductUpdate } from "../shared/models/product-update.model";
import { Product } from "../shared/models/product.model";
import { ProductService } from "../shared/product.service";

@Injectable({ providedIn: 'root' })
export class ProductHelperService {

    constructor(private service: ProductService,
        private router: Router) { }

    getProductData(newProduct, product, productForm, barcode) {
        const promise = new Promise(resolve => {
            newProduct.productID = product.productID;
            newProduct.title = productForm.value.productData.title;
            newProduct.category = productForm.value.productData.category;
            newProduct.description = productForm.value.productData.description;
            newProduct.price = productForm.value.productData.price;
            newProduct.features = productForm.value.productData.features;
            newProduct.brand = productForm.value.productData.brand;
            newProduct.quantity = productForm.value.productData.quantity;
            newProduct.uri = productForm.value.productData.uri;
            newProduct.usage = productForm.value.productData.usage;
            newProduct.barcode = productForm.value.productData.barcode;
            newProduct._barcode = barcode;
            resolve(newProduct);
        });
        return promise;
    }

    getFavoriteData = (productID, userId, title, description, brand, quantity, uri, price, barcode) => {
        const promise = new Promise(resolve => {
            const favorite: Favorites = {
                productID: +productID,
                userID: userId,
                favID: userId,
                title: title,
                description: description,
                brand: brand,
                quantity: quantity,
                uri: uri,
                price: price,
                barcode: barcode
            }
            resolve(favorite);
        });
        return promise;
    }

    updateProduct = (newProduct: any, product: Product, productForm: NgForm, barcode: string) => {
        this.getProductData(newProduct, product, productForm, barcode)
            .then((product: ProductUpdate) => {
                if (product) {
                    if (confirm('Are you sure you want to update this product?')) {
                        this.service.editProduct(product).subscribe(data => {
                            if (data) {
                                alert(`Product: ${product.title} was successfully edited`);
                                this.router.navigate(["/edit-products"]);
                            } else {
                                alert(`Unable to update ${product.title}`);
                                this.router.navigate(["/edit-products"]);
                            }
                        });
                    } else {
                        return this.router.navigate(["/edit-products"]);
                    }
                } else {
                    return;
                }
            }).catch(error => {
                throw new Error(error);
            });
    }
}