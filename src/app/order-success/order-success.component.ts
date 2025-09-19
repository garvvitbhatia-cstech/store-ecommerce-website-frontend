import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router,ActivatedRoute } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Title, Meta } from "@angular/platform-browser";

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  pageData:any;
  orderID:number = 0;
  orderData:any;
  orderItems:any;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title, private meta: Meta
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.GetData(10);
    this.orderID = this.route.snapshot.params['order_id'];
    this.GetOrder(this.orderID);
  }
  GetOrder(order_id:number){
    const data = {order_id:order_id};
    this.appService.postData('get/order',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.orderData = r.order;
        this.orderItems = r.items;
      }else{
      }
    },error =>{
      //this.router.navigateByUrl('/login');
    });
  }
  GetData(id:number){
    if(id > 0){
      const data = {id:id};
      this.appService.postData('get/cms',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
        this.pageData = r.data;
        this.title.setTitle(r.data.seo_title);
          this.meta.updateTag({
              name: 'description',
              content: r.data.seo_description
          });
          this.meta.updateTag({
            name: 'keywords',
            content: r.data.seo_keyword
        });
        }else{
        }
      },error =>{
      });
    }
  }

}
