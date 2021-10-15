import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild("manageUsers", { static: true }) listUsers: TemplateRef<any>
  @ViewChild("createUser", { static: true }) createUser: TemplateRef<any>
  machines;
  users;
  user: string = JSON.parse(localStorage.getItem('user')).fullname;
  hide = true;
  variables = new FormControl()
  oldPass = new FormControl();
  newPass = new FormControl();
  constructor(private dialog: MatDialog, private fb: FormBuilder,
    private route: Router, private uServices: UserService) { }

  ngOnInit(): void { }

  logOut() {
    localStorage.clear();
    this.route.navigate(['/']);
  }

  openChangePassword(template) {
    let modal = this.dialog.open(template);
  }

  async updatePassword() {
    let obj = {
      oldPass: this.oldPass.value,
      newPass: this.newPass.value
    }
    try {
      let res = await this.uServices.changePassword(obj).toPromise();
      Swal.fire('Contraseña actualizada', 'Su contraseña ha sido reemplazada con exito', 'success')
    } catch (e) {
      console.error(e)
    }
  }

  async getUser(template) {
    let id = JSON.parse(localStorage.user)._id;

    try {
      let res = await this.uServices.getUser(id).toPromise();
      let modal = this.dialog.open(template, {
        data: res['data']
      });
    } catch (e) {
      console.error(e)
    }
  }

  navigatedTo(link){
    this.route.navigate(['/app/'+link]);
  }
}
