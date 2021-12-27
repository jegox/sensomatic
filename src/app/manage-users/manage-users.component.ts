import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ChartSevice } from '../services/charts.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: Array<any>;
  title: string = "Listado";
  switch: boolean = false;
  createUserForm: FormGroup = new FormGroup({
    'fullname': new FormControl(),
    'email': new FormControl(),
    'role': new FormControl(),
    'mines': new FormArray([]),
    'machines': new FormArray([]),
  })
  machines: any;
  constructor(private uServices: UserService, private chartS: ChartSevice) { }

  ngOnInit(): void {
    this.getUsers();
    this.getMachines();
  }

  async getUsers() {
    try {
      let users = await this.uServices.getUsers().toPromise();
      this.users = users['data'];
    } catch (e) {
      console.error(e)
    }
  }

  switchMode() {
    this.switch = !this.switch;

    this.title = !this.switch ? 'Listado' : 'Creacion';

    console.log(this.createUserForm)
  }

  pushArray({ source: { value } }) {
    let machines = this.createUserForm.get('machines') as FormArray;

    machines.push(new FormControl(value))
  }

  async getMachines() {
    try {
      let res = await this.uServices.getMachines().toPromise();
      this.machines = res['data'];
    } catch (e) {
      console.error(e)
    }
  }

  async saveUser() {
    try {
      let res = await this.uServices.saveUser(
        this.createUserForm.getRawValue()
      ).toPromise()
      await this.getUsers();
      this.switch = false;
    } catch (e) {
      console.log(e)
    }
  }
}
