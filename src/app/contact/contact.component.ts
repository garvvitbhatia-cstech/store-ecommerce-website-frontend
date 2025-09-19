import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Title, Meta } from "@angular/platform-browser";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  siteData:any = '';
  pageData:any;

  constructor(
    private appService: AppService,
    private router: Router,
    private title: Title, private meta: Meta,
    private toaster: ToastrService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getSiteData();
    this.GetData(1);
  }
  SendEnquiry(){
    $('#sendMessageButton').html('Processing...');
    const data = {name:$('#name').val(),email:$('#email').val(),subject:$('#subject').val(),message:$('#message').val(),phone:$('#phone').val(),type:'ContactUs',product_id:''};
      this.appService.postData('save/contact',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        $('#sendMessageButton').html('Send Message');
        var r:any=res;
        if(r.success){
          this.toaster.success(r.message, 'Success');
          $('#name').val('');
          $('#email').val('');
          $('#subject').val('');
          $('#message').val('');
          $('#phone').val('');
        }else{
          this.toaster.error(r.message, 'Error');
        }
      },error =>{
        this.toaster.error('Internal Server Error', 'Error');
      });
    
  }
  getSiteData(){
    const data = {id:1};
    this.appService.login('get/settings',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.siteData = r.data;
      }else{
      }
    },error =>{
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
