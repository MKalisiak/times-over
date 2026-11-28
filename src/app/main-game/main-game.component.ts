import { Router } from '@angular/router';
import { GameService, UsedEntry } from './../services/game.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';

enum Mode {
  PLAYING,
  WAITING_FOR_READY,
  TURN_SUMMARY
}

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html'
})
export class MainGameComponent implements OnInit, OnDestroy {
  currentEntry: string;
  activeMode = Mode.WAITING_FOR_READY;
  mode = Mode;
  milisLeft: number;
  currentRound: number;
  usedEntries: Array<UsedEntry>;

  viewSecondsLeft: number;

  currentEntrySub: Subscription;
  timerId: number;
  viewTimerId: number;

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  get activeTeamName(): string {
    return this.gameService.getActiveTeamName();
  }

  ngOnInit() {
    this.currentEntrySub = this.gameService.currentEntry.pipe(filter(x => !isNullOrUndefined(x))).subscribe(newEntry => {
      this.currentEntry = newEntry;
    });
    this.milisLeft = this.gameService.settings.secondsPerTry * 1000;
    this.currentRound = this.gameService.currentRound;
  }

  get canReviewPreviousTurn(): boolean {
    return this.gameService.canReviewPreviousTurn;
  }

  reviewPreviousTurn(): void {
    this.gameService.reopenPreviousTurn();
    this.currentRound = this.gameService.currentRound;
    this.usedEntries = this.gameService.entriesUsed;
    this.activeMode = Mode.TURN_SUMMARY;
  }

  ready() {
    this.gameService.emitNextEntry();
    this.activeMode = Mode.PLAYING;
    this.viewSecondsLeft = this.gameService.settings.secondsPerTry;

    this.viewTimerId = window.setInterval(() => {
      this.viewSecondsLeft -= 1;
    }, 1000);

    this.timerId = window.setTimeout(() => {
      this.handleOutOfTime();
    }, this.milisLeft);
  }

  guess() {
    this.gameService.guess();
    try {
      this.gameService.emitNextEntry();
    } catch (error) {
      this.finishTurn();
    }
  }

  skip() {
    this.gameService.skip();
    try {
      this.gameService.emitNextEntry();
    } catch (error) {
      this.finishTurn();
    }
  }

  handleOutOfTime() {
    this.gameService.skip();
    this.finishTurn();
  }

  finishTurn() {
    window.clearTimeout(this.timerId);
    window.clearInterval(this.viewTimerId);
    this.activeMode = Mode.TURN_SUMMARY;
    this.usedEntries = this.gameService.entriesUsed;
  }

  closeSummary() {
    this.gameService.initNextTurn();
    if (this.gameService.hasEntries()) {
      this.activeMode = Mode.WAITING_FOR_READY;
    } else {
      this.finishRound();
    }
  }

  finishRound() {
    this.router.navigateByUrl('/scoreboard');
  }

  toggleUsedEntryGuessedState(entry: UsedEntry): void {
    this.gameService.toggleUsedEntryGuessedState(entry.entry);
    this.usedEntries = this.gameService.entriesUsed;
  }

  entriesLeft(): number {
    return this.gameService.entriesLeft.length;
  }

  ngOnDestroy(): void {
    this.currentEntrySub.unsubscribe();
  }
}
