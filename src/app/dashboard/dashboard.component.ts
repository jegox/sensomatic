import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  machines: Array<IMachine>;
  constructor(private uService: UserService) { }

  ngOnInit(): void {
    this.uService.getMachines().toPromise().then((machines: IMachine[]) => this.machines = machines['data']);
  }

  /**
   * @param {String} query 
   * @description Filter the machine list by query param.
   * @author fire
   */
  searchByText(query: string) {
    this.machines = [...new Set([
      ...this.machines.filter(machine => machine.name.toLowerCase().startsWith(query.toLowerCase()))
    ])]
  }

}

interface IMachine {
  createdAt: string
  id: string
  isActive: boolean
  modelId: string
  modelName: string
  name: string
  serial: string
  updatedAt: string
}