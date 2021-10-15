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
  machinesFiltered: Array<IMachine>
  constructor(private uService: UserService, private route: Router) { }

  ngOnInit(): void {
    this.uService.getMachines().toPromise().then((machines: IMachine[]) => {
      this.machines = machines['data'];
      this.machinesFiltered = machines['data'];
    });
  }

  /**
   * @param {String} query 
   * @description Filter the machine list by query param.
   * @author fire
   */
  searchByText(query: string) {
    if (query === '') return this.machines = this.machinesFiltered;

    this.machines = [...new Set([
      ...this.machinesFiltered.filter(machine => machine.name.toLowerCase().startsWith(query.toLowerCase()))
    ])];
  }

  goToDetails(link, id) {
    this.route.navigate(['/app/'+link+'/'+id]);
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