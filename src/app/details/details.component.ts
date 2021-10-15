import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { UserService } from '../services/user.service';
import { tap, delay } from 'rxjs/operators';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ChartSevice } from '../services/charts.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms'
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  generalMachine;
  machineId: string;
  date: FormGroup = new FormGroup({
    'from': new FormControl(''),
    'to': new FormControl('')
  })
  constructor(private route: ActivatedRoute, private uService: UserService, private chartS: ChartSevice) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.machineId = v.id;
      this.uService.getDetailsMachine(v.id).toPromise().then(v => this.generalMachine = v['data']);
      this.chartS.getMachineData({
        initial: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        final: new Date().toISOString(),
        machineId: v.id
      }).toPromise().then((value: any) => this.initChart(value));
    })

  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  initChart({ data }) {
    if (data.length === 0) return Swal.fire('Informacion', 'No hay informacion en los parametros requeridos', 'info');
    let colors = ['#4FDDF4', '#07257E', '#06FF75', '#50F0FF', '#C17355', '#E60EF7', '#8D35D3', '#7E06E2', '#5B6886', '#E990D0', '#2BC8C8', '#A2B774', '#D775CD']
    let config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.map(v => v.data.map(time => new Date(time.time).toLocaleString())),
        datasets: data.map((v, i) => {
          return {
            label: v.variable,
            data: v.data.map(data => data.value),
            fill: false,
            borderColor: colors[i]
          }
        })
      },
      options: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Variables',
          fontSize: 30
        },
        scales: {
          xAxes: [{
            gridLines: false,
            display: false,
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 250
            }
          }]
        }
      },
    }
    let canvas = (<HTMLCanvasElement>document.getElementById('myChart'));
    let ctx = canvas.getContext('2d');

    let myChart = new Chart(ctx, config);
  }

  searchInfoByDate() {
    this.chartS.getMachineData({
      initial: this.date.get('from').value.toISOString(),
      final: new Date(this.date.get('to').value.setHours(23,59,59)).toISOString(),
      machineId: this.machineId
    }).toPromise().then((value: any) => this.initChart(value));
  }
}
