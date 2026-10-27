import {classifyHand} from './hand-gestures.js';
// 双手都必须稳定虚握250ms；退回单手虚握后延迟350ms降速。摊掌立即停止。
export class HandCountRunning{
 constructor(){this.reset();}
 reset(){this.running=false;this.bothSince=null;this.singleSince=null;this.frames=0;}
 process(left,right,now,enabled=true){
  const valid=points=>Array.isArray(points)&&points.some(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y));
  if(!enabled){this.reset();return false;}
  const poses=[left,right].filter(valid).map(classifyHand);if(poses.some(h=>h.open)){this.reset();return false;}const count=poses.filter(h=>h.relaxed).length;if(!count){this.reset();return false;}
  if(count===2){this.singleSince=null;this.bothSince??=now;this.frames++;if(this.frames>=4&&now-this.bothSince>=250)this.running=true;}
  else {this.bothSince=null;this.frames=0;this.singleSince??=now;if(now-this.singleSince>=350)this.running=false;}
  return this.running;
 }
}
