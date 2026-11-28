import { EntriesService } from './entries.service';
import { GameService } from './game.service';
import { DuplicatePolicy, SettingsService } from './settings.service';

describe('GameService team setup', () => {
  it('starts with a deduplicated deck and rotates through the named teams', () => {
    const storage = jasmine.createSpyObj('storage', ['getItem', 'setItem']);
    storage.getItem.and.returnValue(null);
    const entries = new EntriesService(storage);
    entries.addEntry('Moonwalk');
    entries.addEntry('Moonwalk');

    const settings = {
      settings: { numberOfRounds: 1, duplicatePolicy: DuplicatePolicy.REMOVE_SILENTLY }
    } as SettingsService;
    const game = new GameService(entries, settings);
    game.initGame(['Rysie', 'Sowy']);

    expect(game.entriesLeft).toEqual(['Moonwalk']);
    expect(game.scores[0]).toEqual([null, null]);
    expect(game.getActiveTeamName()).toBe('Rysie');
    game.initNextTurn();
    expect(game.getActiveTeamName()).toBe('Sowy');
    game.initNextTurn();
    expect(game.getActiveTeamName()).toBe('Rysie');
  });
});

describe('GameService previous turn review', () => {
  let game: GameService;

  beforeEach(() => {
    const storage = jasmine.createSpyObj('storage', ['getItem', 'setItem']);
    storage.getItem.and.returnValue(null);
    const entries = new EntriesService(storage);
    ['A', 'B', 'C'].forEach(word => entries.addEntry(word));
    game = new GameService(entries, { settings: { numberOfRounds: 2 } } as SettingsService);
    game.initGame(['Rysie', 'Sowy']);
  });

  it('rescores repeated edits once and keeps untouched entries in the deck', () => {
    expect(game.canReviewPreviousTurn).toBe(false);
    game.emitNextEntry();
    game.guess();
    game.emitNextEntry();
    game.skip();
    const untouched = game.entriesLeft.slice();
    game.initNextTurn();
    expect(game.scores[0]).toEqual([1, null]);

    game.reopenPreviousTurn();
    expect(game.getActiveTeamName()).toBe('Rysie');
    expect(game.entriesLeft).toEqual(untouched);
    const corrected = game.entriesUsed[0].entry;
    game.toggleUsedEntryGuessedState(corrected);
    game.initNextTurn();
    expect(game.scores[0]).toEqual([0, null]);
    expect(game.entriesLeft.slice().sort()).toEqual(['A', 'B', 'C']);

    game.reopenPreviousTurn();
    game.toggleUsedEntryGuessedState(corrected);
    game.initNextTurn();
    expect(game.scores[0]).toEqual([1, null]);
    expect(game.entriesLeft.length).toBe(2);
    expect(game.entriesLeft).not.toContain(corrected);
    expect(game.getActiveTeamName()).toBe('Sowy');
    game.emitNextEntry();
    expect(game.canReviewPreviousTurn).toBe(false);
  });

  it('can reopen the preceding round before the first draw of the new round', () => {
    while (game.hasEntries()) {
      game.emitNextEntry();
      game.guess();
    }
    game.initNextTurn();
    game.initNextRound();
    game.reopenPreviousTurn();
    expect(game.currentRound).toBe(0);
    game.toggleUsedEntryGuessedState(game.entriesUsed[2].entry);
    game.initNextTurn();
    expect(game.scores).toEqual([[2, null], [null, null]]);
    expect(game.entriesLeft.length).toBe(1);
    expect(game.getActiveTeamName()).toBe('Sowy');
  });
});
