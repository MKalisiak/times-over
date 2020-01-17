import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';

export interface Settings {
  numberOfTeams: number;
  numberOfRounds: number;
  secondsPerTry: number;
  secondsSubstractedForSkip: number;
}

export const defaultSettings: Settings = {
  numberOfTeams: 2,
  numberOfRounds: 3,
  secondsPerTry: 30,
  secondsSubstractedForSkip: 0
};

export const minimalValues: Settings = {
  numberOfTeams: 2,
  numberOfRounds: 1,
  secondsPerTry: 5,
  secondsSubstractedForSkip: 0
}

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
    Object.entries(minimalValues).forEach(([key, value]) => {
      if (!isNullOrUndefined(value)) {
        settings[key] = Math.max(value, settings[key]);
      }
    });
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    this.settings = settings;
  }

  fetchSettings(): Settings {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
  }
}
