export class MapWheelGesture{
 constructor(onStep,onConfirm,{onOffset=()=>{},onSettle=()=>{},onSelect=()=>{},getStride=()=>.18}={}){Object.assign(this,{onStep,onConfirm,onOffset,onSettle,onSelect,getStride});this.reset();}
 reset(){this.grabbed=false;this.grabbedNumber=null;this.maxTravel=0;this.scroll=0;this.published=0;this.offset=0;this.velocity=0;this.armed=null;this.fistFrames=0;this.openFrames=0;this.wasFist=false;this.cooldown=0;this.settled=true;this.lostSince=null;this.onOffset?.(0,false);}
 publish(){const rounded=Math.round(this.scroll),delta=rounded-this.published;if(delta){this.published=rounded;this.onStep(-delta);}this.offset=this.scroll-rounded;this.onOffset(this.offset,this.grabbed);}
 grab(center,now,number=null){this.grabbedNumber=number;this.maxTravel=0;this.grabbed=true;this.anchorX=center.x;this.filteredX=center.x;this.anchorScroll=this.scroll;this.lastTime=now;this.velocity=0;this.settled=false;this.armed=null;this.openFrames=0;this.publish();}
 drag(center,now){if(!this.grabbed)return;this.maxTravel=Math.max(this.maxTravel,Math.abs(center.x-this.anchorX));const dt=Math.max(.008,Math.min(.1,(now-this.lastTime)/1000));this.filteredX+=(center.x-this.filteredX)*(1-Math.exp(-18*dt));const target=this.anchorScroll+(this.filteredX-this.anchorX)/Math.max(.09,this.getStride());const previous=this.scroll;this.scroll+=(target-this.scroll)*(1-Math.exp(-22*dt));const measured=Math.max(-8,Math.min(8,(this.scroll-previous)/dt));this.velocity=.65*this.velocity+.35*measured;this.lastTime=now;this.publish();}
 release(confirm=false){if(!this.grabbed)return;const select=confirm&&this.maxTravel<.035&&this.grabbedNumber;this.grabbed=false;this.openFrames=0;if(select){this.velocity=0;this.onSelect(select);}else this.publish();}
 process(hand,center,{overWheel=false,overNumber=false,number=null,overStart=false}={},now=performance.now()){
  if(!hand?.valid){this.lostSince??=now;if(now-this.lostSince>180)this.release();return;}this.lostSince=null;
  if(this.grabbed){this.openFrames=hand.open?this.openFrames+1:0;if(this.openFrames>=3)this.release(true);else this.drag(center,now);return;}
  const target=overStart?(typeof overStart==='string'?overStart:'start'):overWheel||overNumber?'wheel':null;
  if(hand.open){this.wasFist=false;if(target)this.armed={target,time:now,center:{...center},number};}
  this.fistFrames=hand.fist?this.fistFrames+1:0;
  if(this.fistFrames>=2&&!this.wasFist){this.wasFist=true;const arm=this.armed;this.armed=null;if(!arm||now-arm.time>1800||now<this.cooldown)return;const nearArm=Math.hypot(center.x-arm.center.x,center.y-arm.center.y)<.23;if(target!==arm.target&&!(arm.target==='wheel'&&nearArm))return;if(arm.target==='wheel')this.grab(center,now,arm.number);else {this.velocity=0;this.cooldown=now+1000;this.onConfirm(target);}}
 }
 tick(dt){if(this.grabbed||this.settled)return;if(Math.abs(this.velocity)>.06){this.scroll+=this.velocity*dt;this.velocity*=Math.exp(-7*dt);}else{this.velocity=0;const target=Math.round(this.scroll);this.scroll+=(target-this.scroll)*(1-Math.exp(-15*dt));if(Math.abs(target-this.scroll)<.002){this.scroll=target;this.settled=true;this.publish();this.onSettle();return;}}this.publish();}
}
