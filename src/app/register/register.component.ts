import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {

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
        Swal.fire(
          'Success',
          r.message,
          'success'
        )
        //localStorage.setItem('token', r.token);
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
