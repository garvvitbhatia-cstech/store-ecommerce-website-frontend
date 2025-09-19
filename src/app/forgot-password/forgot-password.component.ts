import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,OnDestroy {

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
        this.router.navigateByUrl('');
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
