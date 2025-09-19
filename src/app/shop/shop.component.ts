import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { ActivatedRoute,Router,Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  products:any = [];
  productIds:any = [];
  sub_categories:any = [];
  categoryData:any;
  catID:any='';
  subcatID:any='';
  subsubcatID:any='';
  sub_cat_id:any = [];
  brand_id:any = [];
  discount:any = [];
  capacity_id:any = [];
  rating:any = [];
  offer:any=[];
  price_array:any = [];
  currentRoute: string | undefined;
  page:number=1;
  lastpage:number=0;
  loadMoreBtn=false;
  isLogin=false;
  loader=false;
  subCatFilterDiv=true;
  breadcrumb:any;
  Brands:any;
  Capacities:any;
  SortBy:any;
  pageFrom:number = 0;
  pageTo:number = 0;
  pageTotal:number = 0;
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
        this.sub_cat_id = [];
        this.products = [];
        this.page = 1;
        //console.log('Route change detected');
      }
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url; 
        const myArray = this.currentRoute.split("/"); 
        this.catID = myArray[2];   
        this.subcatID = myArray[3];   
        if(typeof myArray[4] && myArray[4] != undefined){
          this.subsubcatID = myArray[4]; 
          this.subCatFilterDiv = false;
        }   
        this.GetBrands();
        this.GetCapacities();
        this.GetProducts();
        this.GetSubcategories();
        this.sub_cat_id = [];
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
    this.catID = this.route.snapshot.params['category'];
    this.subcatID = this.route.snapshot.params['subcategory'];
    this.subsubcatID = this.route.snapshot.params['subsubcategory'];
    this.GetProducts();
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
  showHide(div_id:any){
    $('#'+div_id).toggle();
  }
  GetCapacities(){
    const data = {
      cat:this.catID
    };
    this.appService.login('get/capacity/by/category',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.Capacities = r.capacities;
      }else{
      }
    },error =>{
    });
  }
  GetBrands(){
    const data = {
      cat:this.catID
    };
    this.appService.login('get/brands/by/category',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.Brands = r.brands;
      }else{
      }
    },error =>{
    });
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
  filterByBrand(event:any,bID:number){
    this.loader = true;
    if(event.target.checked){
        this.brand_id.push(bID);
    }else{
      const index = this.brand_id.indexOf(bID);
      if (index > -1) { // only splice array when item is found
        this.brand_id.splice(index, 1); // 2nd parameter means remove one item only
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
  filterByCapacity(event:any,capacity:any){
    this.loader = true;
    if(event.target.checked){
        this.capacity_id.push(capacity);
    }else{
      const index = this.capacity_id.indexOf(capacity);
      if (index > -1) { // only splice array when item is found
        this.capacity_id.splice(index, 1); // 2nd parameter means remove one item only
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
  loadMore(){
    this.page = this.page+1;
    this.GetProducts();
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
  ShortData(id:any){
    $('.mrr-1').removeClass('sort-active');
    $('#'+id).addClass('sort-active');
    this.SortBy = id;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
  }
  GetProducts(){
    this.loader = true;
    const data = {
                    page:this.page,
                    slug:this.catID,
                    slug2:this.subcatID,
                    slug3:this.subsubcatID,
                    sub_cat_id:this.sub_cat_id,
                    brand_id:this.brand_id,
                    discount:this.discount,
                    capacity_id:this.capacity_id,
                    rating:this.rating,
                    offer:this.offer,
                    price_array:this.price_array,
                    sort_by:this.SortBy,
                    token:localStorage.getItem('u')
                  };
    this.appService.login('get/category-products',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.breadcrumb = r.breadcrumb;
      //this.products = [];
      //this.productIds = [];
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
        this.pageFrom = r.products.from;
        this.pageTo= r.products.to;
        this.pageTotal = r.products.total
        
      }else{
      }
    },error =>{
    });
  }
  GetSubcategories(){
    if(typeof(this.subcatID) != 'undefined'){
      const data = {slug:this.subcatID};
      this.appService.login('get/sub-categories',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
          this.sub_categories = r.sub_categories;
        }else{
        }
      },error =>{
      });
    }else{
      const data = {slug:this.catID};
      this.appService.login('get/sub-categories',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
          this.sub_categories = r.sub_categories;
        }else{
        }
      },error =>{
      });
    }
    
    
  }

}
