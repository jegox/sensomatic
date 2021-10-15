import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChartSevice {
    header
    constructor(private http: HttpClient) { }
    // private apiUrl: string = 'http://50.19.219.56:3000/api';  //PROD  
    private apiUrl: string = 'https://sensomatic.herokuapp.com/api'; // DEV
    // private apiUrl:string = 'http://3e63-181-129-145-146.ngrok.io/api' // local

    getMachineData(id){
       return this.http.post(this.apiUrl + '/measurements/by-machine',{
           initial: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
           final: new Date().toISOString(),
           machineId: id
       })
    }
}