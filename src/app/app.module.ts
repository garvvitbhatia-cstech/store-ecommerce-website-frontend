import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ShopComponent } from './shop/shop.component';
import { ProductComponent } from './product/product.component';
import { FaqsComponent } from './faqs/faqs.component';
import { HelpComponent } from './help/help.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { WholesaleComponent } from './wholesale/wholesale.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { BrandProductsComponent } from './brand-products/brand-products.component';
import { OrderFailComponent } from './order-fail/order-fail.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SliderComponent } from './slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CartComponent,
    CheckoutComponent,
    ShopComponent,
    ProductComponent,
    FaqsComponent,
    HelpComponent,
    ContactComponent,
    AboutComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    MyAccountComponent,
    ChangePasswordComponent,
    MyOrdersComponent,
    SidebarComponent,
    ViewOrderComponent,
    WholesaleComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    CancellationPolicyComponent,
    OrderSuccessComponent,
    BrandProductsComponent,
    OrderFailComponent,
    MyWishlistComponent,
    SearchResultComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
