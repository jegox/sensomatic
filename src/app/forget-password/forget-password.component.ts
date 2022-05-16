import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    forget: FormControl = new FormControl('');
    token: string;
    constructor(private uService: UserService, private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe((v) => {
            if (v.accessToken) {
                localStorage.setItem('token', v.accessToken)
            }
        })
    }
    ngOnInit(): void { }

    reset() {
        this.uService.resetPassword({ password: this.forget.value }).toPromise().then((v: any) => {
            localStorage.setItem('user', JSON.stringify(v.data.user));
            localStorage.setItem('role', v.data.user.role);
            localStorage.setItem('token', v.data.access_token);
        }).then(v => {
            this.router.navigate(['/app/dashboard'])
        })
    }
}
