import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ReportService } from '../services/reports.service';
import { MapService } from '../services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartSevice } from '../services/charts.service';
import Swal from 'sweetalert2';
declare let google;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  machines: Array<IMachine>;
  machinesFiltered: Array<IMachine>
  date;
  formDownload: FormGroup = this.initForm;
  constructor(private uService: UserService, private route: Router, private rs: ReportService, private M: MapService, private dialog: MatDialog, private fb: FormBuilder, private chartS: ChartSevice) { }

  ngOnInit(): void {
    this.uService.getMachines().toPromise().then((machines: IMachine[]) => {
      this.machines = machines['data'];
      this.machinesFiltered = machines['data'];
      this.initMap();
    });
  }

  initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 4.5709, lng: -74.2973 },
      zoom: 6,
      disableDefaultUI: true,
      mapTypeControl: true,
      zoomControl: true,
      fullscreenControl: true,
      mapTypeId: 'satellite'
    });

    this.M.drawMarkerDashboard(this.machines, map);
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
      if (res) {
        this.download(res, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      }
    } catch (e) {
      console.error(e)
    }
  }

  download(data, type: string) {
    // console.log({ data, type }, `Report.${type.endsWith('pdf') ? 'pdf' : 'xlsx'}`)
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

  async activateReport({ checked }, machineId) {
    try {
      let res = await this.uService.activeReport(machineId, checked).toPromise();

      let index = this.machines.findIndex((m) => m._id === res['data']._id);

      this.machines[index] = res['data'];
    } catch (e) {
      console.error(e)
    }
  }

  openModal(template) {
    this.dialog.open(template)
  }

  closeModal() {
    this.dialog.closeAll();
  }

  get initForm() {
    return this.fb.group({
      'start': [],
      'end': [],
      'machineIds': []
    });
  }

  async reportsDownload() {
    Swal.fire({
      title: 'Descargar',
      text: 'Estas seguro que deseas descargar este reporte?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Descargar',
      cancelButtonText: 'Cancelar'
    }).then(async (v) => {
      if (v.isConfirmed) {
        let value = this.formDownload.getRawValue();

        value.start = new Date(new Date(value.start).setHours(18, 30, 0, 0)).getTime()
        value.end = new Date(new Date(value.end).setHours(6, 30, 0, 0)).getTime()
        
        let res = await this.chartS.getReportGeneral(value).toPromise();
        if (res) {
          this.download(res, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          this.formDownload.reset();
          this.dialog.closeAll();
        }
      }
    })
  }
}

interface IMachine {
  createdAt: string
  _id: string
  isActive: boolean
  modelId: string
  modelName: string
  name: string
  serial: string
  updatedAt: string
}