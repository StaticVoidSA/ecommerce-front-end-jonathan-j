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
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/products/getProducts',
            {
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }

    getProduct(barcode: string): Observable<Product> {
        return this.http.post<Product>(
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/products/getProduct',
            {
                barcode: barcode
            },
            {
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }

    editProduct(product: ProductUpdate): Observable<boolean> {
        return this.http.put<boolean>(
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/products/updateProduct',
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
                    'Role': sessionStorage.getItem('user_role'),
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }

    deleteProduct(barcode: string): Observable<boolean> {
        return this.http.post<boolean>(
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/products/deleteProduct',
            {
                barcode: barcode
            },
            {
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }

    searchCatalogue(category: string): Observable<Catalogue[]> {
        return this.http.get<Catalogue[]>(
            `https://rnr-ecommerce-server-jj.herokuapp.com/api/catalogue/getCatalogueItems?category=${category}`,
            {
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }
}
