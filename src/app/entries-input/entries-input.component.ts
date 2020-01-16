import { GameService } from './../services/game.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EntriesService } from './../services/entries.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entries-input',
  templateUrl: './entries-input.component.html',
  styleUrls: ['./entries-input.component.scss']
})
export class EntriesInputComponent implements OnInit {

  entryForm: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private entriesService: EntriesService,
    private router: Router,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      entry: ''
    });

    this.entriesService.clear();
  }

  saveEntry(): void {
    const entry = this.entryForm.get('entry').value ? String(this.entryForm.get('entry').value).trim() : null;

    if (entry) {
      this.entryForm.get('entry').patchValue(entry);
      if (this.entriesService.includesEntry(entry)) {
        this.error = 'Tough tittes, try something else';
      } else {
        this.entriesService.addEntry(entry);
        this.entryForm.reset();
        this.error = null;
      }
    }
  }

  numberOfEntries(): number {
    return this.entriesService.entries.length;
  }

  startGame(): void {
    this.gameService.initGame();
    this.router.navigateByUrl('/game');
  }

}
