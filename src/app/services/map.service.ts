import { Injectable, OnInit } from '@angular/core';
import { ChartSevice } from './charts.service'
declare let google;

@Injectable({
    providedIn: 'root'
})
export class MapService implements OnInit {
    map;
    constructor(private ch: ChartSevice) { }

    ngOnInit() { }

    initMap(element: HTMLElement) {
        this.map = new google.maps.Map(element, {
            center: { lat: 37.090, lng: -95.712 },
            zoom: 4,
            disableDefaultUI: true
        })
    }

    getDataForMap(data): Promise<any> {
        return this.ch.getDataTracking(data).toPromise();
    }

    drawMarker({ latitude, longitude }) {
        let x = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: this.map,
        })
    }
}