import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe.model';
import { IngredientCartModel } from './models/ingredientCartModel.model';
import { Favorites } from './favorites.service';

export interface RecipeComplete {
  recipeTitle: string,
  recipeImage: string,
  recID: number,
  brand: string,
  category: string,
  quantity: string,
  ingredientTitle: string,
  ingredientImage: string,
  price: number,
  barcode: string
}

@Injectable({providedIn: 'root'})
export class RecipeService {

  constructor(private http: HttpClient) {}

  recipesStartup(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/recipes/startupRecipes',
      {
        headers: {
          'Access-Control-Allow-Origin' : 'https://rnr-ecommerce-server-jj.herokuapp.com'
        }
      }
    )
  }

  getRecipes(): Observable<RecipeComplete[]> {
    return this.http.get<RecipeComplete[]>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/recipes/getRecipes',
      {
        headers: {
          'Access-Control-Allow-Origin' : 'https://rnr-ecommerce-server-jj.herokuapp.com'
        }
      }
    )
  }

  getRecipe(recID: number): Observable<RecipeComplete[]> {
    return this.http.get<RecipeComplete[]>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/recipes/getRecipe?recID=${recID}`,
      {
        headers: {
          'Access-Control-Allow-Origin' : 'https://rnr-ecommerce-server-jj.herokuapp.com'
        }
      }
    )
  }

  addIngredientItemsToCart(items: IngredientCartModel[]): Observable<number> {
    return this.http.post<number>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/recipes/addIngredientsToCart`, items,
      {
        headers:
        {
            'Authorization': sessionStorage.getItem('access_token'),
            'User': sessionStorage.getItem('user_name'),
            'Role': sessionStorage.getItem('user_role'),
            'Access-Control-Allow-Origin' : 'https://rnr-ecommerce-server-jj.herokuapp.com'
        }
      }
    )
  }

  addIngredientsToFavorites(items: Favorites[]): Observable<boolean> {
    return this.http.post<boolean>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/recipes/addIngredientsToFavorites`, items,
      {
        headers:
        {
            'Authorization': sessionStorage.getItem('access_token'),
            'User': sessionStorage.getItem('user_name'),
            'Role': sessionStorage.getItem('user_role'),
            'Access-Control-Allow-Origin' : 'https://rnr-ecommerce-server-jj.herokuapp.com'
        }
      }
    )
  }
}
