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
      expect(result.failed).toEqual([]);
      expect(listLevelJsonFiles(tempDir)).toHaveLength(1);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should_skip_an_unsolvable_level_and_still_sync_the_rest', async () => {
    // Regresión: antes, un solo nivel no resoluble abortaba la sincronización
    // completa (y con ella el arranque del servidor) sin llegar siquiera a
    // intentar los archivos restantes. Ahora debe omitirse y reportarse en
    // `failed`, sin bloquear al resto del catálogo válido.
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-level-mixed-'));
    const goodFilePath = path.join(tempDir, '01-good-level.json');
    const badFilePath = path.join(tempDir, '02-unsolvable-level.json');

    const unsolvableLevel = {
      id: 'unsolvable-test-level',
      levelNumber: 100,
      difficulty: 'EASY' as const,
      maxMoves: 3,
      maxTimeInSeconds: 30,
      width: 5,
      height: 5,
      exit: { row: 0, col: 0 },
      arrows: [
        { id: 'b1', direction: 'RIGHT' as const, head: { row: 2, col: 1 }, body: [{ row: 2, col: 0 }] },
        { id: 'b2', direction: 'LEFT' as const, head: { row: 2, col: 3 }, body: [{ row: 2, col: 4 }] },
      ],
    };

    try {
      fs.writeFileSync(goodFilePath, JSON.stringify(minimalLevel));
      fs.writeFileSync(badFilePath, JSON.stringify(unsolvableLevel));

      const container = createContainerForTests();
      const result = await syncLevelCatalogFromDirectory(container, tempDir);

      expect(result.synced).toBe(1);
      expect(result.levelIds).toEqual(['sync-test-level']);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].fileName).toBe('02-unsolvable-level.json');
      expect(result.failed[0].message).toMatch(/no valid firing order/i);

      const listed = await container.listLevels.execute();
      expect(listed.map(level => level.id)).toEqual(['sync-test-level']);
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
