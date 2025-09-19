import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { ActivatedRoute,Router,Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  products:any = [];
  productIds:any = [];
  sub_categories:any = [];
  categoryData:any;
  catID:any='';
  sub_cat_id:any = [];
  price_array:any = [];
  rating:any = [];
  discount:any = [];
  offer:any = [];
  currentRoute: string | undefined;
  page:number=1;
  lastpage:number=0;
  loadMoreBtn=false;
  loader=false;
  SortBy:any;
  keywords:any;
  quickViewProduct:any;
  selectedQty:number = 1;
  isLogin=false;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { 
     this.currentRoute = "";
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        //this.sub_cat_id = [];
        this.productIds = [];   
        this.products = [];
        this.page = 1;
      }
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url; 
        const myArray = this.currentRoute.split("/"); 
        console.log(myArray[2]);
        this.keywords = myArray[2]; 
        this.products = [];
    this.productIds = [];     
        this.GetProducts();
      }
      if (event instanceof NavigationError) {
        
      }
    }); 
  
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.keywords = this.route.snapshot.params['keywords'];
    this.GetProducts();
    $('#search_box').val(this.keywords);
  }
  setQuickView(productData:any){
    this.quickViewProduct = productData;
    this.selectedQty = 1;
    $('#product-qty').val(1);
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
  addToWishList(type:any,product_id:number){
    if(this.isLogin){
      const data = {p:product_id,token:localStorage.getItem('u'),t:type};
      this.appService.postData('add/to/wishlist',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
          this.toastr.success(r.message, 'Success');
          this.GetProducts();
          //this.is_wishlist = r.count;
      },error =>{
       // this.router.navigateByUrl('/login');
      });
    }else{
      this.router.navigateByUrl('/login');
    }
    
  }
  addToCart(id:number,qty:number){
    if(qty == 0){
      $('#addTocartBtnPopUp').html('Processing...');
      qty = this.selectedQty;
    }
    var temp_id = localStorage.getItem('tempUserID');
    const data = {product_id:id,quantity:qty,temp_id:temp_id};
    this.appService.postData('set/cart',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.toastr.success('Product added to cart', 'Success');
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
  showHide(div_id:any){
    $('#'+div_id).toggle();
  }
  ShortData(id:any){
    $('.mrr-1').removeClass('sort-active');
    $('#'+id).addClass('sort-active');
    this.SortBy = id;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
  }
  filterByOffer(event:any,offer:any){
    this.loader = true;
    if(event.target.checked){
        this.offer.push(offer);
    }else{
      const index = this.offer.indexOf(offer);
      if (index > -1) { // only splice array when item is found
        this.offer.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.loadMoreBtn = false;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
  }
  filterByDiscount(event:any,discount:any){
    this.loader = true;
    if(event.target.checked){
        this.discount.push(discount);
    }else{
      const index = this.discount.indexOf(discount);
      if (index > -1) { // only splice array when item is found
        this.discount.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.loadMoreBtn = false;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
  }
  filterByPrice(event:any,price:any){
    this.loader = true;
    if(event.target.checked){
        this.price_array.push(price);
    }else{
      const index = this.price_array.indexOf(price);
      if (index > -1) { // only splice array when item is found
        this.price_array.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.loadMoreBtn = false;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
  }
  filterByRating(event:any,rating:any){
    this.loader = true;
    if(event.target.checked){
        this.rating.push(rating);
    }else{
      const index = this.rating.indexOf(rating);
      if (index > -1) { // only splice array when item is found
        this.rating.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.loadMoreBtn = false;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
  }
  filterBySubcategory(event:any,subCatID:number){
    this.loader = true;
    if(event.target.checked){
        this.sub_cat_id.push(subCatID);
    }else{
      const index = this.sub_cat_id.indexOf(subCatID);
      if (index > -1) { // only splice array when item is found
        this.sub_cat_id.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.loadMoreBtn = false;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
  }
  loadMore(){
    this.page = this.page+1;
    this.GetProducts();
  }
  
  GetProducts(){
    this.loader = true;
    const data = {page:this.page,keywords:this.keywords};
    this.appService.login('get/search-products',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        for (let item of r.products.data){
          if(!this.productIds.includes(item.id)){
            this.productIds.push(item.id);
            this.products.push(item);
          }
        }
        this.page = r.products.current_page;
        this.lastpage = r.products.last_page;
        this.categoryData = r.category_data;
        this.loadMoreBtn = true;
        this.loader = false;
      }else{
      }
    },error =>{
    });
  }

}


