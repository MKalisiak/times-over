import { Injectable } from '@angular/core';

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

  setSettings(settings: Settings): void {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    this.settings = settings;
  }

  fetchSettings(): Settings {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
  }
}
