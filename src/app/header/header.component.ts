import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { ActivatedRoute,Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import 'owl.carousel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  isLogin = false;
  menuCategories:any = [];
  cartCount:number = 0;
  randomAlphanumeric:any ='';
  currentUrl:any;
  Offers:any;
  AlphaNumeric:any ='abcdefghijklmnopqrstuvwxyz0123456789';
  username = localStorage.getItem('user_name');

  constructor(
    private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
    
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    
    //this.checkLogin('Default');
    this.GetTopOffers();
    this.GenerateTempID();
    this.GetCategories();
    this.GetCartCount();
    if(localStorage.getItem('token') == null){
      this.isLogin = false;
    }else{
      this.isLogin = true;
    }
  }
  GetTopOffers(){
    const data = {};
    this.appService.login('get/top/offers',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.Offers = r.offers;
        /* setTimeout(() => {
          $('.top-stip-offer').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            autoplay: true,
            dots:false,
            responsive: {
                0: {
                    items: 1
                }
             }
        });
        }, 1000); */
        
      }else{
      }
    },error =>{
    });
  }
  searchNow(){
    var keywords = $('#search_box').val();
    if(keywords != ""){
      this.router.navigateByUrl('/search-result/'+keywords);
    }else{
      $('#search_box').focus();
    }
  }
  GenerateTempID(){
    if(!localStorage.getItem('tempUserID')){
      this.randomAlphanumeric = '';
      for(var i = 0; i < 11;i++){
        this.randomAlphanumeric += this.AlphaNumeric.charAt(Math.floor(Math.random()*this.AlphaNumeric.length))
      }
      localStorage.setItem('tempUserID',this.randomAlphanumeric);
    }
  }
  GetCartCount(){
    var temp_id = localStorage.getItem('tempUserID');
    const data = {temp_id:temp_id};
    this.appService.postData('cart/count',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.cartCount = r.cart_count;
      }else{
      }
    },error =>{
    });
  }
  gotoCatPage(slug:any){
    this.router.navigateByUrl('/shop/'+slug);
  }
  GetCategories(){
    const data = {is_header_menu:1};
    this.appService.login('get/categories',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.menuCategories = r.categories;
      }else{
      }
    },error =>{
    });
  }
  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_contact");
    localStorage.removeItem("u");
    this.isLogin = false;
    this.router.navigateByUrl('/');
  }
  
  checkLogin(type:string){
    this.router.navigateByUrl('/cart');
    /* const data = {};
    this.appService.putData('check/login',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.isLogin = true;
        if(type == 'cart'){
          this.router.navigateByUrl('/cart');
        }
      }else{
        if(type != 'Default'){
          this.isLogin = false;
          this.router.navigateByUrl('/login');
        }
      }
    },error =>{
      if(type != 'Default'){
        this.isLogin = false;
        this.router.navigateByUrl('/login');
      }
    }); */
  }

}
