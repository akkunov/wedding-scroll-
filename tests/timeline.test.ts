import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSceneState, getPanelState } from '../src/scene/timeline.ts';
import { wedding } from '../src/config/wedding.ts';
import { createCouple, createLocations } from '../src/sculpture.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import App from '../src/App.tsx';

test('timeline is bounded and rotates one full turn',()=>{
  for(let i=-10;i<=110;i++){const s=getSceneState(i/100);assert.ok(s.garden>=0&&s.garden<=1);assert.ok(s.hall>=0&&s.hall<=1);assert.ok(Number.isFinite(s.rotation));}
  assert.equal(getSceneState(0).rotation,0);assert.equal(getSceneState(1).rotation,1);assert.ok(getSceneState(.35).garden>.9);assert.equal(getSceneState(1).hall,1);
});
test('each chapter has a readable panel at its anchor, including reduced motion',()=>{
  for(let i=0;i<4;i++){assert.equal(getSceneState(i/3).chapter,i);assert.equal(getPanelState(i/3,i).opacity,1);assert.equal(getPanelState(i/3,i,true).opacity,1);assert.equal(getPanelState(i/3,i,true).translateY,0);}
});
test('scene geometry and instance transforms are finite',()=>{
  for(const root of [createCouple(),...Object.values(createLocations())])root.traverse(node=>{if('isMesh' in node&&node.isMesh){const mesh=node as import('three').Mesh;for(const x of mesh.geometry.attributes.position.array)assert.ok(Number.isFinite(x));}});
});
test('React renders configured names, schedule, navigation and dialog',()=>{
  const html=renderToStaticMarkup(createElement(App));assert.ok(html.includes(wedding.bride));assert.ok(!html.includes('Алина'));assert.ok(html.includes('18:00'));assert.ok(html.includes('id="rsvp"'));assert.ok(html.includes('id="rsvp-title"'));assert.ok(html.includes('inert=""'));
});
