import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapService } from '../services/map.service';
import { FormGroup, FormControl } from '@angular/forms'
import { UserService } from '../services/user.service';
declare let google;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, AfterViewInit {
  map: boolean = false;
  map2: boolean = false;
  machineId: string;
  tracking: FormGroup = new FormGroup({
    'initial': new FormControl(),
    'final': new FormControl()
  });
  changeTracking: FormControl = new FormControl();
  listDates: Array<any>;
  completeMap: {
    'dayTurn': boolean,
    'nightTurn': boolean
  }
  legendMap: Array<any> = this.M.routers;
  generalMachine: any;
  constructor(private route: ActivatedRoute, private M: MapService, private us: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.machineId = v.id;
      this.us.getDetailsMachine(this.machineId).toPromise().then(v => this.generalMachine = v['data']);
      setTimeout(() => {
        this.M.initMap(document.getElementById('map'), "dayTurn");
        this.M.initMap(document.getElementById('map2'), "nightTurn");
        this.M.getDataForMap({
          initial: new Date(new Date().setHours(5, 59, 0, 0)).toISOString(),
          final: new Date(new Date().setHours(17, 59, 0, 0)).toISOString(),
          machineId: this.machineId
        }).then(v => this.drawPoints(v))
      }, 1000)
    });

    this.changeTracking.valueChanges.subscribe(date => this.getData(date));
  }

  ngAfterViewInit(): void {
  }

  drawPoints({ data }) {
    this.listDates = data;

    for (let points of data) {
      this.getData(points)
    }
  }


  getData(data) {
    // console.log(data)
    this.M.deleteRoute()
    for (let prop in data) {
      if (prop === 'date') continue;

      if (data[prop].length > 0) {
        this.displayData(data[prop], prop)
      }
    }
  }

  displayData(point, map) {
    let newData = point.filter(v => v.location.length > 0);

    newData.map(item => {
      let path = item.location.map(value => {
        return {
          lat: value.latitude,
          lng: value.longitude
        }
      });

      if (path.length > 0) {
        this.M.drawPolylines(path, item.value, map);
      }
    });

    this.M.drawMarker({ latitude: newData[0].location[0].latitude, longitude: newData[0].location[0].longitude }, map, "Inicio de la ruta");
    this.M.drawMarker({ latitude: newData[newData.length - 1].location[0].latitude, longitude: newData[newData.length - 1].location[0].longitude }, map, "Fin de la ruta");
    this.M.getCenterOfPoly(map)
    this.M.drawRouters(map)
  }

  setFormatDate({ initial, final }) {
    let newObj = {
      initial: new Date(new Date(initial).setHours(5, 59, 0, 0)).toISOString(),
      final: final ? new Date(new Date(final).setHours(17, 59, 0, 0)).toISOString() : new Date(new Date(initial).setHours(17, 59, 0, 0)).toISOString(),
    }
    this.tracking.patchValue(newObj)
  }

  searchData() {
    let value = this.tracking.getRawValue();
    this.setFormatDate(value);
    this.M.getDataForMap({
      ...this.tracking.getRawValue(),
      machineId: this.machineId
    }).then(data => this.drawPoints(data))
  }

  toggleMap(currentMap) {
    if (currentMap == 0) {
      if (this.map) {
        this.map = false;
        this.map2 = false;
      } else {
        this.map = true;
        this.map2 = false;
      }
    } else {
      if (this.map2) {
        this.map2 = false;
        this.map = false;
      } else {
        this.map2 = true;
        this.map = false;
      }
    }
  }
}
