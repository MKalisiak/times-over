import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { MainGameComponent } from './main-game/main-game.component';
import { EntriesInputComponent } from './entries-input/entries-input.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: {animation: 'Home'}
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {animation: 'Settings'}
  },
  {
    path: 'entries',
    component: EntriesInputComponent,
    data: {animation: 'Entries'}
  },
  {
    path: 'game',
    component: MainGameComponent,
    data: {animation: 'Game'}
  },
  {
    path: 'scoreboard',
    component: ScoreboardComponent,
    data: {animation: 'Scores'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
