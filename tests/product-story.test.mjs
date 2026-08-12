import assert from 'node:assert/strict';
import test from 'node:test';
import { clamp, getSceneProgress, getSceneState } from '../assets/js/product-story.js';

test('scene progress maps the sticky travel distance to zero through one', () => {
  assert.equal(clamp(-0.2), 0);
  assert.equal(clamp(1.2), 1);
  assert.equal(getSceneProgress({ top: 100, height: 3000 }, 1000), 0);
  assert.equal(getSceneProgress({ top: -1000, height: 3000 }, 1000), 0.5);
  assert.equal(getSceneProgress({ top: -2500, height: 3000 }, 1000), 1);
});

test('scene state has deterministic forward and reverse boundaries', () => {
  assert.equal(getSceneState(0), 'thesis');
  assert.equal(getSceneState(0.2199), 'thesis');
  assert.equal(getSceneState(0.22), 'evidence');
  assert.equal(getSceneState(0.7199), 'evidence');
  assert.equal(getSceneState(0.72), 'method');
  assert.equal(getSceneState(1), 'method');
  assert.equal(getSceneState(0.4), 'evidence');
});
