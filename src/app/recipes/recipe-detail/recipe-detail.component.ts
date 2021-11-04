import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeComplete, RecipeService } from 'src/app/shared/recipe.service';
import { CartService } from 'src/app/shared/cart.service';
import { LoginService } from 'src/app/auth/login/login.service';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';
import { HomeHelperService } from 'src/app/home/homeHelper.service';
import { ShopHelperService } from 'src/app/shop/shopHelper.service';
import { IngredientCartModel } from 'src/app/shared/models/ingredientCartModel.model';
import { Favorites } from 'src/app/shared/favorites.service';
import { FavoritesComponent } from 'src/app/favorites/favorites.component';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  public recipeID: number = 0;
  public recipes: RecipeComplete[] = [];
  public isLoading: boolean = false;
  public user: AuthRespData;
  public cartCount: number = 0;
  public loggedIn: boolean = false;
  public connected: boolean = false;

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private cartService: CartService,
    private loginService: LoginService,
    private router: Router,
    private homeHelper: HomeHelperService) { }

  ngOnInit(): void {
    const ConnectionPromise = new Promise(() => {
      window.scrollTo(0, 0);
      this.isLoading = true;
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
    });

    const UserPromise = new Promise(() => {
      this.loginService.currentUser.subscribe((user: AuthRespData) => { 
        if (user) {
          this.user = {
            token: user.token,
            userId: user.userId,
            userName: user.userName,
            expiresIn: user.expiresIn,
            loggedIn: user.loggedIn,
            userRole: user.userRole,
            success: user.success
          }; 
        } else {
          this.user = {
            token: null,
            userId: null,
            userName: null,
            expiresIn: null,
            loggedIn: false,
            userRole: null,
            success: null
          }; 
        }
      });
    });

    const RoutePromise = new Promise(() => {
      this.route.params.subscribe((params: Params) => {
        this.recipeID = params.recipeID;
      });
    });

    const RecipesPromise = new Promise(() => {
      this.recipeService.getRecipe(this.recipeID).subscribe((data: RecipeComplete[]) => {
        this.recipes.splice(0, this.recipes.length);
        this.recipes.push(...data);
        this.isLoading = false;
      });
    });

    async function Init() {
      await ConnectionPromise;
      await UserPromise;
      await RoutePromise;
      await RecipesPromise;
    }

    try {
      Init().catch(err => { throw new Error(err) });
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToCart = () => {
    try {
      this.isLoading = true;
      var prdID = 0;

      if (this.user.loggedIn === false) {
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/user-not-logged-in']);
        }, 500);
      } else {
        var ingredientItems: IngredientCartModel[] = [];

        this.recipes.map((item) => {
          var _item: IngredientCartModel = {
            userID: this.user.userId,
            cartID: this.user.userId,
            title: item.ingredientTitle,
            brand: item.brand,
            price: item.price,
            quantity: 1,
            barcode: item.barcode,
            productID: prdID++
          }
          ingredientItems.push(_item);
        });

        this.recipeService.addIngredientItemsToCart(ingredientItems).subscribe((cartCount: number) => {
          if (cartCount > 0) {
            setTimeout(() => {
              this.cartCount = cartCount;
              this.cartService.cartCountUpdate(this.cartCount);
              this.isLoading = false;
            }, 500);
          } else {
            alert(`Unable to add ingredients to cart`);
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          }
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToFavorites = () => {
    try {
      if (this.user.loggedIn !== true) {
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/user-not-logged-in']);
        }, 500);
      } else {
          this.isLoading = true;
          let num = 0;
          let currentFavorites: Favorites[] = [];

          this.recipes.forEach(recipe => {
            let favorite: Favorites = {
              barcode: recipe.barcode,
              productID: num++,
              title: recipe.ingredientTitle,
              description: "",
              brand: recipe.brand,
              quantity: recipe.quantity,
              uri: recipe.ingredientImage,
              price: recipe.price,
              userID: this.user.userId,
              favID: recipe.recID
            };

            currentFavorites.push(favorite);
          });

          this.recipeService.addIngredientsToFavorites(currentFavorites).subscribe((success:boolean) => {
            if (!success) alert('Unable to add ingredients to Favorites');
            this.isLoading = false;
          });
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  //   try {
  //     let num = 0;
  //     this.isLoading = true;
  //     this.recipes.forEach((recipe: RecipeComplete) => {
  //       num++;
  //       this.shopHelper.addToFavorites(num, recipe.ingredientTitle, '', recipe.brand, 
  //       recipe.quantity, recipe.ingredientImage, recipe.price, recipe.barcode);
  //     });
  //     setTimeout(() => {
  //       this.isLoading = false;
  //     }, 500);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}