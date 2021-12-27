import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ReportService } from '../services/reports.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  machines: Array<IMachine>;
  machinesFiltered: Array<IMachine>
  date;
  constructor(private uService: UserService, private route: Router, private rs: ReportService) { }

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

  async dowloadGeneral({ _value }) {
    let date = _value == 'day' ? new Date(new Date(this.date).setHours(18, 30, 0, 0)).getTime() : new Date(new Date(this.date).setHours(6, 30, 0, 0)).getTime()

    try {
      let res = await this.rs.getGeneralReport(date).toPromise();
      if(res) {
        this.download(res, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      }
    } catch (e) {
      console.error(e)
    }
  }

  download(data, type: string) {
    console.log({ data, type }, `Report.${type.endsWith('pdf') ? 'pdf' : 'xlsx'}`)
    const blob = new Blob([data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Report.${type.endsWith('pdf') ? 'pdf' : 'xlsx'}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  goToDetails(link, id) {
    this.route.navigate(['/app/' + link + '/' + id]);
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