export type Vec3 = [number,number,number];
export interface CameraPose { position:Vec3; target:Vec3 }
/** Sketchfab's orbit uses Z as the up axis; preserve the model's own initial framing. */
export function orbitCamera(camera:CameraPose,progress:number,reduced=false):CameraPose{
  const p=Math.max(0,Math.min(1,progress));
  if(reduced)return {position:[...camera.position],target:[...camera.target]};
  const [x,y,z]=camera.position.map((value,i)=>value-camera.target[i]);
  const angle=p*Math.PI*2,dolly=1-.08*Math.sin(p*Math.PI),cos=Math.cos(angle),sin=Math.sin(angle);
  return {position:[camera.target[0]+(x*cos-y*sin)*dolly,camera.target[1]+(x*sin+y*cos)*dolly,camera.target[2]+z*dolly],target:[...camera.target]};
}
