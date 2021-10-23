import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Product } from 'src/app/shared/models/product.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private ActivatedRoute: ActivatedRoute) { }

  public displayedColumns: string[] = ['productID', 'title', 'category', 'brand', 'price', 'quantity', 'barcode', 'delete', 'edit'];
  public successful: boolean;
  public isLoading: boolean = false;
  public dataSource;
  public products: Product[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    const InitPromise = new Promise((resolve) => {
      window.scrollTo(0, 0);
      resolve(this.isLoading = true);
    });

    const ProductsPromise = new Promise((resolve) => {
      resolve(this.productService.getProducts().subscribe((products: Product[]) => {
        products.map((product) => { product.category = this.formatCategory(product.category); });
        this.products.splice(0, this.products.length);
        this.products.push(...products);
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }));
    });

    async function Init(): Promise<void> {
      await InitPromise;
    }

    async function Products(): Promise<void> {
      await ProductsPromise;
    }

    try {
      Init().then(Products).catch(err => new Error(err));
    } catch (error) {
      throw new Error(error);
    }
  }

  onEditProduct(barcode: string): void {
    this.router.navigate(['/product-edit', barcode]);
  }

  onDeleteProduct(barcode: string): void {
    try {
      this.isLoading = true;
      if (confirm('Are you sure you want to delete this product?')) {
        this.productService.deleteProduct(barcode).subscribe((success: boolean) => {
          if (success) {
            alert("Product deleted successfully");
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          } else {
            alert("Unable to delete product");
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          }
        });
      } else {
        this.isLoading = false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  formatCategory = (input: string): string => {
    let output = input.split("_").join(" ");
    return output;
  }
}
