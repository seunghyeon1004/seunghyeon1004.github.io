import assert from 'node:assert/strict';
import test from 'node:test';
import { clamp, getBeatIndex, progressToTime } from '../assets/js/scroll-film.js';

test('progress maps reversibly to the safe video range', () => {
  assert.equal(clamp(-1), 0);
  assert.equal(clamp(2), 1);
  assert.equal(progressToTime(0.5, 15.041667, 0.045), 7.4983335);
  assert.equal(progressToTime(1, 15.041667, 0.045), 14.996667);
});

test('beat index follows six thresholds and clears for the finale', () => {
  const thresholds = [0.075, 0.205, 0.335, 0.465, 0.595, 0.725];
  assert.equal(getBeatIndex(0.06, thresholds, 0.86), -1);
  assert.equal(getBeatIndex(0.34, thresholds, 0.86), 2);
  assert.equal(getBeatIndex(0.75, thresholds, 0.86), 5);
  assert.equal(getBeatIndex(0.9, thresholds, 0.86), -1);
});
