import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { HeaderComponent } from './navigation/header/header.component';
import { TabbarComponent } from './navigation/tabbar/tabbar.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { ForgetpasswordComponent } from './auth/forgetpassword/forgetpassword.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppinglistsComponent } from './shopping-list/shoppinglists/shoppinglists.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { CartComponent } from './cart/cart.component';
import { FeedTheNationComponent } from './feed-the-nation/feed-the-nation.component';
import { SpecialsComponent } from './specials/specials.component';
import { ShopComponent } from './shop/shop.component';
import { SmartShopperComponent } from './smart-shopper/smart-shopper.component';
import { CataloguesComponent } from './catalogues/catalogues.component';
import { WinterComponent } from './home/winter/winter.component';
import { DeliveryDetailComponent } from './deliveries/delivery-detail/delivery-detail.component';
import { ClickAndCollectComponent } from './home/click-and-collect/click-and-collect.component';
import { CompetitionsComponent } from './home/competitions/competitions.component';
import { TrackMyOrderComponent } from './home/track-my-order/track-my-order.component';
import { CovidUpdateComponent } from './home/covid-update/covid-update.component';
import { QuestionsComponent } from './home/covid-update/questions/questions.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { ResetComponent } from './auth/forgetpassword/reset/reset.component';
import { ItemsNotFoundComponent } from './navigation/items-not-found/items-not-found.component';
import { UsersComponent } from './navigation/header/users/users.component';
import { EditProductsComponent } from './navigation/header/edit-products/edit-products.component';
import { UserNotLoggedInComponent } from './navigation/header/user-not-logged-in/user-not-logged-in.component';
import { EditUserComponent } from './navigation/header/users/edit-user/edit-user.component';
import { LiquorCatalogueComponent } from './home/liquor-catalogue/liquor-catalogue.component';
import { LoginService } from './auth/login/login.service';
import { CartService } from './shared/cart.service';
import { NoCartItemsComponent } from './cart/no-cart-items/no-cart-items.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NoCurrentFavoritesComponent } from './favorites/no-current-favorites/no-current-favorites.component';
import { HttpConfigInterceptor } from '../app/shared/httpconfig.interceptor';
import { ListDialogComponent } from './shopping-list/list-dialog/list-dialog.component';
import { JwtModule } from '@auth0/angular-jwt';
import 'hammerjs';
import { EditAddressComponent } from './deliveries/edit-address/edit-address.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AddedToCartComponent } from './cart/added-to-cart/added-to-cart.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    TabbarComponent,
    SignupComponent,
    LoginComponent,
    SidenavComponent,
    HomeComponent,
    PageNotFoundComponent,
    ForgetpasswordComponent,
    ProductsComponent,
    ProductDetailComponent,
    ProductEditComponent,
    RecipesComponent,
    RecipeDetailComponent,
    FavoritesComponent,
    ShoppingListComponent,
    ShoppinglistsComponent,
    DeliveriesComponent,
    CartComponent,
    FeedTheNationComponent,
    SpecialsComponent,
    ShopComponent,
    SmartShopperComponent,
    CataloguesComponent,
    WinterComponent,
    DeliveryDetailComponent,
    ClickAndCollectComponent,
    CompetitionsComponent,
    TrackMyOrderComponent,
    CovidUpdateComponent,
    QuestionsComponent,
    FooterComponent,
    ResetComponent,
    ItemsNotFoundComponent,
    UsersComponent,
    EditProductsComponent,
    UserNotLoggedInComponent,
    EditUserComponent,
    LiquorCatalogueComponent,
    NoCartItemsComponent,
    NoCurrentFavoritesComponent,
    ListDialogComponent,
    EditAddressComponent,
    AddedToCartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    NgxPayPalModule,
    ServiceWorkerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDHlrQ3EUlaUuM9ffdeG7dWpGj4zCgudhY',
      libraries: ['places']
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return sessionStorage.getItem('access_token');
        }
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginService, CartService],
})

export class AppModule { }
