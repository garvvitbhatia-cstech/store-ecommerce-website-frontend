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
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit,OnDestroy {

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
    
  }
  setPassword(){
    $('#order_btn').html('Processing...');
    const data = {
      current_password:$('#current_password').val(),
      new_password:$('#new_password').val(),
      confirm_password:$('#confirm_password').val()
    };
    this.appService.postData('update/password',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#order_btn').html('Update');
      if(r.success){
        this.toaster.success('Success', 'Password updated successfully');
      }else{
        this.toaster.error(r.message, 'Error');
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

