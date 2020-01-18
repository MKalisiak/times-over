import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';

export interface Settings {
  numberOfTeams: number;
  numberOfRounds: number;
  secondsPerTry: number;
  secondsSubstractedForSkip: number;
  duplicatePolicy: DuplicatePolicy;
}

export enum DuplicatePolicy {
  DONT_ALLOW = 'dont_allow',
  REMOVE_SILENTLY = 'remove_silently',
  // REMOVE_AND_REPLACE = 'remove_and_replace'
}

export const defaultSettings: Settings = {
  numberOfTeams: 2,
  numberOfRounds: 3,
  secondsPerTry: 30,
  secondsSubstractedForSkip: 0,
  duplicatePolicy: DuplicatePolicy.DONT_ALLOW
};

export const minimalValues: Settings = {
  numberOfTeams: 2,
  numberOfRounds: 1,
  secondsPerTry: 5,
  secondsSubstractedForSkip: 0,
  duplicatePolicy: null
};

const LOCAL_STORAGE_SETTINGS_KEY = 'times-over-game-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: Settings;

  constructor() {
    const settings = this.fetchSettings();
    if (settings) {
      this.settings = settings;
    } else {
      this.setSettings(defaultSettings);
    }
  }

  validateSettings(settings: Settings): Settings {
    Object.entries(minimalValues).forEach(([key, value]) => {
      if (!isNullOrUndefined(value)) {
        settings[key] = Math.max(value, settings[key]);
      }
    });
    return settings;
  }

  setSettings(settings: Settings): void {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    this.settings = settings;
  }

  fetchSettings(): Settings {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
  }
}
