import { Component, OnInit,OnDestroy   } from '@angular/core';
declare var $: any;
import { AppService } from '../app.service';
import { ActivatedRoute,Router } from '@angular/router';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  isLogin = false;
  menuCategories:any = [];
  cartCount:number = 0;

  constructor(
    private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    //this.checkLogin('Default');
    this.GetProfile();
  }
  GetProfile(){
    const data = {};
    this.appService.postData('get/profile',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
       $('#full_name').val(r.user_data.full_name);
       $('#email').val(r.user_data.email);
       $('#contact').val(r.user_data.contact);
       $('#address').val(r.user_data.address);
       $('#state').val(r.user_data.state);
       $('#city').val(r.user_data.city);
       $('#zipcode').val(r.user_data.zipcode);
      }else{
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
  updateProfile(){
    $('#profile_btn').html('Processing...');
    const data = {
      full_name:$('#full_name').val(),
      contact:$('#contact').val(),
      address:$('#address').val(),
      state:$('#state').val(),
      city:$('#city').val(),
      zipcode:$('#zipcode').val(),
      country:$('#country').val()
    };
    this.appService.postData('update/profile',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#profile_btn').html('Update');
      if(r.success){
        this.toastr.success('Profile updated successfully', 'Success');
        this.GetProfile();
      }else{
        this.toastr.error(r.message, 'Error');
      }
    },error =>{
    });
  }
  

}
