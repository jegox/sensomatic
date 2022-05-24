import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private uService: UserService, private router: Router, private dialog: MatDialog) { }
  @ViewChild('forgot') modal;
  loginForm: FormGroup;
  reset: FormControl = new FormControl();

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
      localStorage.setItem('role', v.data.user.role);
      localStorage.setItem('token', v.data.access_token);
    }).then(v => {
      this.router.navigate(['/app/dashboard'])
    }).catch(({ error }) => {
      Swal.fire('Error', error.message, 'error')
    })
  }

  resetPassword() {
    this.dialog.open(this.modal, {
      width: '300px'
    })
  }

  async sendMailReset() {
    try {
      let mail = this.reset.value;

      await this.uService.sendMail({ email: mail }).toPromise();

      Swal.fire('Correo Enviado', '', 'success');
      this.dialog.closeAll();
      this.reset.reset();
    } catch (e) {
      Swal.fire("Error", e.error.message, 'error')
    }
  }

  closeModal() {
    this.dialog.closeAll()
  }
}
