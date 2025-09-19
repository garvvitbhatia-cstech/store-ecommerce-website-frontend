import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy  {

  destroy$ = new Subject();

  constructor(
    private appService: AppService,
    private router: Router,
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
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
        this.router.navigateByUrl('');
        console.log(r);
      }else{
        Swal.fire(
          'Error',
          r.message,
          'error'
        )
        //this.toastr.error(r.message,"Error");
      }
    },error =>{
      //this.toastr.error('Internal error occur',"Error");
    });
  }

}
