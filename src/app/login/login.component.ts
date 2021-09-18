import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private uService: UserService, private router:Router) { }
  loginForm: FormGroup;
  ngOnInit(): void {
    this.loginForm = this.initForm;
  }

  get initForm() {
    return this.fb.group({
      'email': ['developer@admin.com', Validators.required],
      'password': ['123456', Validators.required]
    });
  }

  login() {
    this.uService.logIn(this.loginForm.getRawValue()).toPromise().then((v:any) => {
      console.log(v)
      localStorage.setItem('token', v.data.access_token)
    }).then(v => {
      this.router.navigate(['dashboard'])
    })
  }
}
