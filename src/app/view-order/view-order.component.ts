import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router,ActivatedRoute } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  order:any = [];
  orderID:any;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.orderID = this.route.snapshot.params['order_id'];
    this.GetOrder(this.orderID);
  }
  GetOrder(order_id:number){
    const data = {order_id:order_id};
    this.appService.postData('get/order',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.order = r;
      }else{
      }
    },error =>{
      //this.router.navigateByUrl('/login');
    });
  }

}
