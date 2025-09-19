import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Title, Meta } from "@angular/platform-browser";

@Component({
  selector: 'app-order-fail',
  templateUrl: './order-fail.component.html',
  styleUrls: ['./order-fail.component.css']
})
export class OrderFailComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  pageData:any;

  constructor(
    private appService: AppService,
    private router: Router,
    private title: Title, private meta: Meta
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.GetData(11);
    
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

