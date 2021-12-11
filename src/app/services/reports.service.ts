import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    header
    constructor(private http: HttpClient) { }
    // private apiUrl: string = 'http://50.19.219.56:3000/api';  //PROD
    private apiUrl: string = 'http://50.19.219.56:3200/api/reports/'; // DEV
    // private apiUrl:string = 'http://3e63-181-129-145-146.ngrok.io/api' // local

    getReportPDF(id){
        return this.apiUrl + 'pdf/' + id + '?timestamp=' + new Date().getTime().toString();
        return this.http.get(this.apiUrl + 'pdf/' + id, {
            params: {
                timestamp: new Date().getTime().toString()
            }
        })
    }

    getReportExcel(id){
        return this.apiUrl + 'excel/' + id + '?timestamp=' + new Date().getTime().toString();

        return this.http.get(this.apiUrl + 'excel/' + id)
    }
}