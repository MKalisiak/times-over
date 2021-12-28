import { ClearConfirmationDialogComponent } from './entries-input/clear-confirmation-dialog/clear-confirmation-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { EntriesInputComponent } from './entries-input/entries-input.component';
import { MainGameComponent } from './main-game/main-game.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import { STORAGE } from 'src/infrastructure/storage';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HomeComponent,
    ScoreboardComponent,
    EntriesInputComponent,
    MainGameComponent,
    ClearConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: STORAGE,
      useValue: localStorage,
    }
  ],
  entryComponents: [
    ClearConfirmationDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
