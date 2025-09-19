import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.css']
})
export class MyWishlistComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  orders:any = [];

  constructor(
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.GetOrders();
  }
  removeRow(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.deleteRow(id);
        Swal.fire(
          'Removed!',
          'Item removed successfully.',
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
  deleteRow(id:number){
    if(id > 0){
      var temp_id = localStorage.getItem('tempUserID');
      const data = {id:id,temp_id:temp_id};
      this.appService.postData('wishlist/delete',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
          this.toastr.success('Item deleted successfully', 'Success');
         this.GetOrders();
        }else{
        }
      },error =>{
      });
    }
  }
  moveToCart(p_id:number){
    var quantity = 1;
    var temp_id = localStorage.getItem('tempUserID');
    const data = {product_id:p_id,quantity:quantity,temp_id:temp_id};
    this.appService.postData('set/cart',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.toastr.success('Product added to cart', 'Success');
        this.router.navigateByUrl('/cart');
      }else{
      }
    },error =>{
      this.toastr.error('Internal server error', 'Error');
    });
  }
  GetOrders(){
    const data = {};
    this.appService.postData('wishlist/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.orders = r.items;
      }else{
      }
    },error =>{
      localStorage.removeItem("token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_contact");
      localStorage.removeItem("u");
      this.router.navigateByUrl('/');
    });
  }

}
