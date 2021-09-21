import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  generalMachine;
  machineId: string;
  constructor(private route: ActivatedRoute, private uService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.machineId = v.id;
      this.uService.getDetailsMachine(v.id).toPromise().then(v => this.generalMachine = v['data'])
    })
  }

}
