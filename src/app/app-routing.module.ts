import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from '../app/details/details.component';
import { TrackingComponent } from '../app/tracking/tracking.component';
import { ParentComponent } from '../app/parent/parent.component';
import { ManageUsersComponent } from '../app/manage-users/manage-users.component';
import { ManageVariablesComponent } from '../app/manage-variables/manage-variables.component';
import { MachineComponent } from './machines/machines.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'app', component: ParentComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'gestionar-variables', component: ManageVariablesComponent },
      { path: 'gestionar-usuarios', component: ManageUsersComponent },
      { path: 'details/:id', component: DetailsComponent },
      { path: 'tracking/:id', component: TrackingComponent },
      { path: 'machines/:id', component: MachineComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
