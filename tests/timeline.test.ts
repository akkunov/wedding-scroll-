import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSceneState, getPanelState } from '../src/scene/timeline.ts';
import { wedding } from '../src/config/wedding.ts';
import { createCouple, createLocations } from '../src/sculpture.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import App from '../src/App.tsx';
import * as T from 'three';
import { createDetailedCouple } from '../src/scene/detailedCouple.ts';
import { noteEvents } from '../src/audio/piano.ts';
import { orbitCamera } from '../src/scene/sketchfabCamera.ts';

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

test('detailed couple is full-body, finite, and includes portrait and wedding details',()=>{
  const couple=createDetailedCouple();couple.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(couple),size=bounds.getSize(new T.Vector3());assert.ok(size.y>2.2&&size.y<3);assert.ok(couple.getObjectByName('Elina-portrait'));assert.ok(couple.getObjectByName('Adilet-portrait'));assert.ok(couple.getObjectByName('dress-and-hair-pearls'));let triangles=0;couple.traverse(node=>{if(node instanceof T.Mesh){const p=node.geometry.attributes.position;for(const value of p.array)assert.ok(Number.isFinite(value));triangles+=(node.geometry.index?.count??p.count)/3;}});assert.ok(triangles>10000&&triangles<150000);
});
test('original music has bounded, valid notes and a finite duration',()=>{
  const {events,duration}=noteEvents();assert.ok(duration>30&&duration<90);assert.ok(events.length>100);for(const event of events){assert.ok(event.time>=0&&event.time<duration);assert.ok(event.duration>0);assert.ok(event.midi>=24&&event.midi<=100);assert.ok(event.gain>0&&event.gain<=.2);}
});

test('Sketchfab scroll orbit preserves target and completes a full turn',()=>{
  const camera={position:[3,5,7] as [number,number,number],target:[1,2,3] as [number,number,number]};
  assert.deepEqual(orbitCamera(camera,0).position,camera.position);assert.deepEqual(orbitCamera(camera,.5,true),camera);const end=orbitCamera(camera,1);end.position.forEach((x,i)=>assert.ok(Math.abs(x-camera.position[i])<1e-9));for(let i=0;i<101;i++){const pose=orbitCamera(camera,i/100);assert.ok(pose.position.every(Number.isFinite));assert.deepEqual(pose.target,camera.target);}
});
test('React includes the supplied Sketchfab model and visible author attribution',()=>{
  const html=renderToStaticMarkup(createElement(App));assert.ok(html.includes('Jack And Sally'));assert.ok(html.includes('svyART'));assert.ok(html.includes('84dfe9166e0946b7a5a6976408483ec1'));assert.ok(html.includes('Рассмотреть 3D'));
});
