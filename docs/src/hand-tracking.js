import {validPoint} from './hand-gestures.js';
export function splitHands(result={}){
  let handLeft=null,handRight=null;
  for(let i=0;i<(result.landmarks?.length||0);i++){
    const points=result.landmarks[i];if(!Array.isArray(points)||!points.some(validPoint))continue;
    const label=result.handedness?.[i]?.[0]?.categoryName||result.handednesses?.[i]?.[0]?.categoryName;
    if(label==='Left'&&!handLeft)handLeft=points;else if(label==='Right'&&!handRight)handRight=points;
    else if(!handLeft&&!handRight){if((points[0]?.x??.5)>.5)handLeft=points;else handRight=points;}
    else if(!handLeft)handLeft=points;else if(!handRight)handRight=points;
  }return {handLeft,handRight};
}
export class HandSmoother{
  constructor(){this.previous={};}clear(){this.previous={};}
  filter(label,points){
    if(!points){delete this.previous[label];return null;}
    const previous=this.previous[label],current=points.map((p,i)=>{if(!validPoint(p))return null;const old=previous?.[i];if(!validPoint(old))return {...p,z:p.z||0};const alpha=Math.hypot(p.x-old.x,p.y-old.y)>.07?.88:.68;return {x:old.x+(p.x-old.x)*alpha,y:old.y+(p.y-old.y)*alpha,z:(old.z||0)+((p.z||0)-(old.z||0))*alpha};});
    this.previous[label]=current;return current;
  }
}
