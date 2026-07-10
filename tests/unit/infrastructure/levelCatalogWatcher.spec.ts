import fs from 'fs';
import os from 'os';
import path from 'path';

import { createContainerForTests } from '../../../src/infrastructure/http/server';
import { LevelCatalogFileSubject } from '../../../src/infrastructure/persistence/seed/observers/LevelCatalogFileSubject';
import { ILevelCatalogObserver } from '../../../src/infrastructure/persistence/seed/observers/ILevelCatalogObserver';

describe('LevelCatalogFileSubject (Observer)', () => {
  const minimalLevel = {
    id: 'watcher-test-level',
    levelNumber: 98,
    difficulty: 'EASY' as const,
    maxMoves: 5,
    maxTimeInSeconds: 60,
    width: 2,
    height: 1,
    exit: { row: 0, col: 1 },
    arrows: [{ id: 'w1', direction: 'RIGHT' as const, head: { row: 0, col: 0 }, body: [] }],
  };

  it('should_notify_observer_when_json_file_is_written', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'level-watcher-'));
    const filePath = path.join(tempDir, '98-watcher-test-level.json');
    const notified: string[] = [];

    const observer: ILevelCatalogObserver = {
      onLevelFileChanged: async changedPath => {
        notified.push(changedPath);
      },
    };

    const subject = new LevelCatalogFileSubject(tempDir, 50);
    subject.attach(observer);
    subject.start();

    try {
      fs.writeFileSync(filePath, JSON.stringify(minimalLevel));
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(notified.some(pathValue => pathValue.endsWith('98-watcher-test-level.json'))).toBe(true);
    } finally {
      subject.stop();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should_persist_level_via_UpsertObserver_without_server_restart', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'level-watcher-upsert-'));
    const filePath = path.join(tempDir, '98-watcher-test-level.json');
    const container = createContainerForTests();

    const observer: ILevelCatalogObserver = {
      onLevelFileChanged: async changedPath => {
        const raw = fs.readFileSync(changedPath, 'utf-8');
        const dto = JSON.parse(raw);
        await container.upsertLevel.execute(dto);
      },
    };

    const subject = new LevelCatalogFileSubject(tempDir, 50);
    subject.attach(observer);
    subject.start();

    try {
      fs.writeFileSync(filePath, JSON.stringify(minimalLevel));
      await new Promise(resolve => setTimeout(resolve, 250));

      const levels = await container.listLevels.execute();
      expect(levels.map(level => level.id)).toContain('watcher-test-level');
    } finally {
      subject.stop();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
