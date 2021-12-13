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
    routers = [
        ["Garita Principal", 9.557743, -73.579369, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-1.png"],
        ["Los Tupes", 9.564066, -73.520866, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-2.png"],
        ["Load Out", 9.590394, -73.51297, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-3.png"],
        ["Pond 777", 9.579162, -73.479538, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-4.png"],
        ["Pond 7", 9.547085, -73.505867, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-5.png"],
        ["Megapond", 9.545066, -73.48616, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-6.png"],
        ["Pond 11", 9.540992, -73.487228, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-7.png"],
        ["El Corozo", 9.48884, -73.509552, "https://sensomaticweb.s3.us-west-2.amazonaws.com/icons/icon-8.png"]
    ];
    colors = {
        1: '#FF00000',
        0: '#FF9999',
        2: '#0037FF',
        3: '#FF6E00',
        4: '#42FF00',
        5: '#CDCDCD',
        6: '#FF00FF',
        7: '#15FFFF',
        8: '#6D2C7C',
        9: '#FFE500',
        'Modo Manual Pedal': '#CDCDCD',
        'Modo Semi Automatico': '#FF9999',
        'Modo Automatico de Riego': '#FF0000'
      }
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

    drawMarker({ latitude, longitude }, map: string , text?: string | number, icon?) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: this.map[map],
            title: text,
            icon: {
                url: icon,
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(20, 32),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32),
            }
        });
        this.markers.push(marker)
    }

    drawRouters(map) {
        this.routers.map(router => {
            this.drawMarker({ latitude: router[1], longitude: router[2] }, map, router[0], router[3])
        })
    }

    drawPolylines(path, value, map) {
        let polyline = new google.maps.Polyline({
            path,
            strokeColor: this.colors[value],
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