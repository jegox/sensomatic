import { Component, OnInit, HostListener, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { UserService } from '../services/user.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartSevice } from '../services/charts.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import localEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ReportService } from '../services/reports.service';

registerLocaleData(localEs, 'es');
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class DetailsComponent implements OnInit {
  generalMachine;
  context;
  machineId: string;
  date: FormGroup = this.initFormDate;
  colors = {
    'Regando': '#FF00000',
    'Operativo sin riego': '#FF9999',
    'Tanqueando agua': '#0037FF',
    'Almuerzo': '#FF6E00',
    'Clima': '#42FF00',
    'Tanqueando combustible': '#CDCDCD',
    'Sin Operator': '#FF00FF',
    'Standby con Operator': '#15FFFF',
    'Cambio de turno': '#FFE500',
    'Equipo Down': '#6D2C7C',
    'Modo Manual Pedal': '#CDCDCD',
    'Modo Semi Automatico': '#FF9999',
    'Modo Automatico de Riego': '#FF0000'
  }
  dayTurn: Array<any>;
  nightTurn: Array<any>;
  listDays: Array<any>;
  tableDays: Array<any>;
  myChart: Chart[];
  actualDate;
  min: Date = new Date("Wed Dec 01 2021 11:57:21 GMT+0100 (Central European Standard Time)")
  max: Date = new Date();

  @HostListener('window:resize', ['$event']) resize(e) {
    if (window.innerWidth > 1000) {
      this.myChart.map(chart => {
        chart.options.plugins.legend.display = true;
        chart.update()
      })
    } else {
      this.myChart.map(chart => {
        chart.options.plugins.legend.display = false;
        chart.update()
      })
    }
  }
  constructor(private route: ActivatedRoute, private uService: UserService, private fb: FormBuilder,
    private chartS: ChartSevice, private rs: ReportService) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.machineId = v.id;
      this.uService.getDetailsMachine(v.id).toPromise().then(v => this.generalMachine = v['data']);
      this.chartS.getMachineData({
        initial: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        machineId: this.machineId
      }).subscribe((value: any) => this.initChart(value))
    })
    this.date.get('date').valueChanges.subscribe(date => this.getData(date));
  }

  get initFormDate(): FormGroup {
    return this.fb.group({
      'from': [],
      'to': [],
      'date': [null]
    })
  }

  /**
   * @description This function is trigger when request is done. We
   * check if the parameter is an Array or Object
   * @param data Object | Array
   */
  initChart({ data }) {
    console.log(data)
    Chart.register(...registerables, ChartDataLabels);

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
    console.log(element)
    let where = ['dayTurn', 'nightTurn'];
    let index = 0;

    if (this.myChart?.length > 0) {
      this.context && this.context.restore();
      this.myChart.map(chart => chart.destroy());
      this.myChart = [];
    }

    this.tableDays = [];

    for (let turn in element) {
      if (turn === 'date') continue;
      if (!element[turn][0]) {
        this[turn] = [];
        this.displayNoData(where[index]);
        continue;
      }

      let newElement = element[turn].filter(value => value).filter(value => !['Modo Manual Pedal', 'Modo Semi Automatico', 'Modo Automatico de Riego'].includes(value?.variable));
      let pieElement = element[turn].filter(value => value).filter(value => ['Modo Manual Pedal', 'Modo Semi Automatico', 'Modo Automatico de Riego'].includes(value?.variable));

      newElement.total = newElement.filter(value => value).map(({ value }) => value).reduce((accumulator, current) => accumulator + current);
      pieElement.total = pieElement.length > 0 && pieElement.filter(value => value).map(({ value }) => value).reduce((accumulator, current) => accumulator + current);

      newElement = newElement.sort((a, b) => b.value - a.value);

      this[turn] = newElement;

      this.displayDonut(newElement, where[index]);

      if (pieElement.length > 0) {
        let wherePie = ['dayTurn1', 'nightTurn1'];

        this.displayPie(pieElement, wherePie[index]);
      }

      index++
    }

    this.getTableInformation(element);
    this.actualDate = element.date ?? new Date();
  }

  /**
   * @description Just get the data and display it on chart
   * @param data Object
   * @param where String
   */
  displayDonut(data, where: string) {
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
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: '#FFFFFF',
            formatter: (value, ctx) => {
              return value > 0 ? `${Number(100 * data[ctx.dataIndex].value / data.total).toFixed()}%` : '';
            }
          },
          legend: {
            position: 'right',
            display: window.innerWidth > 1000 ? true : false,
            labels: {
              pointStyle: 'rectRounded',
              padding: 8,
              font: {
                size: 10,
              },
              usePointStyle: true,
              filter: (legendItem, legendData) => {
                let index = data.findIndex(item => item.variable === legendItem.text);

                legendItem.text = `${legendItem.text} - *${data[index].value}min*
                ${Number(100 * data[index].value / data.total).toFixed()}%`;

                return true;
              },
              textAlign: 'right',
            },
          },
          title: {
            display: true,
            position: 'top',
            text: where == 'dayTurn' ? 'Turno de dia' : 'Turno de Noche',
            font: {
              size: 18
            }
          },
          subtitle: {
            display: true,
            text: where == 'dayTurn' ? '06:00 - 17:59' : '18:00 - 05:59 ',
            font: {
              size: 12
            }
          }
        }
      }
    }
    let canvas = (<HTMLCanvasElement>document.getElementById(`${where}`));
    let ctx = canvas.getContext('2d');

    this.myChart = [...this.myChart ?? [], new Chart(ctx, config)];
  }

  displayPie(data, where: string) {
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
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: '#FFFFFF',
            formatter: (value, ctx) => {
              return value > 0 ? `${Number(100 * data[ctx.dataIndex].value / data.total).toFixed()}%` : '';
            }
          },
          legend: {
            position: 'right',
            display: window.innerWidth > 1000 ? true : false,
            labels: {
              pointStyle: 'rectRounded',
              usePointStyle: true,
              filter: (legendItem, legendData) => {
                let index = data.findIndex(item => item.variable === legendItem.text);

                legendItem.text = `${legendItem.text} - *${data[index].value}min* ${Number(100 * data[index].value / data.total).toFixed()}%`;

                return true;
              },
              padding: 15,
              font: {
                size: 10,
              },
              textAlign: 'right',
            },
          },
          title: {
            display: true,
            text: where == 'dayTurn1' ? 'Turno de dia' : 'Turno de Noche',
            font: {
              size: 20
            }
          },
          subtitle: {
            display: true,
            text: where == 'dayTurn1' ? '06:00 - 17:59' : '18:00 - 05:59 ',
            font: {
              size: 15
            }
          },
        }
      },
    };

    let canvas = (<HTMLCanvasElement>document.getElementById(`${where}`));
    let ctx = canvas.getContext('2d');

    this.myChart = [...this.myChart ?? [], new Chart(ctx, config)];
  }

  /**
   * @description When some chart dont have data, we get it and display the text 'no data'
   * @param where {String} 
   */
  displayNoData(where) {
    let canvas = <HTMLCanvasElement>document.getElementById(where);

    this.context = canvas.getContext('2d');

    this.context.font = "30px Lucida Console, arial";

    this.context.fillText("No hay datos", 0, 100);
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

    let nightElement = element['nightTurn'].filter(data => data);
    let dayElement = element['dayTurn'].filter(data => data);

    nightElement[0] && nightElement.map(({ variable, value }) => obj[variable] = {
      nightTurn: value
    });

    let variables = dayElement.map(({ variable, value }) => obj[variable] = {
      ...obj[variable],
      dayTurn: value,
      variable,
    });

    this.tableDays = variables;
  }

  async downloadPDF(id) {
    try {
      let res = (<string>this.rs.getReportPDF(id))
      console.log(res)
      window.open(res, '_blank')
      // this.download(res, 'pdf')
    } catch (e) {
      console.error(e)
    }
  }

  async downloadExcel(id) {
    try {
      let res = (<string>this.rs.getReportExcel(id));
      window.open(res, '_blank')
      console.log(res)
      // this.download(res, 'excel')
    } catch (e) {
      console.error(e)
    }
  }

  download(pdf, ext) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = `report.${ext}`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
