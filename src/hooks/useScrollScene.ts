import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { clamp, getPanelState, getSceneState } from '../scene/timeline';
import type { SceneController } from '../scene/createScene';

export function useScrollScene(){
  const trackRef=useRef<HTMLElement>(null),stageRef=useRef<HTMLDivElement>(null),canvasRef=useRef<HTMLDivElement>(null);
  const [active,setActive]=useState(0),[sceneStatus,setSceneStatus]=useState<'loading'|'ready'|'unavailable'>('loading');
  useEffect(()=>{
    const track=trackRef.current,stage=stageRef.current,host=canvasRef.current;
    if(!track||!stage||!host)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const panels=[...stage.querySelectorAll<HTMLElement>('[data-panel]')];
    let disposed=false,controller:SceneController|undefined,frame=0,last=0,current=0,target=0,lastChapter=-1;
    function paint(time:number){
      frame=0;if(disposed||document.hidden)return;
      const delta=Math.min((time-last)/1000||1/60,.05);last=time;
      current=preference.matches?target:current+(target-current)*(1-Math.exp(-wedding.animation.damping*delta));
      if(Math.abs(current-target)<.00005)current=target;
      stage!.style.setProperty('--progress',String(current));
      panels.forEach((panel,index)=>{const s=getPanelState(current,index,preference.matches);panel.style.setProperty('--panel-opacity',String(s.opacity));panel.style.setProperty('--panel-y',`${s.translateY}px`);panel.style.setProperty('--panel-blur',`${s.blur}px`);});
      const chapter=getSceneState(current).chapter;if(chapter!==lastChapter){lastChapter=chapter;setActive(chapter);}
      controller?.update(current,preference.matches);
      if(current!==target)frame=requestAnimationFrame(paint);
    }
    function request(){if(!disposed&&!frame&&!document.hidden)frame=requestAnimationFrame(paint);}
    function measure(){const distance=Math.max(1,track!.offsetHeight-stage!.offsetHeight);target=clamp(-track!.getBoundingClientRect().top/distance);request();}
    function resize(){controller?.resize();measure();}
    function visibility(){last=0;request();}
    // The first frame uses the current scroll position, including restored history/hash navigation.
    measure();current=target;
    window.addEventListener('scroll',measure,{passive:true});
    document.addEventListener('visibilitychange',visibility);
    preference.addEventListener('change',request);
    const observer=new ResizeObserver(resize);observer.observe(stage);
    import('../scene/createScene').then(({createScene})=>{
      if(disposed)return;
      try{controller=createScene(host,()=>setSceneStatus('unavailable'));controller.resize();setSceneStatus('ready');request();}
      catch(error){console.warn('3D scene unavailable',error);setSceneStatus('unavailable');}
    }).catch(()=>{if(!disposed)setSceneStatus('unavailable');});
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',measure);document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',request);controller?.dispose();};
  },[]);
  return {trackRef,stageRef,canvasRef,active,sceneStatus};
}
