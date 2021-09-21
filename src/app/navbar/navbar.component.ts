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
  createUserForm: FormGroup = this.userForm;
  user: string = JSON.parse(localStorage.getItem('user')).fullname;
  hide = true;
  variables = new FormControl()
  oldPass = new FormControl();
  newPass = new FormControl();
  constructor(private dialog: MatDialog, private fb: FormBuilder,
    private route: Router, private uServices: UserService) { }

  ngOnInit(): void { }

  openListUsers() {
    this.getUsers();
    this.dialog.open(this.listUsers, {
      width: "1000px"
    });
  }

  openCreateUser() {
    this.getMachines()
    this.dialog.open(this.createUser, {
      width: "500px"
    })
  }

  async getMachines() {
    try {
      let res = await this.uServices.getMachines().toPromise();
      this.machines = res['data'];
    } catch (e) {
      console.error(e)
    }
  }

  async getUsers() {
    try {
      let users = await this.uServices.getUsers().toPromise();
      this.users = users['data'];
    } catch (e) {
      console.error(e)
    }
  }

  get userForm() {
    return this.fb.group({
      "fullname": [],
      "email": [],
      "role": [],
      "mines": this.fb.array(['asd']),
      "machines": this.fb.array([])
    })
  }

  pushArray({ source: { value } }) {
    let machines = this.createUserForm.get('machines') as FormArray;

    machines.push(this.fb.control(value))
  }

  async saveUser() {
    try {
      let res = await this.uServices.saveUser(
        this.createUserForm.getRawValue()
      ).toPromise()
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  logOut() {
    localStorage.clear();
    this.route.navigate(['/']);
  }

  async openManageVariables(template: TemplateRef<any>) {
    let info = await this.uServices.getVariables().toPromise();
    let modal = this.dialog.open(template, {
      data: info['data']
    })
  }

  async getPromiunVariables(template) {
    try {
      this.dialog.closeAll();
      let res = await this.uServices.getProemiunVariable().toPromise();
      let modal = this.dialog.open(template, {
        data: res['data'],
        width: '500px'
      })
    } catch (e) {
      console.error(e)
    }
  }

  async saveProemion() {
    try {
      let res = await this.uServices.saveVariables(this.variables.value).toPromise();
      console.log(res)
    } catch (e) {
      console.log(e)
    }
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

  async deleteVariable(variable) {
    console.log(variable)
    try{
      let res = await this.uServices.deleteVariables(variable._id).toPromise();
      Swal.fire('Variable Eliminada', `La variable '${variable.variable}' ha sido eliminada`, 'success');
    }catch(e){
      console.error(e)
    }
  }
}
