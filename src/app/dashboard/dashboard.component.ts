import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  machines: Array<IMachine>;
  constructor(private uService: UserService, private route: Router) { }

  ngOnInit(): void {
    this.uService.getMachines().pipe(tap(v => console.log(v))).toPromise().then((machines: IMachine[]) => this.machines = machines['data']);
  }

  /**
   * @param {String} query 
   * @description Filter the machine list by query param.
   * @author fire
   */
  searchByText(query: string) {
    this.machines = [...new Set([
      ...this.machines.filter(machine => machine.name.toLowerCase().startsWith(query.toLowerCase()))
    ])];
  }

  goToDetails(id) {
    this.route.navigate(['details/' + id]);
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