import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private uService: UserService, private router: Router) { }
  loginForm: FormGroup;
  ngOnInit(): void {
    this.loginForm = this.initForm;
  }
//developer@admin.com'
//12345
  get initForm() {
    return this.fb.group({
      'email': [, Validators.required],
      'password': [, Validators.required]
    });
  }

  login() {
    this.uService.logIn(this.loginForm.getRawValue()).toPromise().then((v: any) => {
      localStorage.setItem('user', JSON.stringify(v.data.user));
      localStorage.setItem('token', v.data.access_token);
    }).then(v => {
      this.router.navigate(['/app/dashboard'])
    }).catch(({ error }) => {
      Swal.fire('Error', error.message, 'error')
    })
  }
}
