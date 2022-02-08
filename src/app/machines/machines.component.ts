import { Component, OnInit, NgModule } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-machines',
    templateUrl: './machines.component.html',
    styleUrls: ['./machines.component.scss']
})
export class MachineComponent implements OnInit {
    machines: Array<any> = [];
    newMachines = [];
    userId: string;
    userPermission: Array<any>;
    constructor(private uService: UserService, private route: ActivatedRoute) {
        this.userId = this.route.snapshot.params.id
    }

    ngOnInit(): void {
        this.getMachine();
        this.getUser();
    }

    async getUser() {
        try {
            let res = await this.uService.getUser(this.userId).toPromise();
            this.userPermission = res['data'].permissions.machines;
            this.newMachines = res['data'].permissions.machines ?? [];
        } catch (e) {
            console.error(e)
        }
    }

    async getMachine() {
        try {
            let res = await this.uService.getMachines().toPromise();
            this.machines = res['data'];
        } catch (e) {
            console.error(e)
        }
    }

    toogleMachines({ checked }, id) {
        try {
            if (checked) {
                this.newMachines.push(id)
            } else {
                let index = this.newMachines.findIndex((v) => v === id);
                this.newMachines.splice(index, 1)
            }
        } catch (e) {
            console.error(e)
        }
    }

    async sendMachines() {
        try {
            await this.uService.userMachines(this.userId, this.newMachines).toPromise();
            Swal.fire('Maquinas activadas', 'Las maquinas han sido activadas correctamente', 'success')
        } catch (e) {
            console.error(e)
        }
    }
}

import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
    declarations: [MachineComponent],
    imports: [CommonModule, MatSlideToggleModule, MatIconModule, MatButtonModule],
    exports: [MachineComponent],
})
export class MachineModule { }