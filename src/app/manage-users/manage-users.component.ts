import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ChartSevice } from '../services/charts.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
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
  displayedColumns: string[] = ['name', 'email', 'action', 'report'];
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

  switchMode(isEdit?: boolean, user?) {
    this.switch = !this.switch;

    this.title = !this.switch ? 'Listado' : (isEdit ? 'Edicion' : 'Creacion');

    isEdit && this.createUserForm.patchValue(user)
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

  async deleteUser(_id: string) {
    Swal.fire({
      title: 'Eliminar usuario',
      text: "Seguro que quieres eliminar este usuario?",
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#d8112e'
    }).then(async (v) => {
      if (v.isConfirmed) {
        try {
          let res = await this.uServices.deleteUser(_id).toPromise();
          await this.getUsers();
          Swal.fire("Usuario Eliminado", "", 'success');
        } catch (e) {
          console.error(e)
        }
      }
    })

  }

  async enableReport(event: any, _id: string) {
    try {
      console.log({_id});

      let res = await this.uServices.toggleReport(_id).toPromise();
      await this.getUsers();
      Swal.fire("Usuario actualizado", "", 'success');
    } catch (e) {
      console.error(e)
    }
  }
}
