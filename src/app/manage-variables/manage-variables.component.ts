import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-variables',
  templateUrl: './manage-variables.component.html',
  styleUrls: ['./manage-variables.component.scss']
})
export class ManageVariablesComponent implements OnInit {
  variables;
  proemiun;
  variablesControl = new FormControl()
  constructor(private uServices: UserService) { }

  ngOnInit(): void {
    this.getVariables();
    this.getPromiunVariables()
  }

  async getVariables() {
    try {
      let info = await this.uServices.getVariables().toPromise();
      this.variables = info['data'];
    } catch (e) {
      console.error(e)
    }
  }

  async getPromiunVariables() {
    try {
      let res = await this.uServices.getProemiunVariable().toPromise();
      this.proemiun = res['data'];
    } catch (e) {
      console.error(e)
    }
  }

  async saveProemion() {
    try {
      let res = await this.uServices.saveVariables(this.variablesControl.value).toPromise();
      this.variables.push(...res['data']);
      this.variablesControl.reset();
    } catch (e) {
      console.log(e)
    }
  }

  async deleteVariable(variable) {
    try {
      let res = await this.uServices.deleteVariables(variable._id).toPromise();

      let index = this.variables.indexOf(variable);

      this.variables.splice(index, 1)

      Swal.fire('Variable Eliminada', `La variable '${variable.variable}' ha sido eliminada`, 'success');
    } catch (e) {
      console.error(e)
    }
  }
}
