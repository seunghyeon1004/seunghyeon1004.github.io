import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('homepage exposes the approved sections and media', () => {
  for (const id of ['scroll-story', 'scroll-film', 'selected-work', 'outcomes', 'capabilities', 'archive', 'contact']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /assets\/media\/portfolio-universe-720p\.mp4/);
  assert.match(html, /SEUNGHYEON/);
});

test('homepage exposes two truthful research and business outcomes', () => {
  const outcomes = [...html.matchAll(/<article[^>]+data-outcome=["']([^"']+)["']/g)]
    .map(match => match[1]);

  assert.deepEqual(outcomes, ['research', 'business']);
  assert.match(html, /id=["']outcomes["']/);
  assert.match(html, /OUTCOMES \/ 02/);
  assert.match(html, /Submission received · Technical check as of 10 Aug 2026/);
  assert.match(html, /stock-ai-negative-results-reproducibility/);
  assert.match(html, /data-ko=["']코드 · 파생 데이터 · 체크섬 · 그림 · 인용 메타데이터["']/);
  assert.match(html, /data-en=["']Code · Derived data · Checksums · Figures · Citation metadata["']/);

  const researchLink = html.match(/<a class=["']text-link outcome-band__link["'][^>]*>/)?.[0];
  const liveOffer = html.match(/<section[^>]+data-offer-status=["']live["'][\s\S]*?<\/section>/)?.[0];
  const reviewOffer = html.match(/<section[^>]+data-offer-status=["']under-review["'][\s\S]*?<\/section>/)?.[0];

  assert.ok(researchLink, 'research outcome link exists');
  assert.match(researchLink, /target=["']_blank["']/);
  assert.match(researchLink, /rel=["']noopener noreferrer["']/);
  assert.ok(liveOffer, 'live offer exists');
  assert.match(liveOffer, /https:\/\/kmong\.com\/gig\/789934/);
  assert.match(liveOffer, /target=["']_blank["']/);
  assert.match(liveOffer, /rel=["']noopener noreferrer["']/);
  assert.ok(reviewOffer, 'under-review offer exists');
  assert.equal((reviewOffer.match(/<a\b/g) || []).length, 1);
  assert.match(reviewOffer, /href=["']#contact["']/);
  assert.doesNotMatch(reviewOffer, /https?:\/\//);
  assert.doesNotMatch(html, /kmong\.com\/gig\/795856/);
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
