import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    header
    constructor(private http: HttpClient) {}
    // private apiUrl: string = 'http://50.19.219.56:3000/api';  //PROD  
    private apiUrl:string = 'https://sensomatic.herokuapp.com/api'; // DEV

    logIn(user) {
        return this.http.post(this.apiUrl + '/auth/login', user)
    }

    getMachines() {
        return this.http.get(this.apiUrl + '/machines');
    }

    getDetailsMachine(id){
        return this.http.get(this.apiUrl + '/machines/' + id)
    }

    saveUser(body){
        return this.http.post(this.apiUrl + '/users', body)
    }

    getUsers(){
        return this.http.get(this.apiUrl + '/users');
    }
}