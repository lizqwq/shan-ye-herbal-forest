import {classifyHand} from './hand-gestures.js';
export const NAVIGATION_RULES={top:.08,bottom:.32,distance:.34,drift:.08,slope:.12,armMs:0,minMs:250,maxMs:1500,minSpeed:.4,cooldownMs:1200};
// The upper strip owns one continuous fist sequence, including raising and sweeping.
export class FistNavigation{
 constructor(onNavigate,rules=NAVIGATION_RULES){this.onNavigate=onNavigate;this.rules=rules;this.cooldown=0;this.reset();}
 reset(){this.session=null;this.progress=0;}
 process(left,right,{blocked=false}={},now=performance.now()){
  if(blocked){this.reset();return false;}
  const candidates=[['left',left],['right',right]].map(([id,p])=>({id,p,h:classifyHand(p)})).filter(x=>x.h.valid&&x.h.fist);
  if(candidates.length!==1){this.reset();return false;}
  const {id,p,h}=candidates[0],r=this.rules,c={x:1-h.palm.x,y:h.palm.y},b=h.bounds;
  const full=p.filter(Boolean).length>=18&&b&&b.left>.015&&b.right<.985&&b.top>.015&&b.bottom<.985;
  if(!full||c.y<r.top||c.y>r.bottom){this.reset();return false;}
  // Keep an upper-strip fist away from plant grabbing during cooldown too.
  if(now<this.cooldown){this.reset();return true;}
  if(!this.session){this.session={id,start:c,last:c,at:now,lastAt:now,direction:0,minY:c.y,maxY:c.y};return true;}
  const s=this.session;if(id!==s.id){this.reset();return true;}
  if(!s.direction){
   if(Math.abs(c.x-s.start.x)<.05){s.start={x:s.start.x,y:c.y};s.minY=s.maxY=c.y;s.last=c;s.lastAt=now;return true;}
   s.direction=Math.sign(c.x-s.start.x);s.at=s.lastAt;
  }
  s.minY=Math.min(s.minY,c.y);s.maxY=Math.max(s.maxY,c.y);
  const dx=(c.x-s.start.x)*s.direction,elapsed=now-s.at;
  const diagonal=dx>.10&&Math.abs(c.y-s.start.y)>Math.max(.025,dx*r.slope);
  if(Math.abs(c.x-s.last.x)>.24||elapsed>r.maxMs||s.maxY-s.minY>r.drift||diagonal||(c.x-s.last.x)*s.direction<-.045){this.reset();return true;}
  s.last=c;s.lastAt=now;this.progress=Math.max(0,Math.min(1,dx/r.distance));
  if(dx>=r.distance){
   if(elapsed<r.minMs||dx/(elapsed/1000)<r.minSpeed){this.reset();this.cooldown=now+300;return true;}
   const direction=s.direction;this.cooldown=now+r.cooldownMs;this.reset();this.onNavigate(direction);return true;
  }
  return true;
 }
}
