export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smooth = (value: number) => { const t=clamp(value);return t*t*(3-2*t); };
export function getSceneState(progress: number) {
  const p=clamp(progress);
  return { rotation:p, garden:smooth((p-.12)/.2)*(1-smooth((p-.48)/.22)), hall:smooth((p-.45)/.23), cameraZoom:Math.sin(p*Math.PI)*.4, chapter:Math.min(3,Math.round(p*3)) };
}
export function getPanelState(progress:number,index:number,reduced=false){
  const distance=progress*3-index;
  return { opacity:reduced?(Math.round(progress*3)===index?1:0):1-smooth(Math.abs(distance)/.64), translateY:reduced?0:-distance*38, blur:reduced?0:Math.min(5,Math.abs(distance)*4) };
}
