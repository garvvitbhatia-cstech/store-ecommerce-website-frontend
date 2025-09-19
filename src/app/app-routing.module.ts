import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
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
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { WholesaleComponent } from './wholesale/wholesale.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { BrandProductsComponent } from './brand-products/brand-products.component';
import { OrderFailComponent } from './order-fail/order-fail.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';
import { SearchResultComponent } from './search-result/search-result.component';

const routes: Routes = [
  {
    path:'',component:HomeComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'register',component:RegisterComponent
  },
  {
    path:'cart',component:CartComponent
  },
  {
    path:'checkout',component:CheckoutComponent
  },
  {
    path:'shop/:category',component:ShopComponent
  },
  {
    path:'shop/:category/:subcategory',component:ShopComponent
  },
  {
    path:'shop/:category/:subcategory/:subsubcategory',component:ShopComponent
  },
  {
    path:'brand/:slug',component:BrandProductsComponent
  },
  {
    path:'product/:slug',component:ProductComponent
  },
  {
    path:'faqs',component:FaqsComponent
  },
  {
    path:'help',component:HelpComponent
  },
  {
    path:'contact-us',component:ContactComponent
  },
  {
    path:'about-us',component:AboutComponent
  },
  {
    path:'dashboard',component:DashboardComponent
  },
  {
    path:'settings',component:ChangePasswordComponent
  },
  {
    path:'my-account',component:MyAccountComponent
  },
  {
    path:'my-orders',component:MyOrdersComponent
  },
  {
    path:'my-wishlist',component:MyWishlistComponent
  },
  {
    path:'view-order/:order_id',component:ViewOrderComponent
  },
  {
    path:'wholesale',component:WholesaleComponent
  },
  {
    path:'terms-and-conditions',component:TermsAndConditionsComponent
  },
  {
    path:'privacy-policy',component:PrivacyPolicyComponent
  },
  {
    path:'refund-policy',component:RefundPolicyComponent
  },
  {
    path:'cancellation-policy',component:CancellationPolicyComponent
  },
  {
    path:'order-success/:order_id',component:OrderSuccessComponent
  },
  {
    path:'order-failed',component:OrderFailComponent
  },
  {
    path:'search-result/:keywords',component:SearchResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
