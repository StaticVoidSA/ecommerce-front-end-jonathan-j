import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SearchRespData } from './models/SearchRespData.model';
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product.model';
import { ProductUpdate } from './models/product-update.model';

export interface Catalogue {
    brand: string,
    category: string
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(private http: HttpClient) { }

    public searchItems = new Subject<Product[]>();
    public emittedProduct = new EventEmitter<SearchRespData>();

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(
            'https://localhost:4446/api/products/getProducts'
        )
    }

    getProduct(barcode: string): Observable<Product> {
        return this.http.post<Product>(
            'https://localhost:4446/api/products/getProduct',
            {
                barcode: barcode
            }
        )
    }

    editProduct(product: ProductUpdate): Observable<boolean> {
        return this.http.put<boolean>(
            'https://localhost:4446/api/products/updateProduct',
            {
                productID: product.productID,
                title: product.title,
                category: product.category,
                brand: product.brand,
                uri: product.uri,
                price: product.price,
                description: product.description,
                features: product.features,
                usage: product.usage,
                quantity: product.quantity,
                barcode: product.barcode,
                _barcode: product._barcode
            },
            {
                headers:
                {
                    'Authorization': sessionStorage.getItem('access_token'),
                    'User': sessionStorage.getItem('user_name'),
                    'Role': sessionStorage.getItem('user_role')
                }
            }
        )
    }

    deleteProduct(barcode: string): Observable<boolean> {
        return this.http.post<boolean>(
            'https://localhost:4446/api/products/deleteProduct',
            {
                barcode: barcode
            }
        )
    }

    searchCatalogue(category: string): Observable<Catalogue[]> {
        return this.http.get<Catalogue[]>(
            `https://localhost:4446/api/catalogue/getCatalogueItems?category=${category}`
        )
    }
}
