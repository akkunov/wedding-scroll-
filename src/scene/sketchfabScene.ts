import { wedding } from '../config/wedding';
import { orbitCamera, type CameraPose, type Vec3 } from './sketchfabCamera';
export type ViewerStatus='loading'|'ready'|'unavailable';
interface ViewerApi{
  start(callback?:()=>void):void;stop():void;
  addEventListener(event:'viewerready',callback:()=>void):void;
  getCameraLookAt(callback:(error:unknown,camera:CameraPose)=>void):void;
  setCameraLookAt(position:Vec3,target:Vec3,duration?:number):void;
  setBackground(options:{color:Vec3}):void;
}
interface ViewerClient{init(uid:string,options:Record<string,unknown>):void}
type ViewerConstructor=new(version:string,iframe:HTMLIFrameElement)=>ViewerClient;
declare global{interface Window{Sketchfab?:ViewerConstructor}}
let sdkPromise:Promise<ViewerConstructor>|undefined;
function loadSdk(){
  if(window.Sketchfab)return Promise.resolve(window.Sketchfab);
  if(sdkPromise)return sdkPromise;
  sdkPromise=new Promise<ViewerConstructor>((resolve,reject)=>{
    const script=document.createElement('script');script.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';script.async=true;
    const timer=window.setTimeout(()=>{script.remove();sdkPromise=undefined;reject(new Error('Sketchfab SDK timeout'));},15000);
    script.onload=()=>{clearTimeout(timer);if(window.Sketchfab)resolve(window.Sketchfab);else{sdkPromise=undefined;reject(new Error('Sketchfab API missing'));}};
    script.onerror=()=>{clearTimeout(timer);script.remove();sdkPromise=undefined;reject(new Error('Sketchfab SDK unavailable'));};document.head.append(script);
  });return sdkPromise;
}
export function createSketchfabScene(host:HTMLElement,status:(value:ViewerStatus)=>void,request:()=>void){
  const iframe=document.createElement('iframe');iframe.title=wedding.model.title;iframe.allow='autoplay; fullscreen; xr-spatial-tracking';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.tabIndex=-1;host.append(iframe);
  let closed=false,api:ViewerApi|undefined,camera:CameraPose|undefined,lastProgress=-1,lastReduced=false;
  const fallback=()=>{if(closed)return;if(!iframe.src)iframe.src=`https://sketchfab.com/models/${wedding.model.uid}/embed?autostart=1&scrollwheel=0&dnt=1&ui_theme=dark`;status('unavailable');};
  const timer=window.setTimeout(()=>{if(!camera)fallback();},30000);
  const visibility=()=>{if(closed||!api)return;if(document.hidden)api.stop();else{api.start();request();}};
  document.addEventListener('visibilitychange',visibility);
  loadSdk().then(Sketchfab=>{
    if(closed)return;
    const client=new Sketchfab('1.12.1',iframe);
    client.init(wedding.model.uid,{
      autostart:1,autospin:0,scrollwheel:0,camera:0,animation_autoplay:0,annotations_visible:0,dnt:1,ui_theme:'dark',max_texture_size:2048,
      success(viewer:ViewerApi){
        if(closed){viewer.stop();return;}api=viewer;
        viewer.addEventListener('viewerready',()=>{
          if(closed)return;
          viewer.setBackground({color:[.047,.039,.08]});
          viewer.getCameraLookAt((error,pose)=>{
            if(closed||error||!pose?.position?.every(Number.isFinite)||!pose?.target?.every(Number.isFinite))return;
            camera={position:[...pose.position],target:[...pose.target]};clearTimeout(timer);status('ready');request();
          });
        });viewer.start();
      },
      error:fallback,
    });
  }).catch(fallback);
  return {
    resize(){request();},
    update(progress:number,reduced:boolean){
      const interactive=host.dataset.interactive==='true';iframe.tabIndex=interactive?0:-1;
      if(closed||!api||!camera||interactive)return;
      if(progress===lastProgress&&reduced===lastReduced)return;
      lastProgress=progress;lastReduced=reduced;const pose=orbitCamera(camera,progress,reduced);api.setCameraLookAt(pose.position,pose.target,.08);
    },
    dispose(){closed=true;clearTimeout(timer);document.removeEventListener('visibilitychange',visibility);api?.stop();iframe.remove();},
  };
}
