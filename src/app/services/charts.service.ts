import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class ChartSevice {
    header
    constructor(private http: HttpClient) {
        // console.log(environment)
    }
    // private apiUrl: string = 'http://50.19.219.56:3000/api';  //PROD
    private apiUrl: string = `${environment.hostIp}/api/measurements/`; // DEV
    // private apiUrl:string = 'http://3e63-181-129-145-146.ngrok.io/api' // local

    getMachineData(date) {
        return this.http.post(this.apiUrl + 'by-machine', date)
    }

    getDataTracking(data) {
        return this.http.post(this.apiUrl + 'tracking-by-machine', data);
    }

    getDataGrid(machineId, timestamp) {
        return this.http.get(this.apiUrl + 'grid/' + machineId, {
            params: {
                timestamp
            }
        })
    }

    getReportGeneral(value) {
        return this.http.post(this.apiUrl + 'report-variables', value, {
            headers: {
                Accept: 'application/octet-stream'
            },
            responseType: 'blob'
        })
    }
}
