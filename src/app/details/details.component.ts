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
  generalMachine
  constructor(private route: ActivatedRoute, private uService:UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      this.uService.getDetailsMachine(v.id).pipe(tap(console.log)).toPromise().then(v => this.generalMachine = v['data'])
    })
  }

}
