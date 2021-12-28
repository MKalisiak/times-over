import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntriesService } from './entries.service';
import { Settings, SettingsService } from './settings.service';

export interface UsedEntry {
  entry: string;
  guessed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  scores: Array<Array<number>>;
  activeTeamIndex: number;
  currentRound: number;
  entriesLeft: Array<string>;

  private currentEntry$: BehaviorSubject<string>;
  currentEntry: Observable<string>;

  entriesUsed: Array<UsedEntry>;

  settings: Settings;

  constructor(
    private entriesService: EntriesService,
    private settingsService: SettingsService
  ) {
    this.currentEntry$ = new BehaviorSubject<string>(null);
    this.currentEntry = this.currentEntry$.asObservable();
  }

  initGame(): void {
    this.settings = this.settingsService.settings;
    this.scores = new Array(this.settings.numberOfRounds);
    for (let i = 0; i < this.settings.numberOfRounds; i++) {
      this.scores[i] = new Array(this.settings.numberOfTeams).fill(null);
    }
    this.activeTeamIndex = 0;
    this.currentRound = 0;
    this.initEntries();

    this.entriesUsed = [];
  }

  initEntries(): void {
    this.entriesLeft = shuffle([...this.entriesService.entries]);
  }

  initNextTurn(): void {
    this.scores[this.currentRound][this.activeTeamIndex] += this.entriesUsed.filter(entry => entry.guessed === true).length;
    this.activeTeamIndex = (this.activeTeamIndex + 1) % this.settings.numberOfTeams;
    this.returnEntries(this.entriesUsed.filter(entry => entry.guessed === false));
    this.entriesUsed = [];
  }

  initNextRound(): void {
    this.currentRound += 1;
    if (this.currentRound >= this.settings.numberOfRounds) {
      this.entriesService.clear();
      throw(new Error('Game ended'));
    }
    this.initEntries();
  }

  emitNextEntry(): void {
    if (this.entriesLeft.length > 0) {
      this.currentEntry$.next(this.entriesLeft.pop());
    } else {
      throw(new Error('No more entries'));
    }
  }

  guess(): void {
    this.entriesUsed.push({entry: this.currentEntry$.value, guessed: true});
  }

  skip(): void {
    this.entriesUsed.push({entry: this.currentEntry$.value, guessed: false});
  }

  toggleUsedEntryGuessedState(usedEntry: string): void {
    const entry = this.entriesUsed.find(x => x.entry === usedEntry);
    if (entry) {
      entry.guessed = !entry.guessed;
    }
  }

  hasEntries(): boolean {
    return this.entriesLeft.length > 0;
  }

  private returnEntries(entries: Array<UsedEntry>): void {
    this.entriesLeft = shuffle(this.entriesLeft.concat(entries.map(entry => entry.entry)));
  }

}

function shuffle(array: Array<any>) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
