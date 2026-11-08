import { mkdir,writeFile } from 'node:fs/promises';
import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { createDetailedCouple } from '../src/scene/detailedCouple.ts';
// Exporter uses the browser FileReader interface to assemble binary blobs.
class NodeFileReader {
  result:ArrayBuffer|string|null=null;onloadend:((event:unknown)=>void)|null=null;
  async readAsArrayBuffer(blob:Blob){this.result=await blob.arrayBuffer();this.onloadend?.({target:this});}
  async readAsDataURL(blob:Blob){this.result=`data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`;this.onloadend?.({target:this});}
}
Object.assign(globalThis,{FileReader:NodeFileReader});
const model=createDetailedCouple();
// One draw call per material for the static sculpture; keep pearl instancing.
model.updateMatrixWorld(true);
const optimized=new T.Group();optimized.name=model.name;optimized.userData=model.userData;
const batches=new Map<T.Material,T.BufferGeometry[]>();
model.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  if(object instanceof T.InstancedMesh){const copy=object.clone();copy.applyMatrix4(object.matrixWorld);optimized.add(copy);return;}
  const material=object.material as T.Material;
  const geometry=object.geometry.clone().applyMatrix4(object.matrixWorld);
  if(!batches.has(material))batches.set(material,[]);
  batches.get(material)!.push(geometry);
});
for(const [material,geometries] of batches){const merged=mergeGeometries(geometries);if(!merged)throw new Error('Cannot merge sculpture geometry');optimized.add(new T.Mesh(merged,material));}
const output=await new GLTFExporter().parseAsync(optimized,{binary:true,onlyVisible:true});
if(!(output instanceof ArrayBuffer))throw new Error('Expected binary GLB');
await mkdir('public/models',{recursive:true});
await writeFile('public/models/adilet-elina.glb',Buffer.from(output));
console.log(`Exported full-body couple: ${(output.byteLength/1024).toFixed(0)} KB`);
