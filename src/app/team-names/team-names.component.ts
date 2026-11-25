import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EntriesService } from '../services/entries.service';
import { GameService } from '../services/game.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-team-names',
  templateUrl: './team-names.component.html',
  styleUrls: ['./team-names.component.scss']
})
export class TeamNamesComponent implements OnInit {
  names: FormControl[] = [];

  constructor(
    private entries: EntriesService,
    private settings: SettingsService,
    private game: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.entries.entries.length) {
      this.router.navigateByUrl('/entries', { replaceUrl: true });
      return;
    }
    this.names = Array.from({ length: this.settings.settings.numberOfTeams }, () => new FormControl(''));
  }

  startGame(): void {
    const names = this.names.map((control, index) => control.value.trim() || `Team ${index + 1}`);
    this.game.initGame(names);
    this.router.navigateByUrl('/game');
  }
}
