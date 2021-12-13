import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
@Injectable({
    providedIn: 'root'
})
export class ReportService {
    header;
    constructor(private http: HttpClient) { }
    // private apiUrl: string = 'http://50.19.219.56:3000/api/reports/';  //PROD
    private apiUrl: string = `${environment.hostIp}/api/reports/`; // DEV
    // private apiUrl:string = 'http://3e63-181-129-145-146.ngrok.io/api' // local

    getReportPDF(id, time) {
        return this.http.get(this.apiUrl + 'pdf/' + id, {
            params: {
                timestamp: time
            },
            responseType: 'blob' as 'json'
        });
    }

    getReportPDF2(id, time) {
        return this.http.get(this.apiUrl + 'pdf2/' + id, {
            params: {
                date: time
            }
        })
    }

    getReportExcel(id, time) {
        return this.http.get(this.apiUrl + 'excel/' + id, {
            params: {
                timestamp: time
            },
            headers: {
                Accept: 'application/octet-stream'
            },
            responseType: 'blob'
        })
    }
}
