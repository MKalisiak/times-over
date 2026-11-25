import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../app.module';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('switches labels immediately and saves the selected language', () => {
    component.languages.select('en');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Settings');
    component.languages.select('pl');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Ustawienia');
    expect(document.documentElement.lang).toBe('pl');
    expect(localStorage.getItem('times-over-language')).toBe('pl');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
