import { useEffect, useState, type CSSProperties } from 'react';
import { wedding } from './config/wedding';
import { Header } from './components/Header';
import { ChapterPanel } from './components/ChapterPanel';
import { RsvpDialog } from './components/RsvpDialog';
import { useScrollScene } from './hooks/useScrollScene';
export default function App(){
  const {trackRef,stageRef,canvasRef,active,sceneStatus}=useScrollScene();const [rsvpOpen,setRsvpOpen]=useState(false);
  useEffect(()=>{document.title=`${wedding.groom} & ${wedding.bride} — Белая история`;},[]);
  const style={'--page-bg':wedding.appearance.background,'--page-text':wedding.appearance.text,'--accent':wedding.appearance.accent,'--scroll-height':`${wedding.animation.scrollScreens*100}svh`} as CSSProperties;
  return <div className="app" style={style}><Header/><main className="scroll-track" ref={trackRef}>
    {wedding.chapters.map((chapter,index)=><div key={chapter.id} id={chapter.id} className="chapter-anchor" style={{top:`calc(${index/3} * (var(--scroll-height) - 100svh))`}}/>)}
    <div className="stage" ref={stageRef}>
      <div className="scene" ref={canvasRef}/><div className="ambient" aria-hidden="true"/>
      {sceneStatus!=='ready'&&<div className="scene-placeholder" aria-hidden="true"><div className="placeholder-arch"/><span>{wedding.monogram}</span><small>{sceneStatus==='loading'?'Готовим вашу историю…':'В этом браузере 3D недоступно'}</small></div>}
      <div className="grain" aria-hidden="true"/>
      {wedding.chapters.map((c,index)=><ChapterPanel key={c.id} index={index} active={active===index} onRsvp={()=>setRsvpOpen(true)}/>)}
      <aside className="chapter-nav" aria-label="Разделы">{wedding.chapters.map((c,index)=><a key={c.id} href={`#${c.id}`} aria-label={c.nav} aria-current={active===index?'step':undefined}><span/></a>)}</aside>
      <div className="chapter-caption" aria-hidden="true"><span>0{active+1}</span><i/>{wedding.chapters[active].location}</div>
      <div className="progress" aria-hidden="true"><span/></div>
    </div>
  </main><RsvpDialog open={rsvpOpen} onClose={()=>setRsvpOpen(false)}/></div>;
}
