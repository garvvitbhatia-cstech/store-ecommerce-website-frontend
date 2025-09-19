import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  siteData:any = '';

  constructor(
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService,
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getSiteData();
  }
  saveNewsletter(){
    $('#subsBtn').html('Processing...');
    const data = {name:$('#news_name').val(),email:$('#news_email').val()};
    this.appService.login('set/newsletter',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#subsBtn').html('Subscribe Now');
      if(r.success){
        $('#news_name').val('');
        $('#news_email').val('');
        Swal.fire(
          'Success',
          r.message,
          'success'
        )
      }else{
        Swal.fire(
          'Error',
          r.message,
          'error'
        )
      }
    },error =>{
    });
  }
  saveHomeNewsletter(){
    $('#homeSubBtn').html('Processing...');
    const data = {email:$('#home_news_email').val()};
    this.appService.login('set/newsletter',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#homeSubBtn').html('Subscribe');
      if(r.success){
        $('#home_news_email').val('');
        Swal.fire(
          'Success',
          r.message,
          'success'
        )
      }else{
        Swal.fire(
          'Error',
          r.message,
          'error'
        )
      }
    },error =>{
    });
  }
  RegisterNow(){
    const data = {
      name: $('#name').val(),
      email: $('#email').val(),
      contact: $('#contact').val(),
      password: $('#password').val()
    };
    $('#registerNow').html('Processing...');
    this.appService.login('customer/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#registerNow').html('Register Now');
      if(r.success){
        localStorage.setItem('token', r.token);
        localStorage.setItem('user_name', r.details.full_name);
        localStorage.setItem('user_email', r.details.email);
        localStorage.setItem('user_contact', r.details.contact);
        localStorage.setItem('u', r.details.id);
        window.location.reload();
      }else{
        
        this.toastr.error(r.message,"Error");
      }
    },error =>{
      this.toastr.error('Internal error occur',"Error");
    });
  }
  LoginNow(){
    const data = {
      username: $('#username').val(),
      password: $('#password').val()
    };
    $('#loginBtn').html('Processing...');
    this.appService.login('customer/login',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#loginBtn').html('Login');
      if(r.success){
        localStorage.setItem('token', r.token);
        localStorage.setItem('user_name', r.details.full_name);
        localStorage.setItem('user_email', r.details.email);
        localStorage.setItem('user_contact', r.details.contact);
        localStorage.setItem('u', r.details.id);
        window.location.reload();
      }else{
        
        this.toastr.error(r.message,"Error");
      }
    },error =>{
      //this.toastr.error('Internal error occur',"Error");
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

}
