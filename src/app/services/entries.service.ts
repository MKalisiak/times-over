import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  entries: string[] = [];

  constructor() { }

  public clear(): void {
    this.entries = [];
  }

  public includesEntry(entry: string) {
    return this.entries.map(existingEntry => existingEntry.toLowerCase()).includes(entry.toLowerCase());
  }

  public addEntry(entry: string) {
    this.entries.push(entry);
  }

  removeDuplicates() {
    this.entries = [...new Set(this.entries)];
  }
}
