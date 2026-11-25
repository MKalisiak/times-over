import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { STORAGE } from '../../infrastructure/storage';
import pl from './pl.json';
import en from './en.json';

const catalogs = { pl, en };
const storageKey = 'times-over-language';
const defaultLanguage = 'pl';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly options = Object.keys(catalogs).map(code => ({ code, name: catalogs[code].languageName }));

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(STORAGE) private storage: Storage
  ) {}

  get current(): string {
    return this.translate.currentLang;
  }

  initialize(): void {
    for (const { code } of this.options) {
      this.translate.setTranslation(code, catalogs[code]);
    }
    this.translate.setDefaultLang(defaultLanguage);
    this.select(this.storage.getItem(storageKey));
  }

  select(code: string): void {
    const language = this.options.some(option => option.code === code) ? code : defaultLanguage;
    this.translate.use(language);
    this.document.documentElement.lang = language;
    this.storage.setItem(storageKey, language);
  }
}
