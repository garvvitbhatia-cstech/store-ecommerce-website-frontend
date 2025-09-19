import { Component, OnInit,OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  HomeBanners:any = [];
  constructor(private appService: AppService,) { }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  ngOnInit(): void {
    setTimeout(() => {
     this.GetBanners();
    }, 3000);
  }
  GetBanners(){
    const data = {};
    this.appService.login('get/banners',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.HomeBanners = r.banners;
        $('#temp_banner').remove();
      }else{
      }
    },error =>{
    });
  }

}
