import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('homepage exposes the approved sections and media', () => {
  for (const id of ['scroll-story', 'scroll-film', 'selected-work', 'capabilities', 'archive', 'contact']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /assets\/media\/portfolio-universe-720p\.mp4/);
  assert.match(html, /SEUNGHYEON/);
});

test('homepage keeps four selected systems and two languages', () => {
  for (const name of ['PawRelay', 'Multi-Mac Operations', 'Claude Skillsets', 'F301']) {
    assert.match(html, new RegExp(name));
  }
  assert.match(html, /data-ko=/);
  assert.match(html, /data-en=/);
});
