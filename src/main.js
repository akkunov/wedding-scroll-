import './style.css';
import * as T from 'three';
import { createCouple, createLocations } from './sculpture.js';
import { clamp, sceneState } from './scroll.js';

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const sections=[...document.querySelectorAll('[data-chapter]')];
const dots=[...document.querySelectorAll('.chapter-nav a')];
const progressBar=document.querySelector('#progress');
const nav=document.querySelector('#navigation');
const menu=document.querySelector('#menu-toggle');
function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');}
menu.addEventListener('click',()=>{nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden));menu.setAttribute('aria-label',nav.hidden?'Открыть меню':'Закрыть меню');});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.addEventListener('click',event=>{if(!nav.hidden&&!nav.contains(event.target)&&!menu.contains(event.target))closeMenu();});
const dialog=document.querySelector('#rsvp-dialog');
document.querySelector('#rsvp-open').addEventListener('click',()=>dialog.showModal());
document.querySelector('#rsvp-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelector('#rsvp-form').addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(event.currentTarget);const guest=String(data.get('guest')??'').trim();
  if(!guest){document.querySelector('[name="guest"]').focus();return;}
  const status=document.querySelector('#form-status');
  try{localStorage.setItem('ivory-wedding-demo-rsvp',JSON.stringify({guest,count:Number(data.get('count'))}));status.textContent='Тестовый ответ сохранён в этом браузере. Спасибо!';}
  catch{status.textContent='Браузер запретил локальное сохранение. Ответ не сохранён.';}
});
try{const saved=JSON.parse(localStorage.getItem('ivory-wedding-demo-rsvp'));if(saved&&typeof saved.guest==='string'){document.querySelector('[name="guest"]').value=saved.guest.slice(0,80);document.querySelector('[name="count"]').value=String(clamp(Number(saved.count)||1,1,4));}}catch{/* Local storage is optional. */}

let targetProgress=0,active=0,renderFrame=()=>{};
function readScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  targetProgress=clamp(scrollY/Math.max(1,max));progressBar.style.transform=`scaleX(${targetProgress})`;
  // The active copy follows the section in view, independent of 3D smoothing.
  active=sections.reduce((current,section,index)=>section.getBoundingClientRect().top<innerHeight*.4?index:current,0);
  dots.forEach((dot,index)=>{if(index===active)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current');});
  renderFrame();
}
addEventListener('scroll',readScroll,{passive:true});

function initScene(){
  const host=document.querySelector('#scene');
  const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new T.Scene();scene.fog=new T.Fog('#f4eee5',9,22);
  const camera=new T.PerspectiveCamera(32,1,.1,35);
  scene.add(new T.HemisphereLight('#fff9eb','#beaa91',3));
  const sun=new T.DirectionalLight('#fff2d9',4);sun.position.set(-3,7,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-4;sun.shadow.normalBias=.035;scene.add(sun);
  const fill=new T.DirectionalLight('#fffaf3',1.2);fill.position.set(4,3,-2);scene.add(fill);
  const world=new T.Group();scene.add(world);
  const couple=createCouple();world.add(couple);
  const locations=createLocations();Object.values(locations).forEach(group=>world.add(group));
  const floor=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshStandardMaterial({color:'#eee4d4',roughness:1}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;world.add(floor);
  // Detached spark-like ivory petals add depth without a particle animation loop.
  const petals=new T.Group();world.add(petals);const petalGeo=new T.SphereGeometry(.018,6,4);const petalMat=new T.MeshStandardMaterial({color:'#fffaf1',roughness:.9});
  for(let i=0;i<35;i++){const m=new T.Mesh(petalGeo,petalMat);m.position.set(Math.sin(i*12.71)*2.7,.4+(i%13)*.24,Math.cos(i*8.14)*2);m.scale.set(1,.25,1.7);m.rotation.z=i;petals.add(m);}
  let current=targetProgress,frame=0,last=0,disposed=false;
  const target=new T.Vector3();
  function draw(now=0){
    frame=0;if(disposed||document.hidden)return;
    const delta=Math.min((now-last)/1000||1/60,.05);last=now;
    const moving=!reducedMotion.matches;
    current=moving?T.MathUtils.damp(current,targetProgress,7,delta):targetProgress;
    const state=sceneState(current);
    couple.rotation.y=moving?state.rotation:.22;
    const garden=moving?state.garden:(active===1?1:0),hall=moving?state.hall:(active>=2?1:0);
    // Move entire locations below the floor during transitions; no transparent draw-order artifacts.
    locations.base.position.y=-.16*garden-.1*hall;
    locations.garden.position.y=-5*(1-garden);locations.garden.visible=garden>.001;
    locations.hall.position.y=-5*(1-hall);locations.hall.visible=hall>.001;
    locations.garden.rotation.y=(1-garden)*.16;
    petals.rotation.y=moving?current*.35:0;
    const mobile=innerWidth<700;
    world.position.x=mobile?0:1.15;
    const short=innerHeight<700;
    camera.position.set(mobile?0:.7,mobile?3:2.7,mobile?(short?9.4:8.8):8.7);
    // Aim above the model to reserve the top third for readable text on mobile.
    target.set(mobile?0:.3,mobile?2.02:1.45,0);camera.lookAt(target);
    renderer.render(scene,camera);
    if(Math.abs(current-targetProgress)>.0001)frame=requestAnimationFrame(draw);
  }
  renderFrame=()=>{if(!frame&&!document.hidden&&!disposed)frame=requestAnimationFrame(draw);};
  function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderFrame();}
  addEventListener('resize',resize);reducedMotion.addEventListener('change',renderFrame);
  document.addEventListener('visibilitychange',()=>{last=0;renderFrame();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();disposed=true;cancelAnimationFrame(frame);document.querySelector('#scene-fallback').hidden=false;document.body.classList.add('no-webgl');});
  resize();
}
try{initScene();}catch(error){console.warn('3D scene unavailable:',error.message);document.querySelector('#scene-fallback').hidden=false;document.body.classList.add('no-webgl');}
readScroll();
