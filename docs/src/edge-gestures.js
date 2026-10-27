// 摄像头看不到真正的画外位置，以「刚入镜且贴边 → 完整穿越 → 对侧贴边后离镜」为可观测序列。
export class PageGestures{
  constructor({onNavigate,onScroll}){Object.assign(this,{onNavigate,onScroll});this.cooldownUntil=0;this.reset();}
  reset(){this.session=null;this.visibleSince=null;}
  process(hand,center,{scrollable=false,blocked=false}={},now=performance.now()){
    if(blocked){this.reset();return false;}
    if(!hand?.valid||!center){this.lost(now);return false;}
    this.visibleSince??=now;
    if(now<this.cooldownUntil)return false;
    const b=hand.bounds;
    if(!this.session&&hand.open&&b&&now-this.visibleSince<300){
      const origins=[];if(b.left<=.045)origins.push('left');if(b.right>=.955)origins.push('right');if(b.top<=.045)origins.push('top');if(b.bottom>=.955)origins.push('bottom');
      if(origins.length)this.session={start:center,started:now,lastSeen:now,origins,action:null};
    }
    const s=this.session;if(!s)return false;
    if(now-s.started>2200||hand.fist){this.session=null;return false;}
    s.lastSeen=now;const dx=center.x-s.start.x,dy=center.y-s.start.y;
    if(now-s.started>=220&&b){
      if(Math.abs(dy)<.27&&Math.abs(dx)>.55){if(s.origins.includes('left')&&b.right>=.96&&dx>0)s.action={kind:'nav',direction:1};if(s.origins.includes('right')&&b.left<=.04&&dx<0)s.action={kind:'nav',direction:-1};}
      if(scrollable&&Math.abs(dx)<.27&&Math.abs(dy)>.55){if(s.origins.includes('bottom')&&b.top<=.04&&dy<0)s.action={kind:'scroll',direction:1};if(s.origins.includes('top')&&b.bottom>=.96&&dy>0)s.action={kind:'scroll',direction:-1};}
    }
    return true;
  }
  lost(now=performance.now()){
    const s=this.session,action=s?.action;this.reset();
    if(action&&now-s.lastSeen<300&&now>=this.cooldownUntil){this.cooldownUntil=now+1300;if(action.kind==='nav')this.onNavigate(action.direction);else this.onScroll(action.direction);return true;}
    return false;
  }
}
export class StrafeGesture{
  reset(){this.anchor=null;this.until=0;}
  constructor(){this.reset();}
  process(hand,center,onStrafe,now=performance.now()){
    if(!hand?.valid||hand.fist){this.reset();return false;}
    this.anchor??={...center,time:now};const dx=center.x-this.anchor.x,dy=center.y-this.anchor.y;
    if(now-this.anchor.time>500){this.anchor={...center,time:now};}
    else if(Math.abs(dx)>.075&&Math.abs(dy)<.15){onStrafe(Math.sign(dx)*.32);this.until=now+320;this.anchor={...center,time:now};}
    return now<this.until;
  }
}
// 信息页连续滚动：仅依赖食指尖，可选根部用于判断抬指，不要求掌面或其他手指完整。
export class FingerScroll{
  constructor(onScroll){this.onScroll=onScroll;this.reset();}
  reset(){this.last=null;this.frames=0;}
  process(points,{enabled=false}={}){
    const tip=points?.[8],base=points?.[5];
    if(!enabled||!tip||!Number.isFinite(tip.y)||(base&&base.y-tip.y<.025)){this.reset();return false;}
    this.frames++;
    if(this.last===null){this.last=tip.y;return true;}
    const delta=tip.y-this.last;this.last=tip.y;
    if(this.frames>=3&&Math.abs(delta)>.0018&&Math.abs(delta)<.13)this.onScroll(-Math.max(-.055,Math.min(.055,delta)));
    return true;
  }
}
export function fingerScrollDirection(points){
 const tip=points?.[8],base=points?.[5];
 if(!tip||!base||![tip.x,tip.y,base.x,base.y].every(Number.isFinite))return 0;
 const dy=tip.y-base.y,dx=tip.x-base.x;
 if(Math.abs(dy)<.028||Math.abs(dy)<Math.abs(dx)*.8)return 0;
 const wrist=points?.[0],joint=points?.[6];
 // A folded index in a fist is not a downward-pointing finger.
 if(wrist&&joint&&Math.hypot(tip.x-wrist.x,tip.y-wrist.y)<Math.hypot(joint.x-wrist.x,joint.y-wrist.y)*.98)return 0;
 return Math.sign(dy);
}
// 持续指向滚动；适应不同手掌距离与轻微倾斜，横指、收指即停止。
export class DirectionalScroll{
  constructor(onScroll,onStop=()=>{}){this.onScroll=onScroll;this.onStop=onStop;this.reset();}
  reset(){this.direction=0;this.frames=0;this.started=null;this.lastTime=null;this.onStop?.();}
  process(points,{enabled=false}={},now=performance.now()){
    const direction=enabled?fingerScrollDirection(points):0;
    if(!direction){this.reset();return false;}
    if(direction!==this.direction||this.lastTime===null||now-this.lastTime>200){this.reset();this.direction=direction;this.started=now;}
    const dt=this.lastTime===null?0:Math.min(.06,(now-this.lastTime)/1000);this.lastTime=now;this.frames++;
    if(this.frames>=3&&now-this.started>=250)this.onScroll(direction*dt*.22);
    return true;
  }
}
export class CircleScroll{
  constructor(onScroll,getAspect=()=>1){this.onScroll=onScroll;this.getAspect=getAspect;this.reset();}
  reset(){this.points=[];this.circle=null;this.lastTime=0;}
  process(points,{enabled=false}={},now=performance.now()){
    const tip=points?.[8];if(!enabled||!tip||!Number.isFinite(tip.x)||!Number.isFinite(tip.y)){this.reset();return false;}
    if(this.lastTime&&now-this.lastTime>350)this.reset();this.lastTime=now;
    const point={x:tip.x*this.getAspect(),y:tip.y}; // 原始相机 x 未镜像，转到屏幕方向后判断顺逆时针。
    point.x=-point.x;
    if(this.circle){
      const c=this.circle,r=Math.hypot(point.x-c.x,point.y-c.y);
      if(r<c.radius*.35||r>c.radius*1.9){this.reset();return false;}
      const angle=Math.atan2(point.y-c.y,point.x-c.x);let delta=angle-c.angle;while(delta>Math.PI)delta-=Math.PI*2;while(delta<-Math.PI)delta+=Math.PI*2;c.angle=angle;
      if(Math.abs(delta)>.85){this.reset();return false;}
      if(Math.abs(delta)>.018)this.onScroll(delta*.04);
      return true;
    }
    const last=this.points.at(-1);if(last&&Math.hypot(point.x-last.x,point.y-last.y)<.003)return false;
    this.points.push(point);if(this.points.length>65)this.points.shift();if(this.points.length<12)return false;
    const xs=this.points.map(p=>p.x),ys=this.points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const rx=(maxX-minX)/2,ry=(maxY-minY)/2;if(rx<.035||ry<.035||rx>.35||ry>.35||rx/ry<.5||rx/ry>2)return false;
    const cx=(minX+maxX)/2,cy=(minY+maxY)/2,radius=(rx+ry)/2;
    const error=this.points.reduce((sum,p)=>sum+Math.abs(Math.hypot(p.x-cx,p.y-cy)-radius),0)/this.points.length/radius;if(error>.32)return false;
    let turn=0,total=0,previous=Math.atan2(this.points[0].y-cy,this.points[0].x-cx);
    for(const p of this.points.slice(1)){const angle=Math.atan2(p.y-cy,p.x-cx);let d=angle-previous;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;turn+=d;total+=Math.abs(d);previous=angle;}
    if(Math.abs(turn)>5&&Math.abs(turn)/Math.max(total,.01)>.78){this.circle={x:cx,y:cy,radius,angle:previous};this.onScroll(Math.sign(turn)*.12);return true;}
    return false;
  }
}
