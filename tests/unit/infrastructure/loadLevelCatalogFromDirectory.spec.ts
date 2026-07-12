import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  DEFAULT_LEVELS_DIRECTORY,
  loadLevelCatalogFromDirectory,
} from '../../../src/infrastructure/persistence/seed/loadLevelCatalogFromDirectory';
import {
  LEVEL_SEED_CATALOG,
  LEVEL_SEED_CATALOG_SIZE,
  getOrderedSeedCatalog,
} from '../../../src/infrastructure/persistence/seed/levelSeedCatalog';

describe('loadLevelCatalogFromDirectory', () => {
  it('should_load_all_json_files_from_default_levels_directory', () => {
    const jsonFileCount = fs
      .readdirSync(DEFAULT_LEVELS_DIRECTORY)
      .filter(file => file.endsWith('.json')).length;

    const catalog = loadLevelCatalogFromDirectory(DEFAULT_LEVELS_DIRECTORY);

    expect(catalog).toHaveLength(jsonFileCount);
    expect(catalog.map(level => level.id)).toContain('level-1');
  });

  it('should_match_LEVEL_SEED_CATALOG_exported_by_levelSeedCatalog', () => {
    const fromLoader = loadLevelCatalogFromDirectory();
    const orderedLoader = [...fromLoader].sort((a, b) => a.levelNumber - b.levelNumber);
    const orderedCatalog = getOrderedSeedCatalog();

    expect(orderedLoader).toEqual(orderedCatalog);
    expect(LEVEL_SEED_CATALOG).toHaveLength(LEVEL_SEED_CATALOG_SIZE);
  });

  it('should_ignore_non_json_files_in_directory', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'levels-loader-'));

    try {
      fs.writeFileSync(
        path.join(tempDir, '01-test-level.json'),
        JSON.stringify({
          id: 'temp-level',
          levelNumber: 1,
          difficulty: 'EASY',
          maxMoves: 5,
          maxTimeInSeconds: 60,
          width: 2,
          height: 1,
          exit: { row: 0, col: 1 },
          arrows: [{ id: 'x1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] }],
        }),
      );
      fs.writeFileSync(path.join(tempDir, 'README.txt'), 'not a level');

      const catalog = loadLevelCatalogFromDirectory(tempDir);

      expect(catalog).toHaveLength(1);
      expect(catalog[0].id).toBe('temp-level');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should_throw_when_directory_does_not_exist', () => {
    expect(() => loadLevelCatalogFromDirectory(path.join(os.tmpdir(), 'missing-levels-dir'))).toThrow(
      /Level catalog directory not found/,
    );
  });

  it('should_throw_when_directory_has_no_json_files', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'levels-empty-'));

    try {
      expect(() => loadLevelCatalogFromDirectory(tempDir)).toThrow(/No level JSON files found/);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should_throw_when_a_json_file_is_invalid', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'levels-bad-json-'));

    try {
      fs.writeFileSync(path.join(tempDir, '01-broken.json'), '{ not valid json');

      expect(() => loadLevelCatalogFromDirectory(tempDir)).toThrow(/Failed to parse level file/);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
