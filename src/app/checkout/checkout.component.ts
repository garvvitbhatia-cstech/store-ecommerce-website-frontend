import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  cartItems:any = [];
  paymentMethod = 'Online';
  discounts:any = [];
value: any;

  constructor(
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.GetCartItems();
    //this.GetProfile();
    this.getAppliedCoupons();
  }
  selectPaymentMethod(type:any){
    this.paymentMethod = type;
  }
  getAppliedCoupons(){
    var temp_id = localStorage.getItem('tempUserID');
    const data = {temp_id:temp_id};
    this.appService.postData('discount/list/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.discounts = r.discounts;
      }else{
        this.toastr.error(r.message, 'Error');
      }
    },error =>{
    });
  }
  applyCoupon(){
    var temp_id = localStorage.getItem('tempUserID');
    var coupon_code = $('#coupon_code').val();
    const data = {temp_id:temp_id,coupon_code:coupon_code};
    this.appService.postData('apply/coupon',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.toastr.success(r.message, 'Success');
        $('#coupon_code').val('');
        this.getAppliedCoupons();
        this.GetCartItems();
      }else{
        this.toastr.error(r.message, 'Error');
      }
    },error =>{
    });
  }
  GetCartItems(){
    var temp_id = localStorage.getItem('tempUserID');
    const data = {temp_id:temp_id};
    this.appService.postData('get/cart/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.cartItems = r;
      }else{
      }
    },error =>{
    });
  }
  removeCoupon(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.deleteCoupon(id);
        Swal.fire(
          'Removed!',
          'Coupon removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Carrier still in our database.',
        'error'
      )
      }
      })
  }
  deleteCoupon(id:number){
    if(id > 0){
      var temp_id = localStorage.getItem('tempUserID');
      const data = {id:id,temp_id:temp_id};
      this.appService.postData('remove/coupon',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
          this.toastr.success('Coupon removed', 'Success');
          this.getAppliedCoupons();
         this.GetCartItems();
        }else{
        }
      },error =>{
      });
    }
  }
  GetProfile(){
    const data = {};
    this.appService.postData('get/profile',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
       //$('#full_name').val(r.user_data.full_name);
       $('#s_email').val(r.user_data.email);
       $('#s_mobile').val(r.user_data.contact);
       $('#s_address').val(r.user_data.address);
       $('#s_state').val(r.user_data.state);
       $('#s_city').val(r.user_data.city);
       $('#s_zipcode').val(r.user_data.zipcode);
      }else{
      }
    },error =>{
    });
  }
  chooseReceivable(event:any) {
      if(event.target.checked){
        $('#s_first_name').val($('#b_first_name').val());
        $('#s_last_name').val($('#b_last_name').val());
        $('#s_email').val($('#b_email').val());
        $('#s_mobile').val($('#b_mobile').val());
        $('#s_address').val($('#b_address').val());
        $('#s_country').val($('#b_country').val());
        $('#s_state').val($('#b_state').val());
        $('#s_city').val($('#b_city').val());
        $('#s_zipcode').val($('#b_zipcode').val());
      }else{
        $('#s_first_name').val('');
        $('#s_last_name').val('');
        $('#s_email').val('');
        $('#s_mobile').val('');
        $('#s_address').val('');
        $('#s_country').val('');
        $('#s_state').val('');
        $('#s_city').val('');
        $('#s_zipcode').val('');
      }
  }
  checkBillingZipcode(){
      const data = {
        zipcode:$('#b_zipcode').val()
      }
      this.appService.postData('check/zipcode',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.count == 0){
          Swal.fire(
            'Error',
            'Invalid Billing Zipcode '+ $('#b_zipcode').val(),
            'warning'
          )
          $('#b_zipcode').val('');
        }
      },error =>{
      });
  }
  checkShippingZipcode(){
    const data = {
      zipcode:$('#s_zipcode').val()
    }
    this.appService.postData('check/zipcode',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.count == 0){
        Swal.fire(
          'Error',
          'Invalid Shipping Zipcode '+ $('#s_zipcode').val(),
          'warning'
        )
        $('#s_zipcode').val('');
      }
    },error =>{
    });
}
  PlaceOrder(){
    $('#order_btn').html('Processing...');
    var temp_id = localStorage.getItem('tempUserID');
    const data = {
      b_first_name:$('#b_first_name').val(),
      b_last_name:$('#b_last_name').val(),
      b_email:$('#b_email').val(),
      b_mobile:$('#b_mobile').val(),
      b_address:$('#b_address').val(),
      b_country:$('#b_country').val(),
      b_state:'Rajasthan',
      b_city:'Jaipur',
      b_zipcode:$('#b_zipcode').val(),
      s_first_name:$('#s_first_name').val(),
      s_last_name:$('#s_last_name').val(),
      s_email:$('#s_email').val(),
      s_mobile:$('#s_mobile').val(),
      s_address:$('#s_address').val(),
      s_country:$('#s_country').val(),
      s_state:'Rajasthan',
      s_city:'Jaipur',
      s_zipcode:$('#s_zipcode').val(),
      temp_id:temp_id,
      payment_method:this.paymentMethod
      
    };
    this.appService.postData('place/order',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#order_btn').html('Place Order');
      if(r.success){
        if(this.paymentMethod == 'Online'){
          window.location.href='https://anupamstores.com/payment/secure-payment.php?o_id='+r.order_id;
        }else{
          this.router.navigateByUrl('/order-success/'+r.order_id);
        }
        
        /* Swal.fire(
          'Success',
          r.message,
          'success'
        )
        this.router.navigateByUrl('/order-success'); */
      }else{
        Swal.fire(
          'Error',
          r.message,
          'warning'
        )
      }
    },error =>{
    });
  }

}
