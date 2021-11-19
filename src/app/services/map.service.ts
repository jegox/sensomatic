import { Injectable, OnInit } from '@angular/core';
import { ChartSevice } from './charts.service'
declare let google;

@Injectable({
    providedIn: 'root'
})
export class MapService implements OnInit {
    map = {};
    poly;
    polys = [];
    markers = [];
    constructor(private ch: ChartSevice) { }

    ngOnInit() { }

    initMap(element: HTMLElement, turn: string) {
        this.map[turn] = new google.maps.Map(element, {
            center: { lat: 4.5709, lng: -74.2973 },
            zoom: 6,
            disableDefaultUI: true,
            mapTypeControl: true,
            zoomControl: true,
            fullscreenControl: true,
        })
    }

    getDataForMap(data): Promise<any> {
        return this.ch.getDataTracking(data).toPromise();
    }

    drawMarker({ latitude, longitude }, map: string, text?: string) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: this.map[map],
            title: text
        });
        this.markers.push(marker)
    }

    drawPolylines(path, value, map) {
        let polyline = new google.maps.Polyline({
            path,
            strokeColor: value < 1 ? "red" : "green",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        polyline.setMap(this.map[map]);
        this.polys.push(polyline);
    }

    get getPolylines() {
        return this.polys;
    }

    deleteRoute() {
        if (this.markers.length > 0 && this.polys.length > 0) {
            this.markers.map(marker => marker.setMap(null));
            this.polys.map(poly => poly.setMap(null))
        }
    }

    setCenter(center, map) {
        this.map[map].setCenter(center);
    }

    setZoom(zoom: number, map) {
        this.map[map].setZoom(zoom)
    }

    getCenterOfPoly(map) {
        var bounds = new google.maps.LatLngBounds();
        this.polys.map(poly => {
            let coord = poly.getPath().getArray();
            for (var n = 0; n < coord.length; n++) {
                bounds.extend(coord[n]);
            }
        });
        this.map[map].fitBounds(bounds);
    }
}