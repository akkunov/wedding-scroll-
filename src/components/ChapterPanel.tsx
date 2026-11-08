import { wedding } from '../config/wedding';
interface Props { index:number;active:boolean;onRsvp:()=>void }
export function ChapterPanel({index,active,onRsvp}:Props){
  const c=wedding.chapters[index];
  return <section className="chapter-panel" data-panel inert={!active} aria-hidden={!active} aria-labelledby={`title-${c.id}`}>
    <div className="copy"><p className="eyebrow">{c.eyebrow}</p>{index===0?<h1 id={`title-${c.id}`}>{wedding.groom}<em>&</em>{wedding.bride}</h1>:<h2 id={`title-${c.id}`}>{c.title}<br/><em>{c.accent}</em></h2>}
      {index===2?<div className="timeline">{wedding.schedule.map(event=><p key={event.time}><time>{event.time}</time><span>{event.title}</span></p>)}</div>:<p className="intro">{c.text}</p>}
    </div>
    <div className="section-bottom">{index===0?<><p className="date"><time dateTime={wedding.date.iso}>{wedding.date.display}</time></p><a className="scroll-hint" href="#story">{c.footer}<span>↓</span></a></>:index===3?<><button className="primary" onClick={onRsvp}>{wedding.rsvp.button}<span>↗</span></button><p className="demo-note">{c.footer}</p></>:<><p className="note">{index===2?wedding.venue.name:c.footer}</p>{index===2&&(wedding.venue.mapUrl?<a className="map-link" href={wedding.venue.mapUrl} target="_blank" rel="noreferrer">{wedding.venue.address} ↗</a>:<p className="demo-note">{wedding.venue.address} · Пример</p>)}<span className="location-label">{c.location}</span></>}</div>
  </section>;
}
