import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForgetpasswordComponent } from './auth/forgetpassword/forgetpassword.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppinglistsComponent } from './shopping-list/shoppinglists/shoppinglists.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { CartComponent } from './cart/cart.component';
import { SpecialsComponent } from './specials/specials.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShopComponent } from './shop/shop.component';
import { FeedTheNationComponent } from './feed-the-nation/feed-the-nation.component';
import { SmartShopperComponent } from './smart-shopper/smart-shopper.component';
import { CataloguesComponent } from './catalogues/catalogues.component';
import { WinterComponent } from './home/winter/winter.component';
import { DeliveryDetailComponent } from './deliveries/delivery-detail/delivery-detail.component';
import { ClickAndCollectComponent } from './home/click-and-collect/click-and-collect.component';
import { CompetitionsComponent } from './home/competitions/competitions.component';
import { TrackMyOrderComponent } from './home/track-my-order/track-my-order.component';
import { CovidUpdateComponent } from './home/covid-update/covid-update.component';
import { QuestionsComponent } from './home/covid-update/questions/questions.component';
import { ResetComponent } from './auth/forgetpassword/reset/reset.component';
import { ItemsNotFoundComponent } from './navigation/items-not-found/items-not-found.component';
import { UsersComponent } from './navigation/header/users/users.component';
import { CartGuardService } from './shared/cart-guard.service';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { EditProductsComponent } from './navigation/header/edit-products/edit-products.component';
import { UserNotLoggedInComponent } from './navigation/header/user-not-logged-in/user-not-logged-in.component';
import { EditUserComponent } from './navigation/header/users/edit-user/edit-user.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { ProductResolverService } from './shared/product-resolver.service';
import { LocationResolverService } from './shared/location-resolver.service';
import { LiquorCatalogueComponent } from './home/liquor-catalogue/liquor-catalogue.component';
import { NoCartItemsComponent } from './cart/no-cart-items/no-cart-items.component';
import { NoCurrentFavoritesComponent } from './favorites/no-current-favorites/no-current-favorites.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { EditAddressComponent } from './deliveries/edit-address/edit-address.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, resolve: { data: LocationResolverService }, pathMatch: 'full' },
    { path: 'winter', component: WinterComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] },
    { path: 'edit-users/:email', component: EditUserComponent, canActivate: [CartGuardService] },
    { path: 'logout', component: HomeComponent },
    { path: 'favorites', component: FavoritesComponent, canActivate: [CartGuardService] },
    { path: 'cart', component: CartComponent, canActivate: [CartGuardService] },
    { path: 'click-and-collect', component: ClickAndCollectComponent, canActivate: [CartGuardService] },
    { path: 'competitions', component: CompetitionsComponent },
    { path: 'track-my-order', component: TrackMyOrderComponent, canActivate: [AuthGuardService] },
    { path: 'covid-update', component: CovidUpdateComponent },
    { path: 'questions', component: QuestionsComponent },
    { path: 'products/:category', component: ProductsComponent },
    { path: 'liquor-catalogue', component: LiquorCatalogueComponent },
    { path: 'product-detail/:barcode', component: ProductDetailComponent },
    { path: 'edit-products', component: EditProductsComponent, canActivate: [AuthGuardService], resolve: { data: ProductResolverService } },
    { path: 'product-edit/:barcode', component: ProductEditComponent, canActivate: [CartGuardService] },
    { path: 'shoppinglist', component: ShoppingListComponent, canActivate: [CartGuardService] },
    { path: 'shoppinglists/:listname/:userID', component: ShoppinglistsComponent, canActivate: [CartGuardService]},
    { path: 'feedthenation', component: FeedTheNationComponent },
    { path: 'smartshopper', component: SmartShopperComponent },
    { path: 'catalogues', component: CataloguesComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shop/:item', component: ShopComponent, pathMatch: 'full' },
    { path: 'deliveries', component: DeliveriesComponent, canActivate: [CartGuardService] },
    { path: 'delivery-detail', component: DeliveryDetailComponent, canActivate: [CartGuardService] },
    { path: 'edit-address/:ID/:addressID/:addressNickName/:userAddress/:isDefault', component: EditAddressComponent, canActivate: [CartGuardService] },
    { path: 'recipes', component: RecipesComponent },
    { path: 'recipe-detail/:recipeID', component: RecipeDetailComponent },
    { path: 'specials', component: SpecialsComponent },
    { path: 'forgetpassword', component: ForgetpasswordComponent},
    { path: 'reset/:hash', component: ResetComponent },
    { path: 'user-not-logged-in', component: UserNotLoggedInComponent },
    { path: 'items-not-found', component: ItemsNotFoundComponent },
    { path: 'no-current-favorites', component: NoCurrentFavoritesComponent },
    { path: 'no-cart-items', component: NoCartItemsComponent },
    { path: '**', component: PageNotFoundComponent }

]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
