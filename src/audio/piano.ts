/** An original, synthesized piano-like instrumental. No third-party song or recording. */
export const score = {
  tempo: 68,
  chords: [[48,55,60,64],[45,52,57,60],[41,48,53,57],[43,50,55,59]],
  melody: [[76,74,72,67],[72,71,69,64],[69,67,65,64],[67,71,74,72]],
} as const;
const frequency=(midi:number)=>440*2**((midi-69)/12);
export function noteEvents(){
  const beat=60/score.tempo,events:{time:number;midi:number;duration:number;gain:number}[]=[];
  for(let bar=0;bar<16;bar++){
    const chord=score.chords[bar%4],start=bar*beat*4;
    events.push({time:start,midi:chord[0]-12,duration:beat*3.6,gain:.11});
    for(let i=0;i<8;i++)events.push({time:start+i*beat/2,midi:chord[[0,2,1,3,2,1,3,2][i]]+12,duration:beat*1.8,gain:.075});
    const melody=score.melody[bar%4];
    for(let i=0;i<4;i++)events.push({time:start+i*beat,midi:melody[i]+(bar>=8?0:-12),duration:beat*1.9,gain:.1});
  }
  return {events,duration:16*4*beat};
}
export async function renderPiano(){
  const {events,duration}=noteEvents();
  const offline=new OfflineAudioContext(2,Math.ceil((duration+4)*22050),22050);
  const dry=offline.createGain();dry.gain.value=.58;dry.connect(offline.destination);
  const delay=offline.createDelay(1);delay.delayTime.value=.22;const wet=offline.createGain();wet.gain.value=.18;dry.connect(delay);delay.connect(wet);wet.connect(offline.destination);
  const imag=new Float32Array([0,1,.26,.1,.05,.025,.014]),real=new Float32Array(imag.length);const wave=offline.createPeriodicWave(real,imag);
  for(const event of events){
    const osc=offline.createOscillator(),envelope=offline.createGain(),pan=offline.createStereoPanner();
    osc.setPeriodicWave(wave);osc.frequency.value=frequency(event.midi);pan.pan.value=Math.max(-.65,Math.min(.65,(event.midi-64)/30));
    const at=event.time+.02;envelope.gain.setValueAtTime(0,at);envelope.gain.linearRampToValueAtTime(event.gain,at+.009);envelope.gain.exponentialRampToValueAtTime(.0001,at+event.duration);
    osc.connect(envelope);envelope.connect(pan);pan.connect(dry);osc.start(at);osc.stop(at+event.duration+.02);
  }
  return offline.startRendering();
}
export function createMusic(volume:number){
  let context:AudioContext|undefined,master:GainNode|undefined,source:AudioBufferSourceNode|undefined,buffer:AudioBuffer|undefined;
  let wanted=false,disposed=false,loading:Promise<AudioBuffer>|undefined;
  function stop(){wanted=false;if(context&&master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(0,context.currentTime,.07);}const old=source;source=undefined;if(old&&context){try{old.stop(context.currentTime+.3);}catch{/* Already stopped. */}}}
  return {
    async play(){
      if(disposed)return false;
      // Must happen synchronously inside the click, before awaiting sound generation.
      context??=new AudioContext();if(!master){master=context.createGain();master.connect(context.destination);}wanted=true;
      await context.resume();loading??=renderPiano();buffer??=await loading;
      if(!wanted||disposed)return false;
      const next=context.createBufferSource();next.buffer=buffer;next.loop=true;next.connect(master);
      master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(0,context.currentTime);master.gain.linearRampToValueAtTime(volume,context.currentTime+.7);next.start();source=next;
      return true;
    },
    pause:stop,
    setVolume(value:number){volume=value;if(context&&master&&wanted)master.gain.setTargetAtTime(volume,context.currentTime,.1);},
    dispose(){disposed=true;stop();void context?.close();buffer=undefined;},
  };
}
