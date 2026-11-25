import { filter, tap } from 'rxjs/operators';
import { DuplicatePolicy, SettingsService } from './../services/settings.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EntriesService } from './../services/entries.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ClearConfirmationDialogComponent } from './clear-confirmation-dialog/clear-confirmation-dialog.component';

@Component({
  selector: 'app-entries-input',
  templateUrl: './entries-input.component.html'
})
export class EntriesInputComponent implements OnInit {

  entryForm: FormGroup;
  error: string;
  duplicatePolicy: DuplicatePolicy;

  constructor(
    private formBuilder: FormBuilder,
    private entriesService: EntriesService,
    private router: Router,
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
        this.error = 'This entry is already in the deck.';
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

  continueToTeams(): void {
    if (this.duplicatePolicy === DuplicatePolicy.REMOVE_SILENTLY) {
      this.entriesService.removeDuplicates();
    }
    this.router.navigateByUrl('/team-names');
  }

  onClearClicked(): void {
    const dialogRef = this.dialog.open(ClearConfirmationDialogComponent, {
      panelClass: 'clear-dialog',
      maxWidth: 'calc(100vw - 44px)',
      width: '380px'
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      tap(() => this.entriesService.clear())
    ).subscribe();
  }

}
