import * as T from 'three';

const ivory = new T.MeshStandardMaterial({ color: '#f8f1e5', roughness: .65 });
const suit = new T.MeshStandardMaterial({ color: '#dfcfb8', roughness: .88 });
const skin = new T.MeshStandardMaterial({ color: '#ddc3a4', roughness: .72 });
const hair = new T.MeshStandardMaterial({ color: '#8b725b', roughness: .95 });
const stone = new T.MeshStandardMaterial({ color: '#d9c8af', roughness: 1 });
const gold = new T.MeshStandardMaterial({ color: '#b89b74', metalness: .5, roughness: .35 });
const sphere = new T.SphereGeometry(1, 20, 16);
function mesh(geo, mat, parent, x=0,y=0,z=0) { const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
function ellipsoid(parent, mat, pos, scale) { const m=mesh(sphere,mat,parent,...pos);m.scale.set(...scale);return m; }
function lathe(parent, mat, profile, x=0,y=0,z=0) {return mesh(new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),48),mat,parent,x,y,z);}
function limb(parent,mat,a,b,r1=.065,r2=.055){const start=new T.Vector3(...a),end=new T.Vector3(...b),dir=end.clone().sub(start);const m=mesh(new T.CylinderGeometry(r2,r1,dir.length(),16),mat,parent);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());return m;}
function face(parent) {
  ellipsoid(parent,skin,[0,2.23,.025],[.17,.225,.16]);
  ellipsoid(parent,skin,[0,2.22,.175],[.027,.043,.035]);
  for(const x of [-.061,.061]) { const eye=ellipsoid(parent,hair,[x,2.26,.172],[.022,.007,.006]);eye.rotation.z=x>0?-.12:.12; }
  ellipsoid(parent,suit,[0,2.14,.171],[.035,.005,.005]);
}
export function createCouple() {
  const root=new T.Group();root.name='wedding-couple';
  mesh(new T.CylinderGeometry(1.12,1.16,.16,80),stone,root,0,.08,0);
  mesh(new T.CylinderGeometry(1.115,1.115,.025,80),ivory,root,0,.17,0);
  for(let i=0;i<3;i++){const ring=mesh(new T.TorusGeometry(1.135,.004,5,80),gold,root,0,.04+i*.035,0);ring.rotation.x=Math.PI/2;}
  const bride=new T.Group();bride.position.set(-.36,.18,.045);bride.rotation.y=.24;root.add(bride);
  const dress=lathe(bride,ivory,[[.49,0],[.52,.04],[.46,.17],[.37,.4],[.28,.72],[.18,1.02],[.145,1.17],[.19,1.4],[.22,1.57],[.16,1.64],[0,1.64]]);dress.scale.z=.85;
  // Fine radial pleats sculpted into the full skirt.
  const positions=dress.geometry.attributes.position;
  for(let i=0;i<positions.count;i++){const y=positions.getY(i),x=positions.getX(i),z=positions.getZ(i);const ripple=1+Math.cos(Math.atan2(z,x)*18)*.021*Math.max(0,1-y/1.25);positions.setX(i,x*ripple);positions.setZ(i,z*ripple);}
  dress.geometry.computeVertexNormals();
  ellipsoid(bride,skin,[0,1.72,.01],[.23,.13,.12]);
  limb(bride,skin,[0,1.72,0],[0,1.98,0],.07,.07);
  const head=new T.Group();head.position.y=-.13;head.rotation.z=-.1;bride.add(head);face(head);
  ellipsoid(head,hair,[0,2.36,-.035],[.175,.115,.155]);
  ellipsoid(head,hair,[0,2.24,-.135],[.15,.18,.08]);
  ellipsoid(head,hair,[0,2.19,-.22],[.11,.105,.1]);
  // A translucent veil, shaped as a falling ribbon behind her shoulders.
  const veilMat=new T.MeshStandardMaterial({color:'#fff9ee',transparent:true,opacity:.42,side:T.DoubleSide,roughness:1,depthWrite:false});
  const veilGeo=new T.PlaneGeometry(.52,1.52,14,24);const vp=veilGeo.attributes.position;
  for(let i=0;i<vp.count;i++){const x=vp.getX(i),y=vp.getY(i);vp.setZ(i,Math.cos(x*22)*.025+(y<0?-y*.12:0));}
  veilGeo.computeVertexNormals();const veil=mesh(veilGeo,veilMat,bride,0,1.29,-.22);veil.rotation.x=-.12;
  limb(bride,skin,[-.2,1.72,0],[-.26,1.38,.15]);limb(bride,skin,[-.26,1.38,.15],[-.06,1.26,.29],.052,.045);
  limb(bride,skin,[.2,1.72,0],[.29,1.43,.18]);limb(bride,skin,[.29,1.43,.18],[.42,1.3,.28],.052,.045);
  ellipsoid(bride,skin,[.42,1.3,.28],[.055,.07,.045]);
  const groom=new T.Group();groom.position.set(.35,.18,-.02);groom.rotation.y=-.2;root.add(groom);
  for(const x of [-.105,.105]){limb(groom,suit,[x,.12,0],[x,1.05,0],.09,.11);ellipsoid(groom,hair,[x,.065,.065],[.095,.064,.18]);}
  lathe(groom,suit,[[.19,.95],[.22,1.12],[.18,1.4],[.27,1.75],[.2,1.82],[0,1.82]]).scale.z=.62;
  ellipsoid(groom,ivory,[0,1.63,.135],[.105,.2,.025]);
  for(const x of [-1,1]){const lapel=mesh(new T.BoxGeometry(.075,.32,.025),ivory,groom,x*.105,1.62,.145);lapel.rotation.z=x*-.28;}
  ellipsoid(groom,gold,[0,1.71,.175],[.036,.024,.018]);
  limb(groom,skin,[0,1.8,0],[0,2.02,0],.072,.075);
  face(groom);ellipsoid(groom,hair,[0,2.39,-.018],[.18,.095,.16]);
  ellipsoid(groom,hair,[-.08,2.4,.06],[.12,.08,.1]);
  limb(groom,suit,[-.24,1.74,0],[-.32,1.4,.08],.075,.1);limb(groom,suit,[-.32,1.4,.08],[-.29,1.29,.23],.065,.073);
  ellipsoid(groom,skin,[-.29,1.26,.25],[.055,.09,.045]);
  limb(groom,suit,[.24,1.74,0],[.29,1.35,.02],.075,.1);limb(groom,suit,[.29,1.35,.02],[.25,1.05,.08],.065,.073);
  ellipsoid(groom,skin,[.25,1.02,.08],[.055,.09,.045]);
  for(const y of [1.23,1.36])ellipsoid(groom,gold,[0,y,.142],[.016,.016,.009]);
  return root;
}
export function createArch(width=3.4,height=4) {
  const shape=new T.Shape();const w=width/2,r=w,base=height-r;
  shape.moveTo(-w,0);shape.lineTo(-w,base);shape.absarc(0,base,r,Math.PI,0,true);shape.lineTo(w,0);shape.lineTo(w-.21,0);shape.lineTo(w-.21,base);shape.absarc(0,base,r-.21,0,Math.PI,false);shape.lineTo(-w+.21,0);shape.closePath();
  return new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:2,steps:1}),ivory);
}
function flowers(parent,x,y,z,count=15){
  const petals=new T.InstancedMesh(sphere,ivory,count*5);
  const centers=new T.InstancedMesh(sphere,gold,count);
  const transform=new T.Object3D();
  for(let i=0;i<count;i++){const a=i*2.39996,r=.14*Math.sqrt(i/count),fx=x+Math.cos(a)*r,fy=y+Math.sin(a)*r;
    for(let p=0;p<5;p++){const b=p*Math.PI*.4;transform.position.set(fx+Math.cos(b)*.042,fy+Math.sin(b)*.042,z+Math.sin(i)*.04);transform.scale.set(.04,.05,.025);transform.updateMatrix();petals.setMatrixAt(i*5+p,transform.matrix);}
    transform.position.set(fx,fy,z+.025);transform.scale.set(.015,.015,.015);transform.updateMatrix();centers.setMatrixAt(i,transform.matrix);
  }
  petals.instanceMatrix.needsUpdate=true;centers.instanceMatrix.needsUpdate=true;parent.add(petals,centers);
}
export function createLocations(){
  const base=new T.Group();const arch=createArch();arch.position.set(0,0,-1.3);base.add(arch);
  const garden=new T.Group();
  for(let i=0;i<3;i++){const a=createArch(3.8+i*.4,4.25+i*.25);a.position.set(0,0,-2.1-i*1.6);garden.add(a);}
  for(const side of [-1,1]){for(let i=0;i<4;i++)flowers(garden,side*1.72,.7+i*.7,-1.1,9);}
  const hall=new T.Group();
  for(const side of [-1,1]){
    for(let j=0;j<2;j++){const x=side*(1.75+j*.8),z=-.8-j*1.8;mesh(new T.CylinderGeometry(.43,.43,.085,32),ivory,hall,x,.78,z);mesh(new T.CylinderGeometry(.045,.075,.75,12),stone,hall,x,.36,z);lathe(hall,ivory,[[.1,0],[.16,.12],[.09,.28],[.1,.3]],x,.82,z);flowers(hall,x,1.24,z,15);}
    for(let j=0;j<3;j++){const x=side*(.8+j*.55),y=3.3+(j%2)*.3,z=-1.4-j*.5;mesh(new T.CylinderGeometry(.12,.16,.3,16),new T.MeshStandardMaterial({color:'#ffedcd',emissive:'#e8c18a',emissiveIntensity:.35,roughness:.9}),hall,x,y,z);limb(hall,gold,[x,y+.15,z],[x,5,z],.006,.006);}
  }
  return {base,garden,hall};
}
