import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapService } from '../services/map.service';
import { FormGroup, FormControl } from '@angular/forms'
declare let google;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, AfterViewInit {
  map;
  machineId: string;
  tracking: FormGroup = new FormGroup({
    'initial': new FormControl(),
    'final': new FormControl()
  });
  min: Date = new Date(new Date().setDate(2));
  max: Date = new Date();
  constructor(private route: ActivatedRoute, private M: MapService) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.machineId = v.id;
      this.M.initMap(document.getElementById('map'));
      this.M.getDataForMap({
        initial: new Date(new Date().setHours(5, 59, 0, 0)).toISOString(),
        final: new Date(new Date().setHours(17, 59, 0, 0)).toISOString(),
        machineId: this.machineId
      }).then(v => this.drawPoints(v))
    });
  }

  ngAfterViewInit(): void {
  }

  drawPoints({ data }) {
    data.map((item, index) => {
      let path = [
        { lat: data[index === 0 ? index : index - 1].latitude, lng: data[index === 0 ? index : index - 1].longitude },
        { lat: data[index].latitude, lng: data[index].longitude },
      ]

      if (path.length > 0) this.M.drawPolylines(path, item.value);
    });

    this.M.setCenter({ lat: data[0].latitude, lng: data[0].longitude });
    this.M.setZoom(9)
    setTimeout(() => {
      this.M.setZoom(12);
    }, 1000)
    // let center = this.M.getPolylines;
    // this.M.getCenterOfPoly(center);
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
}
