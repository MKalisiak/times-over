import { Subscription } from 'rxjs';
import { SettingsService, Settings, DuplicatePolicy } from './../services/settings.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface DuplicatePolicyView {
  name: string;
  value: DuplicatePolicy;
}

const duplicatePolicyNames = {
  DONT_ALLOW: 'Don\'t allow',
  REMOVE_SILENTLY: 'Remove silently',
  // REMOVE_AND_REPLACE: 'Remove and replace'
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settingsForm: FormGroup;
  settingsValueChangesSub: Subscription;
  duplicatePolicyView: Array<DuplicatePolicyView>;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService) { }

  ngOnInit() {
    const settings = this.settingsService.settings;

    this.duplicatePolicyView = [
      {
        name: duplicatePolicyNames.DONT_ALLOW,
        value: DuplicatePolicy.DONT_ALLOW
      },
      {
        name: duplicatePolicyNames.REMOVE_SILENTLY,
        value: DuplicatePolicy.REMOVE_SILENTLY
      },
      // {
      //   name: duplicatePolicyNames.REMOVE_AND_REPLACE,
      //   value: DuplicatePolicy.REMOVE_AND_REPLACE
      // }
    ];
    this.settingsForm = this.formBuilder.group({
      numberOfTeams: settings.numberOfTeams,
      numberOfRounds: settings.numberOfRounds,
      secondsPerTry: settings.secondsPerTry,
      secondsSubstractedForSkip: settings.secondsSubstractedForSkip,
      duplicatePolicy: settings.duplicatePolicy
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
