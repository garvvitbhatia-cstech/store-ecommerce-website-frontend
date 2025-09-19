import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Title, Meta } from "@angular/platform-browser";
import { ToastrService } from 'ngx-toastr';
import 'owl.carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  trandyProducts:any = [];
  justArrived:any = [];
  HomeCategories:any = [];
  HomeBanners:any = [];
  Brands:any = [];
  isLogin = false;
  quickViewProduct:any;
  selectedQty:number = 1;
  homepageAds:any;

  constructor(
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService,
    private title: Title, private meta: Meta
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if(localStorage.getItem('u') == null){
      this.isLogin = false;
    }else{
      this.isLogin = true;
    }
    this.GetHomePageAds();
    this.GetCategories();
    this.title.setTitle("Anupam Stores Unlimited");
    this.meta.updateTag({
        name: 'description',
        content: 'Anupam Stores Unlimited'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'Anupam Stores Unlimited'
  });

  }
  GetHomePageAds(){
    const data = {};
    this.appService.login('get/ads',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.homepageAds = r.data;
      }else{
      }
    },error =>{
    });
  }
  setQuickView(productData:any){
    this.quickViewProduct = productData;
    this.selectedQty = 1;
    $('#product-qty').val(1);
  }
  gotoBrandPage(slug:any){
    this.router.navigateByUrl('/brand/'+slug);
  }
  qtyIncrement(type:any){
    var qty = $('#product-qty').val();
    if(type == 'Minus'){
      var newQty = parseInt(qty)-1;
      if(newQty > 0){
        this.selectedQty = newQty;
        $('#product-qty').val(newQty);
      }else{
        this.selectedQty = 1;
        $('#product-qty').val(1);
      }
      
    }else{
      var newQty = parseInt(qty)+1;
      this.selectedQty = newQty;
      $('#product-qty').val(newQty);
    }
  }
  addToCart(id:number,qty:number){
    if(qty == 0){
      $('#addTocartBtnPopUp').html('Processing...');
      qty = this.selectedQty;
    }
    const data = {product_id:id,quantity:qty,temp_id:localStorage.getItem('tempUserID')};
    this.appService.postData('set/cart',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        $('#addTocartBtnPopUp').html('<i class="fa-solid fa-cart-shopping"></i> Add to Cart');
        $('#quick-view-close').trigger('click');
        this.router.navigateByUrl('/cart');
      }else{
        this.toastr.error(r.message, 'Error');
      }
    },error =>{
      //this.router.navigateByUrl('/login');
    });
  }
  addToWishList(type:any,product_id:number){
    if(this.isLogin){
      const data = {p:product_id,token:localStorage.getItem('u'),t:type};
      this.appService.postData('add/to/wishlist',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
          this.toastr.success(r.message, 'Success');
          //this.GetFeaturedProducts();
          //this.GetTrandyProducts();
      },error =>{
       // this.router.navigateByUrl('/login');
      });
    }else{
      this.router.navigateByUrl('/login');
    }
    
  }
  GetFeaturedProducts(){
    const data = {token:localStorage.getItem('u')};
    this.appService.login('get/feature-products',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.justArrived = r.products;
      }else{
      }
    },error =>{
    });
  }
  GetTrandyProducts(){
    const data = {token:localStorage.getItem('u')};
    this.appService.login('get/trendy-products',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.trandyProducts = r.products;
        setTimeout(() => {
          $('.product-slider').owlCarousel({
            loop: false,
            margin: 0,
            nav: true,
            autoplay: false,
            dots:false,
            responsive: {
                0: {
                    items: 1.1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                },
                1200: {
                    items: 4
                }
            }
        });
        }, 1000);
        
        this.GetFeaturedProducts();
      }else{
      }
    },error =>{
    });
  }
  
  GetCategories(){
    const data = {};
    this.appService.login('get/categories',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.HomeCategories = r.categories;

         setTimeout(() => {
          $('.cat-carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            dots:false,
            autoplay: true,
            responsive: {
                0: {
                    nav: false,
                    items:2.8
                },
                
                600: {
                    nav: false,
                    items: 4
                },
                1000: {
                    items: 6
                }
            }
        });
        }, 1000); 

        


        this.GetBrands();
      }else{
      }
    },error =>{
    });
  }
  GetBrands(){
    const data = {};
    this.appService.login('get/brands',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.Brands = r.brands;
        setTimeout(() => {
          $('.brand-category-icon').owlCarousel({
            loop: true,
            margin: 20,
            nav: true,
            dots:false,
            slideTransition: 'linear',
            autoplayTimeout: 2000,
            autoplaySpeed: 3000,
            items:3,
            autoplay: true,
            responsive: {
                0: {
                    items:3
                },
                600: {
                    items: 4
                },
                
            }
        });
        }, 1000);
        
        this.GetTrandyProducts();
      }else{
      }
    },error =>{
    });
  }
  

}
