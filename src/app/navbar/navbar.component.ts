import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
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
  constructor(private dialog: MatDialog, private fb: FormBuilder,
    private uServices: UserService) { }

  ngOnInit(): void {

  }

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

  async getUsers(){
    try{
      let users = await this.uServices.getUsers().toPromise();
      this.users = users['data'];
    }catch(e){
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
}
