import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createDetailedCouple } from './detailedCouple';
import { createLocations } from '../sculpture.js';
import { wedding } from '../config/wedding';
import { getSceneState } from './timeline';
export interface SceneController { update(progress:number,reduced:boolean):void; resize():void; dispose():void }
export function createScene(host:HTMLElement,onLost:()=>void):SceneController {
  const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,wedding.animation.maxPixelRatio));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
  const scene=new T.Scene();scene.fog=new T.Fog(wedding.appearance.background,10,23);
  const camera=new T.PerspectiveCamera(32,1,.1,40);
  scene.add(new T.HemisphereLight('#fff9eb','#beaa91',3));
  const sun=new T.DirectionalLight('#fff2d9',4);sun.position.set(-3,7,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-4;sun.shadow.normalBias=.035;scene.add(sun);
  const fill=new T.DirectionalLight('#fffaf3',1.1);fill.position.set(4,3,-2);scene.add(fill);
  const world=new T.Group();scene.add(world);const couple=new T.Group();world.add(couple);
  let closed=false;
  const release=(object:T.Object3D)=>{const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();object.traverse(node=>{if(node instanceof T.Mesh){geometries.add(node.geometry);(Array.isArray(node.material)?node.material:[node.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());};
  new GLTFLoader().load(`${import.meta.env.BASE_URL}${wedding.model.url}`,gltf=>{if(closed){release(gltf.scene);return;}gltf.scene.traverse(node=>{if(node instanceof T.Mesh){node.castShadow=true;node.receiveShadow=true;}});couple.add(gltf.scene);renderer.render(scene,camera);},undefined,()=>{if(!closed){couple.add(createDetailedCouple());renderer.render(scene,camera);}});
  const locations=createLocations();Object.values(locations).forEach(group=>world.add(group));
  const floor=new T.Mesh(new T.PlaneGeometry(80,80),new T.MeshStandardMaterial({color:'#eee4d4',roughness:1}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;world.add(floor);
  const target=new T.Vector3();let lost=false;
  const handleLost=(event:Event)=>{event.preventDefault();lost=true;onLost();};
  renderer.domElement.addEventListener('webglcontextlost',handleLost);
  return {
    resize(){const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix();},
    update(progress,reduced){
      if(lost)return;
      const s=getSceneState(progress),mobile=host.clientWidth<700;
      couple.rotation.y=.22+(reduced?0:s.rotation*wedding.animation.rotation);
      const garden=reduced?(s.chapter===1?1:0):s.garden,hall=reduced?(s.chapter>=2?1:0):s.hall;
      locations.base.position.y=-.15*garden;
      locations.garden.position.y=-5*(1-garden);locations.garden.position.z=(1-garden)*-.65;locations.garden.rotation.y=(1-garden)*.12;locations.garden.visible=garden>.001;
      locations.hall.position.y=-5*(1-hall);locations.hall.position.z=(1-hall)*-.5;locations.hall.visible=hall>.001;
      world.position.x=mobile?0:1.25;
      // Dolly and a small camera arc add depth while the static couple completes one turn.
      const arc=reduced?0:Math.sin(progress*Math.PI*2)*.22;
      camera.position.set((mobile?0:.75)+arc,2.95, (mobile?8.9:8.6)-(reduced?0:s.cameraZoom));
      target.set(mobile?0:.25,mobile?1.97:1.47,0);camera.lookAt(target);
      renderer.render(scene,camera);
    },
    dispose(){
      closed=true;renderer.domElement.removeEventListener('webglcontextlost',handleLost);
      const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();
      scene.traverse(object=>{if(object instanceof T.Mesh){geometries.add(object.geometry);const ms=Array.isArray(object.material)?object.material:[object.material];ms.forEach(m=>materials.add(m));}});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();
    },
  };
}
