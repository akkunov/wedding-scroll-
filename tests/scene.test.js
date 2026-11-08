import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sceneState } from '../src/scroll.js';
import { createCouple, createLocations } from '../src/sculpture.js';
test('scene transitions are finite, bounded, and preserve a complete rotation',()=>{
  for(let i=-10;i<=110;i++){const s=sceneState(i/100);for(const key of ['rotation','garden','hall','chapter'])assert.ok(Number.isFinite(s[key]));assert.ok(s.garden>=0&&s.garden<=1);assert.ok(s.hall>=0&&s.hall<=1);}
  assert.equal(sceneState(0).hall,0);assert.equal(sceneState(1).hall,1);assert.ok(sceneState(.4).garden>.9);assert.ok(Math.abs(sceneState(1).rotation-sceneState(0).rotation-Math.PI*2)<1e-9);
});
test('all scene geometries have finite vertices and valid bounding boxes',()=>{
  const objects=[createCouple(),...Object.values(createLocations())];let meshes=0;
  for(const root of objects){root.updateMatrixWorld(true);root.traverse(node=>{if(!node.isMesh)return;meshes++;const p=node.geometry.attributes.position;for(const value of p.array)assert.ok(Number.isFinite(value));if(node.isInstancedMesh)for(const value of node.instanceMatrix.array)assert.ok(Number.isFinite(value));node.geometry.computeBoundingBox();assert.ok(!node.geometry.boundingBox.isEmpty());});}
  assert.ok(meshes>70);
});
