import * as T from 'three';
/** Artistic full-body interpretation of the supplied selfie, not photogrammetry. */
const palette={skin:'#d9ae95',blush:'#c28b7c',lips:'#b58579',hair:'#302823',hairLight:'#46382c',ivory:'#fcf6ea',suit:'#e9decd',seam:'#cbb99f',gold:'#bc9a68',white:'#eee7dc',iris:'#362a25'};
export function createDetailedCouple(){
  const root=new T.Group();root.name='Adilet-and-Elina-full-body';root.userData={description:'Stylized wedding couple, artistically interpreted from one selfie. Body, hidden sides and clothing are imagined.',source:'Procedural sculpting; no facial texture or original photo embedded.'};
  const mats=Object.fromEntries(Object.entries(palette).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='ivory'?.5:.76,metalness:k==='gold'?.55:0})])) as Record<keyof typeof palette,T.MeshStandardMaterial>;
  const ball=new T.SphereGeometry(1,24,18),smallBall=new T.SphereGeometry(1,12,8);
  const beadTransforms:T.Matrix4[]=[];
  function oval(parent:T.Object3D,mat:T.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number,small=false){const mesh=new T.Mesh(small?smallBall:ball,mat);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;parent.add(mesh);return mesh;}
  function solid(parent:T.Object3D,geometry:T.BufferGeometry,mat:T.Material){const m=new T.Mesh(geometry,mat);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function profile(parent:T.Object3D,mat:T.Material,points:number[][]){return solid(parent,new T.LatheGeometry(points.map(p=>new T.Vector2(p[0],p[1])),64),mat);}
  function line(parent:T.Object3D,mat:T.Material,points:number[][],radius:number,segments=12){return solid(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p as [number,number,number]))),segments,radius,5,false),mat);}
  function bead(parent:T.Object3D,x:number,y:number,z:number,r=.009){const dummy=new T.Object3D();dummy.position.set(x,y,z);dummy.scale.setScalar(r);dummy.updateMatrix();parent.updateWorldMatrix(true,false);beadTransforms.push(dummy.matrix.clone().premultiply(parent.matrixWorld));}
  function patch(parent:T.Object3D,mat:T.Material,points:number[][]){const shape=new T.Shape(points.map(p=>new T.Vector2(p[0],p[1])));const m=solid(parent,new T.ShapeGeometry(shape),mat);return m;}
  const platform=solid(root,new T.CylinderGeometry(1.13,1.16,.14,80),mats.seam);platform.position.y=.07;
  const cap=solid(root,new T.CylinderGeometry(1.13,1.13,.025,80),mats.ivory);cap.position.y=.151;
  for(let i=0;i<3;i++){const ring=solid(root,new T.TorusGeometry(1.143,.0035,5,80),mats.gold);ring.rotation.x=Math.PI/2;ring.position.y=.035+i*.037;}
  function head(parent:T.Group,female:boolean){
    const group=new T.Group();group.name=female?'Elina-portrait':'Adilet-portrait';parent.add(group);group.position.set(0,female?1.99:2.03,.01);group.rotation.y=female?.1:-.08;
    // A softened jaw and cheek contour, rather than an unmodified spherical head.
    const geo=ball.clone(),p=geo.attributes.position;
    const sx=female?.161:.177,sy=female?.216:.21,sz=female?.149:.163;
    for(let i=0;i<p.count;i++){const y=p.getY(i),x=p.getX(i),z=p.getZ(i);const jaw=y<-.1?1-(Math.abs(y)-.1)*.23:1;p.setXYZ(i,x*sx*jaw,y*sy,z*sz*(z>0?1.02:1));}geo.computeVertexNormals();solid(group,geo,mats.skin);
    for(const side of [-1,1]){
      oval(group,mats.skin,side*sx*.99,-.015,-.004,.027,.051,.027,true);
      oval(group,mats.blush,side*sx*1.015,-.014,.012,.013,.028,.01,true);

      const eyeX=side*(female?.063:.071),eyeY=.027,eyeZ=female?.143:.153;
      const eyeWidth=female?.041:.042,eyeHeight=female?.014:.012;
      const shape=new T.Shape();shape.moveTo(-eyeWidth,0);shape.quadraticCurveTo(0,eyeHeight*1.7,eyeWidth,.002);shape.quadraticCurveTo(0,-eyeHeight*1.25,-eyeWidth,0);
      const eye=solid(group,new T.ShapeGeometry(shape,12),mats.white);eye.position.set(eyeX,eyeY,eyeZ);eye.rotation.y=side*.2;
      oval(group,mats.iris,eyeX,eyeY+.001,eyeZ+.005,.012,.012,.004,true);
      oval(group,mats.hair,eyeX,eyeY+.001,eyeZ+.009,.006,.007,.002,true);
      oval(group,mats.ivory,eyeX-.003,eyeY+.005,eyeZ+.011,.0025,.0025,.001,true);
      line(group,mats.blush,[[eyeX-eyeWidth,eyeY,eyeZ],[eyeX,eyeY+eyeHeight,eyeZ+.003],[eyeX+eyeWidth,eyeY+.002,eyeZ]],.0035);
      line(group,mats.skin,[[eyeX-eyeWidth,eyeY-.003,eyeZ],[eyeX,eyeY-eyeHeight*.8,eyeZ+.002],[eyeX+eyeWidth,eyeY+.001,eyeZ]],.004);
      line(group,mats.hair,[[eyeX-eyeWidth*.93,eyeY+.045,eyeZ-.003],[eyeX-.006,eyeY+.055,eyeZ+.004],[eyeX+eyeWidth*.9,eyeY+.042,eyeZ-.004]],female?.007:.009);
      if(female){line(group,mats.hair,[[eyeX-eyeWidth,eyeY,eyeZ+.002],[eyeX,eyeY+eyeHeight+.001,eyeZ+.005],[eyeX+eyeWidth,eyeY+.002,eyeZ+.002]],.0025);}
    }
    // Nose bridge, tip, wings, philtrum and subtly shaped lips.
    oval(group,mats.skin,0,.001,.152,.021,.058,.019);
    oval(group,mats.skin,0,-.037,female?.172:.185,female?.028:.032,.022,.025);
    for(const side of [-1,1]){oval(group,mats.skin,side*.025,-.042,.163,.018,.013,.017,true);oval(group,mats.blush,side*.019,-.05,.176,.008,.0035,.004,true);}
    const mouthZ=female?.147:.16;
    line(group,mats.lips,[[-.047,-.093,mouthZ],[-.022,-.087,mouthZ+.012],[0,-.09,mouthZ+.015],[.022,-.086,mouthZ+.012],[.047,-.092,mouthZ]],female?.006:.0045,20);
    oval(group,mats.lips,0,-.099,mouthZ+.007,female?.036:.034,female?.01:.007,.009);

    // Hair cap follows the upper and rear head; curves form visible combed locks.
    const hairGeo=new T.SphereGeometry(1,32,20,0,Math.PI*2,0,female?1.13:1.35);
    const cap=solid(group,hairGeo,mats.hair);cap.scale.set(sx*1.04,sy*1.04,sz*1.07);cap.position.set(0,.024,-.012);cap.rotation.z=female?-.05:-.1;
    if(female){
      oval(group,mats.hair,0,.008,-.121,.148,.164,.056);
      oval(group,mats.hair,0,-.106,-.185,.096,.072,.074);
      for(let i=0;i<18;i++){const a=i/18*Math.PI*2;line(group,i%3?mats.hair:mats.hairLight,[[Math.sin(a)*.086,-.11+Math.cos(a)*.06,-.203],[Math.sin(a+.6)*.08,-.107+Math.cos(a+.6)*.06,-.244],[Math.sin(a+1.3)*.062,-.106+Math.cos(a+1.3)*.05,-.223]],.0045);}
      for(let i=0;i<25;i++){
        const x=-.145+i*.012,scale=Math.sqrt(Math.max(.05,1-(x/(sx*1.06))**2));const points:number[][]=[];
        for(let j=0;j<17;j++){const a=.94-j/16*2.2;points.push([x,sy*1.07*Math.cos(a)*scale+.024,sz*1.1*Math.sin(a)*scale-.012]);}
        line(group,i%5?mats.hair:mats.hairLight,points,.002,20);
      }
      for(const side of [-1,1]){line(group,mats.hair,[[side*.14,.10,.035],[side*.164,-.08,.026],[side*.145,-.21,-.005]],.008,18);oval(group,mats.gold,side*.17,-.065,.024,.008,.017,.007,true);oval(group,mats.ivory,side*.17,-.087,.024,.011,.015,.009,true);}
      for(let i=0;i<10;i++)bead(group,-.11+i*.024,.13+Math.sin(i/9*Math.PI)*.05,-.07,.008);
    }else{
      for(let i=0;i<29;i++){
        const x=-.155+i*.011,scale=Math.sqrt(Math.max(.05,1-(x/(sx*1.065))**2));const points:number[][]=[];
        for(let j=0;j<17;j++){const a=1.03-j/16*2.12;points.push([x-.012*Math.sin(j/16*Math.PI),sy*1.075*Math.cos(a)*scale+.024,sz*1.1*Math.sin(a)*scale-.012]);}
        line(group,i%5?mats.hair:mats.hairLight,points,.003,20);
      }
      for(const side of [-1,1])line(group,mats.hair,[[side*.16,.09,.007],[side*.174,.005,-.001],[side*.162,-.033,-.012]],.012);
    }
    return group;
  }
  const bride=new T.Group();bride.name='Elina-ivory-wedding-dress';bride.position.set(-.36,.17,.045);bride.rotation.y=.12;root.add(bride);
  const dress=profile(bride,mats.ivory,[[.48,.02],[.51,.06],[.48,.14],[.40,.36],[.30,.68],[.19,.96],[.14,1.12],[.15,1.24],[.205,1.43],[.215,1.52],[.17,1.56],[0,1.56]]);dress.scale.z=.86;
  const dp=dress.geometry.attributes.position;
  for(let i=0;i<dp.count;i++){const x=dp.getX(i),y=dp.getY(i),z=dp.getZ(i);const wave=Math.cos(Math.atan2(z,x)*20)*.035*Math.max(0,1-y/1.4);dp.setXYZ(i,x*(1+wave),y,z*(1+wave));}dress.geometry.computeVertexNormals();
  // Silk train at the back, pleated and swept gently over the pedestal.
  const trainGeo=new T.PlaneGeometry(.72,.8,24,24),tp=trainGeo.attributes.position;
  for(let i=0;i<tp.count;i++){const x=tp.getX(i),v=tp.getY(i);tp.setXYZ(i,x*(1+.2*(.4-v)),.025+Math.cos(x*28)*.009+(.4+v)*.09,-.36-(.4-v));}trainGeo.computeVertexNormals();solid(bride,trainGeo,new T.MeshStandardMaterial({color:palette.ivory,side:T.DoubleSide,roughness:.65}));
  oval(bride,mats.skin,0,1.62,.005,.215,.105,.104);oval(bride,mats.skin,0,1.773,.004,.058,.138,.065);
  for(const side of [-1,1]){line(bride,mats.ivory,[[side*.18,1.48,.095],[side*.17,1.64,.061],[side*.13,1.68,-.07]],.024);line(bride,mats.seam,[[side*.11,1.18,.10],[side*.14,1.35,.12],[side*.09,1.51,.13]],.0028,20);}
  const brideHead=head(bride,true);brideHead.rotation.z=-.05;
  const veilGeo=new T.PlaneGeometry(.51,1.63,16,30),vp=veilGeo.attributes.position;
  for(let i=0;i<vp.count;i++){const x=vp.getX(i),v=vp.getY(i);vp.setXYZ(i,x*(1+(.815-v)*.35),v,Math.cos(x*25)*.018-(.815-v)*.07);}veilGeo.computeVertexNormals();
  const veil=solid(bride,veilGeo,new T.MeshStandardMaterial({color:'#fffaf1',transparent:true,opacity:.3,side:T.DoubleSide,roughness:1,depthWrite:false}));veil.position.set(0,1.23,-.19);veil.castShadow=false;
  for(let i=0;i<68;i++){const a=i/68*Math.PI*2;bead(bride,Math.sin(a)*.492,.065,Math.cos(a)*.423,.006);}
  for(let i=0;i<36;i++){const a=i/36*Math.PI*2;bead(bride,Math.sin(a)*.148,1.15,Math.cos(a)*.127,.006);}
  for(const side of [-1,1]){for(let i=0;i<18;i++){const y=1.23+i*.017;bead(bride,side*(.07+.025*Math.sin(i*.45)),y,.135,.004);}}
  line(bride,mats.skin,[[-.2,1.63,0],[-.26,1.35,.09],[-.06,1.23,.27]],.052,20);
  line(bride,mats.skin,[[.2,1.63,0],[.25,1.35,.14],[.43,1.23,.23]],.05,20);
  function hand(parent:T.Object3D,x:number,y:number,z:number,side:number){oval(parent,mats.skin,x,y,z,.041,.065,.025);for(let i=0;i<4;i++){const fx=x+(i-1.5)*.015;line(parent,mats.skin,[[fx,y-.02,z],[fx+side*.009,y-.061,z+.006],[fx+side*.012,y-.075+(i%3)*.005,z+.002]],.0075,8);oval(parent,mats.ivory,fx+side*.01,y-.065,z+.009,.004,.008,.0015,true);}oval(parent,mats.skin,x+side*.043,y+.005,z+.006,.013,.032,.012,true);}
  hand(bride,.43,1.21,.23,-1);hand(bride,-.06,1.22,.27,1);
  // Small sculpted bouquet of white roses, held at the waist.
  const bouquet=new T.Group();bouquet.position.set(-.075,1.32,.31);bride.add(bouquet);
  for(let i=0;i<9;i++){const a=i*2.39996,r=.1*Math.sqrt(i/9);const x=Math.cos(a)*r,y=Math.sin(a)*r;line(bouquet,mats.seam,[[0,-.19,-.03],[x,y,0]],.005,6);for(let layer=0;layer<3;layer++)for(let j=0;j<5;j++){const b=j*Math.PI*.4+layer*.45;const petal=oval(bouquet,mats.ivory,x+Math.cos(b)*(.023-layer*.005),y+Math.sin(b)*(.023-layer*.005),.012+layer*.012,.023-layer*.003,.019-layer*.002,.007,true);petal.rotation.z=b;}}
  const ribbon=solid(bouquet,new T.TorusGeometry(.023,.007,6,16),mats.gold);ribbon.position.y=-.15;
  const groom=new T.Group();groom.name='Adilet-ivory-three-piece-suit';groom.position.set(.36,.17,-.015);groom.rotation.y=-.12;root.add(groom);
  for(const x of [-.10,.10]){line(groom,mats.suit,[[x,.13,0],[x,.55,-.01],[x,1.02,0]],.087,24);line(groom,mats.seam,[[x,.16,.088],[x,.57,.081],[x,.96,.08]],.002);const shoe=oval(groom,mats.hair,x,.055,.067,.092,.055,.17);shoe.name='dress-shoe';line(groom,mats.hairLight,[[x-.05,.078,.11],[x,.09,.145],[x+.05,.078,.11]],.003);}
  const torso=profile(groom,mats.suit,[[.205,.94],[.215,1.04],[.18,1.25],[.225,1.55],[.255,1.66],[.20,1.74],[0,1.74]]);torso.scale.z=.62;
  oval(groom,mats.ivory,0,1.58,.14,.115,.19,.024);
  const vest=patch(groom,mats.seam,[[-.105,1.65],[0,1.43],[.105,1.65],[.09,1.13],[0,1.08],[-.09,1.13]]);vest.position.z=.139;
  for(const side of [-1,1]){
    const lapel=patch(groom,mats.ivory,[[side*.07,1.75],[side*.205,1.65],[side*.145,1.53],[side*.19,1.52],[side*.02,1.27]]);lapel.position.z=.155;
    line(groom,mats.seam,[[side*.07,1.75,.16],[side*.205,1.65,.16],[side*.145,1.53,.16],[side*.19,1.52,.16],[side*.02,1.27,.16]],.002);
  }
  oval(groom,mats.skin,0,1.83,0,.065,.128,.066);head(groom,false);
  for(const side of [-1,1]){const collar=patch(groom,mats.ivory,[[0,1.83],[side*.09,1.77],[side*.07,1.63],[side*.015,1.72]]);collar.position.z=.159;}
  for(const side of [-1,1]){const bow=oval(groom,mats.gold,side*.037,1.73,.179,.04,.024,.015);bow.rotation.z=side*.16;}oval(groom,mats.gold,0,1.73,.193,.013,.018,.011,true);
  for(let i=0;i<5;i++)oval(groom,mats.gold,0,1.2+i*.075,.158,.009,.009,.005,true);
  oval(groom,mats.suit,-.235,1.62,0,.082,.09,.08);oval(groom,mats.suit,.235,1.62,0,.082,.09,.08);
  line(groom,mats.suit,[[-.235,1.64,0],[-.29,1.35,.06],[-.285,1.24,.22]],.073,22);hand(groom,-.285,1.19,.22,1);
  line(groom,mats.suit,[[.235,1.64,0],[.285,1.33,.01],[.25,1.04,.05]],.075,22);hand(groom,.25,1,.05,-1);
  for(const side of [-1,1]){for(let i=0;i<3;i++)oval(groom,mats.gold,side*.29,1.26+i*.025,.127,.006,.006,.004,true);line(groom,mats.seam,[[side*.14,1.19,.115],[side*.20,1.18,.10]],.004);}
  const pocket=patch(groom,mats.ivory,[[.10,1.49],[.12,1.53],[.14,1.50],[.155,1.54],[.18,1.49]]);pocket.position.z=.158;
  oval(groom,mats.ivory,-.136,1.54,.18,.023,.029,.02,true);line(groom,mats.gold,[[-.136,1.52,.17],[-.13,1.45,.16]],.003);
  // Batch tiny dress pearls into one draw call, with transforms baked into root coordinates.
  const pearls=new T.InstancedMesh(smallBall,mats.ivory,beadTransforms.length);
  beadTransforms.forEach((matrix,i)=>pearls.setMatrixAt(i,matrix));pearls.instanceMatrix.needsUpdate=true;pearls.name='dress-and-hair-pearls';root.add(pearls);
  root.updateMatrixWorld(true);
  return root;
}
