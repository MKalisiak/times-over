import { Inject, Injectable } from '@angular/core';
import { STORAGE } from 'src/infrastructure/storage';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  entries: string[] = [];
  private readonly _storageKey = 'times-over-entries';

  constructor(
    @Inject(STORAGE) private readonly _storage: Storage,
  ) {
    this._getFromStorage();
  }

  public clear(): void {
    this.entries = [];
    this._syncStorage();
  }

  public includesEntry(entry: string) {
    return this.entries.map(existingEntry => existingEntry.toLowerCase()).includes(entry.toLowerCase());
  }

  public addEntry(entry: string) {
    this.entries.push(entry);
    this._syncStorage();
  }

  removeDuplicates() {
    this.entries = [...new Set(this.entries)];
    this._syncStorage();
  }

  private _syncStorage() {
    this._storage.setItem(this._storageKey, JSON.stringify(this.entries));
  }

  private _getFromStorage() {
    this.entries = JSON.parse(this._storage.getItem(this._storageKey)) || [];
  }
}
