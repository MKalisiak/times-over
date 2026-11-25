import { Subscription } from 'rxjs';
import { SettingsService, Settings, DuplicatePolicy } from './../services/settings.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {

  settingsForm: FormGroup;
  settingsValueChangesSub: Subscription;
  readonly duplicatePolicyView = [
    { labelKey: 'settings.reject', value: DuplicatePolicy.DONT_ALLOW },
    { labelKey: 'settings.remove', value: DuplicatePolicy.REMOVE_SILENTLY }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    public languages: LanguageService
  ) {}

  ngOnInit() {
    const settings = this.settingsService.settings;
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
