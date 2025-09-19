import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { ActivatedRoute,Router,Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  productData:any = [];
  productID:string = "";
  justArrived:any = [];
  currentRoute: string | undefined;
  breadcrumb:any;
  isLogin:any = false;
  is_wishlist:number = 0;
  quickViewProduct:any;
  selectedQty:number = 1;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { 
    this.currentRoute = "";
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        //console.log('Route change detected');
      }
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url; 
        const myArray = this.currentRoute.split("/"); 
        this.productID = myArray[2];   
        this.GetProduct();
      }
      if (event instanceof NavigationError) {
        //console.log(event.error);
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if(localStorage.getItem('u') == null){
      this.isLogin = false;
    }else{
      this.isLogin = true;
    }
    this.productID = this.route.snapshot.params['slug'];
    this.GetProduct();
  }
  updateQty(type:string){
    var qty = $('#qty_box').val();
    if(type == 'Plus'){
      var newQty = parseInt(qty)+1;
    }else{
      var newQty = parseInt(qty)-1;
      if(newQty <= 0){
        newQty = 1;
      }
    }
    $('#qty_box').val(newQty);
  }
  gotoBrandPage(slug:any){
    this.router.navigateByUrl('/brand/'+slug);
  }
  addToCart(id:number){
    $('#addTocartBtn').html('Processing...');
    var quantity = $('#qty_box').val();
    var temp_id = localStorage.getItem('tempUserID');
    const data = {product_id:id,quantity:quantity,temp_id:temp_id};
    this.appService.postData('set/cart',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        $('#addTocartBtn').html('<i class="fa-solid fa-cart-shopping"></i> Add to Cart');
        this.toastr.success('Product added to cart', 'Success');
      }else{
        this.toastr.error(r.message, 'Error');
      }
    },error =>{
      this.toastr.error('Internal server error', 'Error');
    });
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
  addToCartRelated(id:number,qty:number){
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
      }
    },error =>{
      //this.router.navigateByUrl('/login');
    });
  }
  buyNow(id:number){
    var quantity = 1;
    var temp_id = localStorage.getItem('tempUserID');
    const data = {product_id:id,quantity:quantity,temp_id:temp_id};
    this.appService.postData('set/cart',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.router.navigateByUrl('/checkout');
      }else{
      }
    },error =>{
      this.toastr.error('Internal server error', 'Error');
    });
  }
  setProductImage(index:any){
    $('.all_p_images').removeClass('active');
    $('#p_'+index).addClass('active');
  }
  addToWishList(type:any,pid:number){
    if(this.isLogin){
      const data = {p:pid,token:localStorage.getItem('u'),t:type};
      this.appService.postData('add/to/wishlist',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
          this.toastr.success(r.message, 'Success');
          this.is_wishlist = r.count;
          this.GetProduct();
      },error =>{
       // this.router.navigateByUrl('/login');
      });
    }else{
      this.toastr.error('Internal server error', 'Error');
    }
    
  }
  setQuickView(productData:any){
    this.quickViewProduct = productData;
    this.selectedQty = 1;
    $('#product-qty').val(1);
  }
  GetProduct(){
    window.scrollTo(0, 0);
    const data = {slug:this.productID,u:localStorage.getItem('u')};
    this.appService.login('get/product',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.productData = r.product;
        this.justArrived = r.related_products;
        this.breadcrumb = r.breadcrumb;
        this.is_wishlist = r.is_wishlist;

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
      }else{
      }
    },error =>{
    });
  }

}
