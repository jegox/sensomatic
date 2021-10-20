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
    'from': new FormControl(),
    'to': new FormControl(),
    'date': new FormControl()
  });
  colors = {
    'Regando': '#42ff00',
    'Operativo sin riego': '#ff6e00',
    'Tanqueando agua': '#0019ff',
    'Almuerzo': '#231f20',
    'Clima': '#b2b2b2',
    'Tanqueando combustible': '#d60000',
    'Sin Operator': '#ff00ff',
    'Standby con Operator': '#ffe500',
  }
  dayTurn: Array<any>;
  nightTurn: Array<any>;
  listDays: Array<any>;
  tableDays: Array<any>;
  myChart: Chart[];
  constructor(private route: ActivatedRoute, private uService: UserService, private chartS: ChartSevice) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.machineId = v.id;
      this.uService.getDetailsMachine(v.id).toPromise().then(v => this.generalMachine = v['data']);
    })
    this.date.get('date').valueChanges.subscribe(date => this.getData(date));
  }

  /**
   * @description This function is trigger when request is done. We
   * check if the parameter is an Array or Object
   * @param data Object | Array
   */
  initChart({ data }) {
    Chart.register(...registerables);

    if (Array.isArray(data)) {
      this.listDays = data;
      this.getData(this.listDays[0]);
    } else {
      this.getData(data);
    }
  }

  /**
   * @description Get a element and loop on to find the data and display it on chart
   * @param element Object
   */
  getData(element) {
    let where = ['dayTurn', 'nightTurn'];
    let index = 0;

    if (this.myChart?.length === 2) {
      this.myChart.map(chart => chart.destroy());
      this.myChart = [];
    }

    this.tableDays = [];

    this.getTableInformation(element);

    for (let turn in element) {
      if (turn === 'date') continue;

      element[turn].total = element[turn].map(({ value }) => value).reduce((accumulator, current) => accumulator + current);

      element[turn] = element[turn].sort((a, b) => b.value - a.value);

      this[turn] = element[turn];

      this.displayChart(element[turn], where[index]);

      index++
    }
  }

  /**
   * @description Just get the data and display it on chart
   * @param data Object
   * @param where String
   */
  displayChart(data, where: string) {
    let config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: data.map(({ variable }) => variable),
        datasets: [{
          label: 'Variables',
          data: data.map(({ value }) => value),
          backgroundColor: data.map(({ variable }) => this.colors[variable]),
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: where == 'dayTurn' ? 'Turno de dia' : 'Turno de Noche',
            font: {
              size: 20
            }
          }
        }
      }
    }
    let canvas = (<HTMLCanvasElement>document.getElementById(`${where}`));
    let ctx = canvas.getContext('2d');

    this.myChart = [...this.myChart ?? [], new Chart(ctx, config)]
  }

  /**
   * @description Make request to get data to chartjs
   */
  searchInfoByDate() {
    let obj = {
      initial: new Date(new Date(this.date.get('from').value).setHours(0, 0, 0, 0)).toISOString(),
      machineId: this.machineId
    }

    if (this.date.get('to').value) {
      Object.assign(obj, { final: new Date(new Date(this.date.get('to').value).setHours(0, 0, 0, 0)).toISOString() });
    }

    this.chartS.getMachineData(obj).toPromise().then((value: any) => this.initChart(value));
  }

  getTableInformation(element) {
    let obj = {};

    element['dayTurn'].map(({ variable, value, time}) => obj[variable] = {
      variable,
      dayTurn: value,
      time
    });

    let variables = element['nightTurn'].map(({ variable, value }) => obj[variable] = {
      ...obj[variable],
      nightTurn: value
    });

    this.tableDays = variables;
  }
}
