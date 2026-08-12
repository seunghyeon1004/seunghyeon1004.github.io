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

test('selected work exposes a handoff and four three-beat product scenes', () => {
  assert.match(html, /data-story-handoff/);

  const scenes = [...html.matchAll(/<article[^>]+data-product-scene[^>]+data-project=["']([^"']+)["']/g)]
    .map(match => match[1]);
  assert.deepEqual(scenes, ['pawrelay', 'operations', 'skillsets', 'f301']);

  for (const project of scenes) {
    const start = html.indexOf(`data-project="${project}"`);
    const end = html.indexOf('</article>', start);
    const scene = html.slice(start, end);
    assert.match(scene, /data-scene-layer="thesis"/);
    assert.match(scene, /data-scene-layer="evidence"/);
    assert.match(scene, /data-scene-layer="method"/);
  }
});

test('homepage loads the isolated product story enhancement', () => {
  assert.match(html, /<script type="module" src="assets\/js\/product-story\.js"><\/script>/);
});
