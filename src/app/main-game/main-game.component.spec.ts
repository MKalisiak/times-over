import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../app.module';
import { GameService } from '../services/game.service';
import { MainGameComponent } from './main-game.component';

describe('MainGameComponent', () => {
  let component: MainGameComponent;
  let fixture: ComponentFixture<MainGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(GameService).initGame(['Test A', 'Test B']);
    fixture = TestBed.createComponent(MainGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
