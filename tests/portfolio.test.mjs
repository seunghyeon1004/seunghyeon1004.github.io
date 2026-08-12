import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeLanguage } from '../assets/js/portfolio.js';

test('language normalization supports Korean and English only', () => {
  assert.equal(normalizeLanguage('ko-KR'), 'ko');
  assert.equal(normalizeLanguage('en-US'), 'en');
  assert.equal(normalizeLanguage('ja-JP'), 'en');
});
