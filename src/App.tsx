import { useEffect, useState, type CSSProperties } from 'react';
import { wedding } from './config/wedding';
import { Header } from './components/Header';
import { ChapterPanel } from './components/ChapterPanel';
import { RsvpDialog } from './components/RsvpDialog';
import { useScrollScene } from './hooks/useScrollScene';
export default function App(){
  const {trackRef,stageRef,canvasRef,active,sceneStatus}=useScrollScene();const [rsvpOpen,setRsvpOpen]=useState(false),[interactive,setInteractive]=useState(false);
  useEffect(()=>{document.title=`${wedding.groom} & ${wedding.bride} — Под одной луной`;},[]);
  const style={'--page-bg':wedding.appearance.background,'--page-text':wedding.appearance.text,'--accent':wedding.appearance.accent,'--scroll-height':`${wedding.animation.scrollScreens*100}svh`} as CSSProperties;
  return <div className="app" style={style}><Header/><main className="scroll-track" ref={trackRef}>
    {wedding.chapters.map((chapter,index)=><div key={chapter.id} id={chapter.id} className="chapter-anchor" style={{top:`calc(${index/3} * (var(--scroll-height) - 100svh))`}}/>)}
    <div className="stage" ref={stageRef}>
      <div className="night-sky" aria-hidden="true"><div className="moon"/>{Array.from({length:24},(_,i)=><i key={i} className="star" style={{left:`${(i*37+11)%100}%`,top:`${(i*23+7)%73}%`,animationDelay:`${-i*.7}s`}}/>)}<svg className="hills" viewBox="0 0 1200 310" preserveAspectRatio="none"><path fill="#181020" d="M0 190 Q160 20 300 180 Q520 340 710 115 Q960 -30 1200 160 V310 H0Z"/><path fill="#08070e" d="M0 260 Q200 120 400 230 Q660 365 890 170 Q1060 100 1200 220 V310 H0Z"/><path d="M970 190 C850 170 850 50 950 45 C1030 40 1050 120 990 135 C940 147 922 105 950 88 C970 74 992 88 985 101" fill="none" stroke="#08070e" strokeWidth="22" strokeLinecap="round"/><path d="M110 260 L124 160 M125 190 L86 145 M124 177 L157 128 M88 149 L83 117 M151 137 L178 130" stroke="#08070e" strokeWidth="9" strokeLinecap="round"/></svg></div>
      <div className="scene sketchfab-scene" data-interactive={interactive} ref={canvasRef}/>
      <div className="viewer-toolbar"><button onClick={()=>setInteractive(!interactive)} aria-pressed={interactive}>{interactive?'↩ Вернуть прокрутку':'◇ Рассмотреть 3D'}</button><p><a href={wedding.model.pageUrl} target="_blank" rel="noreferrer">{wedding.model.title}</a> by <a href={wedding.model.authorUrl} target="_blank" rel="noreferrer">{wedding.model.author}</a> · <a href="https://sketchfab.com" target="_blank" rel="noreferrer">Sketchfab</a></p></div>
      {sceneStatus!=='ready'&&<div className="scene-placeholder" aria-hidden="true"><div className="placeholder-arch"/><span>{wedding.monogram}</span><small>{sceneStatus==='loading'?'Открываем портал в нашу сказку…':'Если 3D не загрузилось — откройте модель на Sketchfab по ссылке ниже.'}</small></div>}
      <div className="grain" aria-hidden="true"/>
      {wedding.chapters.map((c,index)=><ChapterPanel key={c.id} index={index} active={active===index} onRsvp={()=>setRsvpOpen(true)}/>)}
      <aside className="chapter-nav" aria-label="Разделы">{wedding.chapters.map((c,index)=><a key={c.id} href={`#${c.id}`} aria-label={c.nav} aria-current={active===index?'step':undefined}><span/></a>)}</aside>
      <div className="chapter-caption" aria-hidden="true"><span>0{active+1}</span><i/>{wedding.chapters[active].location}</div>
      <div className="progress" aria-hidden="true"><span/></div>
    </div>
  </main><RsvpDialog open={rsvpOpen} onClose={()=>setRsvpOpen(false)}/></div>;
}
