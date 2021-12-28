import { filter, tap } from 'rxjs/operators';
import { DuplicatePolicy, SettingsService } from './../services/settings.service';
import { GameService } from './../services/game.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EntriesService } from './../services/entries.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ClearConfirmationDialogComponent } from './clear-confirmation-dialog/clear-confirmation-dialog.component';

@Component({
  selector: 'app-entries-input',
  templateUrl: './entries-input.component.html',
  styleUrls: ['./entries-input.component.scss']
})
export class EntriesInputComponent implements OnInit {

  entryForm: FormGroup;
  error: string;
  duplicatePolicy: DuplicatePolicy;

  constructor(
    private formBuilder: FormBuilder,
    private entriesService: EntriesService,
    private router: Router,
    private gameService: GameService,
    private settingsService: SettingsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      entry: ''
    });

    this.duplicatePolicy = this.settingsService.settings.duplicatePolicy;
  }

  saveEntry(): void {
    const entry = this.entryForm.get('entry').value ? String(this.entryForm.get('entry').value).trim() : null;

    if (entry) {
      this.entryForm.get('entry').patchValue(entry);
      if (this.duplicatePolicy === DuplicatePolicy.DONT_ALLOW && this.entriesService.includesEntry(entry)) {
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
    if (this.duplicatePolicy === DuplicatePolicy.REMOVE_SILENTLY) {
      this.entriesService.removeDuplicates();
    }
    this.gameService.initGame();
    this.router.navigateByUrl('/game');
  }

  onClearClicked(): void {
    const dialogRef = this.dialog.open(ClearConfirmationDialogComponent);
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      tap(() => this.entriesService.clear())
    ).subscribe();
  }

}
