import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { GameService } from './../services/game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html'
})
export class ScoreboardComponent implements OnInit {

  scores: Array<Array<number>>;
  currentRound: number;
  teamNames: string[];
  totals: Array<number>;

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.teamNames = this.gameService.teamNames;
    this.scores = this.gameService.scores;
    this.currentRound = this.gameService.currentRound;
    this.scores[this.currentRound].forEach((score, index) => {
      if (score == null) {
        this.scores[this.currentRound][index] = 0;
      }
    });

    this.totals = new Array(this.teamNames.length);
    for (let i = 0; i < this.teamNames.length; i++) {
      let sum = 0;
      this.scores.forEach(round => {
        sum += round[i];
      });
      this.totals[i] = sum;
    }
  }

  nextRound() {
    try {
      this.gameService.initNextRound();
      this.router.navigateByUrl('/game');
    } catch (error) {
      this.router.navigateByUrl('/');
    }
  }

  isLastRound(): boolean {
    return this.currentRound >= this.gameService.settings.numberOfRounds - 1;
  }

}
