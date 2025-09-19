import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  cartItems:any = [];

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
      this.appService.postData('remove/cart',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
          this.toastr.success('Item deleted successfully', 'Success');
         this.GetCartItems();
        }else{
        }
      },error =>{
      });
    }
  }
  updateQty(id:number){
    var qty = $('#qty_'+id).val();
    var temp_id = localStorage.getItem('tempUserID');
    if(qty > 0){
      
      const data = {id:id,qty:qty,temp_id:temp_id};
      this.appService.postData('cart/update',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
          this.toastr.success('Quantity updated successfully', 'Success');
         this.GetCartItems();
        }else{
        }
      },error =>{
      });
    }
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
  
  
}
