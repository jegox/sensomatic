import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
@Injectable({
    providedIn: 'root'
})
export class UserService {
    header
    constructor(private http: HttpClient) { }
    private apiUrl: string = 'http://50.19.219.56:3000/api';  //PROD
    // private apiUrl: string = `${environment.hostIp}/api`; // DEV
    // private apiUrl:string = 'http://3e63-181-129-145-146.ngrok.io/api' // local

    logIn(user) {
        return this.http.post(this.apiUrl + '/auth/login', user)
    }

    changePassword(newPassword) {
        return this.http.post(this.apiUrl + '/auth/reset-password', newPassword)
    }

    getUser(id) {
        return this.http.get(this.apiUrl + '/users/' + id);
    }

    getMachines() {
        return this.http.get(this.apiUrl + '/machines');
    }

    getDetailsMachine(id) {
        return this.http.get(this.apiUrl + '/machines/' + id)
    }

    saveUser(body) {
        return this.http.post(this.apiUrl + '/users', body)
    }

    getUsers() {
        return this.http.get(this.apiUrl + '/users');
    }

    getVariables() {
        return this.http.get(this.apiUrl + '/signals');
    }

    getProemiunVariable() {
        return this.http.get(this.apiUrl + '/signals/proemion')
    }

    saveVariables(variable) {
        return this.http.post(this.apiUrl + '/signals', { signals: variable });
    }
    deleteVariables(id) {
        return this.http.delete(this.apiUrl + '/signals/' + id)
    }
}
