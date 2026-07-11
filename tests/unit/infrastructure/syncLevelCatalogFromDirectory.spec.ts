import fs from 'fs';
import os from 'os';
import path from 'path';

import { createContainerForTests } from '../../../src/infrastructure/http/server';
import { parseLevelJsonFile } from '../../../src/infrastructure/persistence/seed/parseLevelJsonFile';
import {
  listLevelJsonFiles,
  syncLevelCatalogFromDirectory,
  upsertLevelFromFile,
} from '../../../src/infrastructure/persistence/seed/syncLevelCatalogFromDirectory';

describe('syncLevelCatalogFromDirectory', () => {
  const minimalLevel = {
    id: 'sync-test-level',
    levelNumber: 99,
    difficulty: 'EASY' as const,
    maxMoves: 5,
    maxTimeInSeconds: 60,
    width: 3,
    height: 1,
    exit: { row: 0, col: 2 },
    arrows: [{ id: 's1', direction: 'RIGHT' as const, head: { row: 0, col: 0 }, body: [{ row: 0, col: 1 }] }],
  };

  it('should_upsert_a_single_level_json_file', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-level-file-'));
    const filePath = path.join(tempDir, '99-sync-test-level.json');

    try {
      fs.writeFileSync(filePath, JSON.stringify(minimalLevel));
      const container = createContainerForTests();
      const saved = await upsertLevelFromFile(container, filePath);

      expect(saved.id).toBe('sync-test-level');
      const listed = await container.listLevels.execute();
      expect(listed.map(level => level.id)).toContain('sync-test-level');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should_sync_all_json_files_in_directory', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-level-dir-'));
    const filePath = path.join(tempDir, '99-sync-test-level.json');

    try {
      fs.writeFileSync(filePath, JSON.stringify(minimalLevel));
      const container = createContainerForTests();
      const result = await syncLevelCatalogFromDirectory(container, tempDir);

      expect(result.synced).toBe(1);
      expect(result.levelIds).toEqual(['sync-test-level']);
      expect(listLevelJsonFiles(tempDir)).toHaveLength(1);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe('parseLevelJsonFile', () => {
  it('should_throw_when_file_does_not_exist', () => {
    expect(() => parseLevelJsonFile(path.join(os.tmpdir(), 'missing-level.json'))).toThrow(
      /Level file not found/,
    );
  });
});
