import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
import { createMusic } from '../audio/piano';
export function MusicControl(){
  const engine=useRef<ReturnType<typeof createMusic>|null>(null);const [playing,setPlaying]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>{
    const hide=()=>{if(document.hidden){engine.current?.pause();setPlaying(false);}};
    document.addEventListener('visibilitychange',hide);
    return()=>{document.removeEventListener('visibilitychange',hide);engine.current?.dispose();engine.current=null;};
  },[]);
  async function toggle(){
    setError('');if(playing){engine.current?.pause();setPlaying(false);return;}
    if(!('AudioContext' in window)||!('OfflineAudioContext' in window)){setError('Этот браузер не поддерживает музыку.');return;}
    setBusy(true);
    try{engine.current??=createMusic(wedding.music.volume);setPlaying(await engine.current.play());}
    catch{setError('Не удалось включить звук. Попробуйте ещё раз.');engine.current?.dispose();engine.current=null;}
    finally{setBusy(false);}
  }
  if(!wedding.music.enabled)return null;
  return <div className="music-control"><button type="button" className="music-button" onClick={toggle} disabled={busy} aria-pressed={playing} aria-label={playing?'Выключить музыку':'Включить музыку'} title={wedding.music.title}><span className={`music-bars ${playing?'is-playing':''}`} aria-hidden="true"><i/><i/><i/></span><span>{busy?'…':playing?'Пауза':'Музыка'}</span></button>{error&&<p className="music-error" role="status">{error}</p>}</div>;
}
