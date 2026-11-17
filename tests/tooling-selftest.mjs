// Self-test for lint gate patterns (run in CI, no dependencies).
import assert from 'node:assert/strict';
import { blocksPinchZoom, countLines } from '../scripts/lint.mjs';

const meta = (c) => `<meta name="viewport" content="${c}">`;
assert.equal(blocksPinchZoom(meta('width=device-width, initial-scale=1')), false);
assert.equal(blocksPinchZoom(meta('width=device-width, initial-scale=1, maximum-scale=1')), true);
assert.equal(blocksPinchZoom(meta('maximum-scale=0.5')), true);
assert.equal(blocksPinchZoom(meta('maximum-scale=1.5')), true);
assert.equal(blocksPinchZoom(meta('maximum-scale=2')), true);
assert.equal(blocksPinchZoom(meta('maximum-scale=10')), true);
assert.equal(blocksPinchZoom(meta('user-scalable=no')), true);
assert.equal(blocksPinchZoom(meta('user-scalable=0')), true);
assert.equal(blocksPinchZoom(meta('USER-SCALABLE=NO')), true);
assert.equal(blocksPinchZoom(meta('user-scalable=yes')), false);
assert.equal(blocksPinchZoom('<html><head></head></html>'), false);
// Regression fixtures from frontend re-review (unquoted attrs, spaces around '=', second meta).
assert.equal(blocksPinchZoom('<meta name=viewport content="user-scalable=no">'), true);
assert.equal(blocksPinchZoom('<meta name="viewport" content="user-scalable = no">'), true);
assert.equal(blocksPinchZoom('<meta name="viewport" content="maximum-scale = 2">'), true);
assert.equal(blocksPinchZoom('<meta NAME=VIEWPORT CONTENT="USER-SCALABLE=NO">'), true);
assert.equal(blocksPinchZoom('<meta name = viewport content = "width=device-width, maximum-scale=1">'), true);
assert.equal(blocksPinchZoom('<meta name="viewport" content="width=device-width"><meta name="viewport" content="maximum-scale=1">'), true);
assert.equal(blocksPinchZoom('<meta name="viewport" content="width=device-width"><meta name="viewport" content="initial-scale=1">'), false);
assert.equal(blocksPinchZoom('<meta charset="UTF-8"><meta name=viewport content="width=device-width, initial-scale=1">'), false);
assert.equal(countLines('a\nb\n'), 2);
assert.equal(countLines('a\nb'), 2);
assert.equal(countLines('x\n'.repeat(300)), 300);
console.log('TOOLING-SELFTEST: LULUS (22 assertions)');