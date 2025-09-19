import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { ActivatedRoute,Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Title, Meta } from "@angular/platform-browser";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wholesale',
  templateUrl: './wholesale.component.html',
  styleUrls: ['./wholesale.component.css']
})
export class WholesaleComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  products:any = [];
  productIds:any=[];
  product_id:any = [];
  category_id:any = [];
  menuCategories:any = [];
  catID:any='';
  popupBg=false;
  page:number=1;
  lastpage:number=0;
  loadMoreBtn=false;
  loader=false;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title, private meta: Meta,
    private toastr: ToastrService
  ) { 
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
   // this.catID = this.route.snapshot.params['slug'];
    this.GetProducts();
    this.GetCategories();

    this.title.setTitle("Anupam Stores Unlimited | Wholesale");
    this.meta.updateTag({
        name: 'description',
        content: 'Anupam Stores Unlimited'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'Anupam Stores Unlimited'
  });
  }
  SendEnquiry(){
    $('#sendMessageButton').html('Processing...');
    const data = {name:$('#name').val(),email:$('#email').val(),message:$('#message').val(),phone:$('#phone').val(),type:'BulkEnquiry',product_id:this.product_id};
      this.appService.postData('save/contact',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        $('#sendMessageButton').html('Submit');
        var r:any=res;
        if(r.success){
          this.toastr.success(r.message, 'Success');
          $('#name').val('');
          $('#email').val('');
          $('#message').val('');
          $('#phone').val('');
        }else{
          this.toastr.error(r.message, 'Error');
        }
      },error =>{
        this.toastr.error('Internal Server Error', 'Error');
      });
    
  }
  filterBycategory(event:any,pID:number){
    this.loader = true;
    if(event.target.checked){
        this.category_id.push(pID);
    }else{
      const index = this.category_id.indexOf(pID);
      if (index > -1) { // only splice array when item is found
        this.category_id.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.loadMoreBtn=false;
    this.products = [];
    this.productIds = [];
    this.page = 1;
    this.GetProducts();
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
  selectImage(pID:number){
    //$('#p_id_'+pID).attr('checked',true);
  }
  selectProduct(event:any,pID:number){
    if(event.target.checked){
        this.product_id.push(pID);
    }else{
      const index = this.product_id.indexOf(pID);
      if (index > -1) { // only splice array when item is found
        this.product_id.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  }
  submitEnquiry(){
    $('#viewInvoicePopUp').addClass('in');
    $('#viewInvoicePopUp').css('display','block');
    this.popupBg = true;
  }
  closePopup(){
    $('#viewInvoicePopUp').removeClass('in');
    $('#viewInvoicePopUp').css('display','none');
    this.popupBg = false;
  }
  loadMore(){
    this.page = this.page+1;
    this.GetProducts();
  }
  GetProducts(){
    this.loader = true;
    const data = {category_id:this.category_id,product_name:$('#product_name').val()};
    this.appService.login('get/wholesale-products',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
        this.loadMoreBtn=true;
        this.loader = false;
      }else{
      }
    },error =>{
    });
  }

}
