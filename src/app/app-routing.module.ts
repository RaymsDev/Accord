import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './user/login/login.module#LoginPageModule'
  },
  {
    path: 'room/create',
    loadChildren: './create-room/create-room.module#CreateRoomPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'room/:id',
    loadChildren: './room/room.module#RoomPageModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
