import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapService } from '../services/map.service';
declare let google;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, AfterViewInit {
  map;
  machineId: string;
  constructor(private route: ActivatedRoute, private M: MapService) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.machineId = v.id;
      this.M.initMap(document.getElementById('map'));
      this.M.getDataForMap({
        initial: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
        final: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
        machineId: this.machineId
      }).then(v => this.drawPoints(v))
    })
  }

  ngAfterViewInit(): void {
  }

  drawPoints({ data }) {
    console.log(data)
    for (let points of data) {
      let x = {
        latitude: points.latitude,
        longitude: points.longitude
      }
      console.log(x)
      this.M.drawMarker(x)
    }
  }
}
