import { Subscription } from 'rxjs';
import { SettingsService, Settings } from './../services/settings.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settingsForm: FormGroup;
  settingsValueChangesSub: Subscription;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService) { }

  ngOnInit() {
    const settings = this.settingsService.settings;
    this.settingsForm = this.formBuilder.group({
      numberOfTeams: settings.numberOfTeams,
      numberOfRounds: settings.numberOfRounds,
      secondsPerTry: settings.secondsPerTry,
      secondsSubstractedForSkip: settings.secondsSubstractedForSkip
    });

    this.settingsValueChangesSub = this.settingsForm.valueChanges.subscribe((newSettings: Settings) => {
      newSettings = this.settingsService.validateSettings(newSettings);
      this.settingsService.setSettings(newSettings);
    });
  }

  ngOnDestroy(): void {
    this.settingsValueChangesSub.unsubscribe();
  }
}
