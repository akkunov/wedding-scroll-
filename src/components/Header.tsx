import { useEffect, useRef, useState } from 'react';
import { wedding } from '../config/wedding';
export function Header(){
  const [open,setOpen]=useState(false);const root=useRef<HTMLElement>(null),toggle=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!open)return;
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}};
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};
    document.addEventListener('keydown',close);document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside);};
  },[open]);
  return <header ref={root}><a className="monogram" href="#invitation" aria-label="В начало">{wedding.monogram}</a><span className="edition">{wedding.edition}</span><button ref={toggle} className="menu-toggle" aria-label={open?'Закрыть меню':'Открыть меню'} aria-expanded={open} aria-controls="navigation" onClick={()=>setOpen(!open)}><i/><i/></button><nav id="navigation" hidden={!open}>{wedding.chapters.map(c=><a key={c.id} href={`#${c.id}`} onClick={()=>setOpen(false)}>{c.nav}</a>)}</nav></header>;
}
