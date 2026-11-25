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
