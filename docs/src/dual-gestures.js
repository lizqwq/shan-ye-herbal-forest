import {classifyHand} from './hand-gestures.js';
export class DualGestures{
  constructor({onInventory,onCloseInventory,onMiniMap,onMapPicker,onCloseMap,onMapTurn}){Object.assign(this,{onInventory,onCloseInventory,onMiniMap,onMapPicker,onCloseMap,onMapTurn});this.cooldownUntil=0;this.reset();}
  reset(){this.state=null;this.missingSince=null;}
  fire(action,now){this.cooldownUntil=now+1250;this.reset();action();return true;}
  process(left,right,{mapsOpen=false,inventoryOpen=false,blocked=false}={},now=performance.now()){
    const a=classifyHand(left),b=classifyHand(right);
    if(blocked){this.reset();return false;}
    if(!a.valid||!b.valid){this.missingSince??=now;if(now-this.missingSince>180)this.reset();return false;}
    this.missingSince=null;if(now<this.cooldownUntil)return false;
    const p={x:1-a.palm.x,y:a.palm.y},q={x:1-b.palm.x,y:b.palm.y},d=Math.hypot(p.x-q.x,p.y-q.y),mid={x:(p.x+q.x)/2,y:(p.y+q.y)/2};
    let s=this.state;
    if(!s||now-s.started>2600)s=this.state={started:now,startDistance:d,maxDistance:d,fromEdges:false,startMid:mid,nearAt:null,nearFrames:0};
    s.maxDistance=Math.max(s.maxDistance,d);
    const leftEdge=Math.min(a.bounds?.left??1,b.bounds?.left??1),rightEdge=Math.max(a.bounds?.right??0,b.bounds?.right??0);
    if(now-s.started<350&&leftEdge<.07&&rightEdge>.93&&d>.5)s.fromEdges=true;
    if(mapsOpen&&a.open&&b.open&&s.startMid.y<.32){
      const dx=mid.x-s.startMid.x,dy=mid.y-s.startMid.y;
      if(dy>.42&&Math.abs(dx)>.44&&Math.abs(Math.abs(dx)-dy)<.30){if(s.startMid.x<.32&&dx>0)return this.fire(()=>this.onMapTurn(1),now);if(s.startMid.x>.68&&dx<0)return this.fire(()=>this.onMapTurn(-1),now);}
    }
    const touching=d<.25&&Math.abs(p.y-q.y)<.23&&Math.abs(mid.x-.5)<.36;
    const bothFists=(a.fist||(!a.open&&a.openness<.38))&&(b.fist||(!b.open&&b.openness<.38));
    const bothOpen=a.open&&b.open;
    // A mixed open-palm/fist pose belongs to one-hand grabbing, not a
    // two-hand command. Reset stale distance history instead of consuming it.
    if(!bothFists&&!bothOpen){this.reset();return false;}
    // 锁定起始姿态：双拳负责地图，双掌负责背包。
    if(bothFists){if(s.mode!=='map')s=this.state={started:now,startDistance:d,maxDistance:d,fromEdges:false,startMid:mid,nearAt:null,nearFrames:0,mode:'map'};}
    else if(bothOpen&&s.mode==='map'){this.reset();return false;}
    else if(!s.mode&&touching)s.mode='bag';
    if(s.mode==='map'){
      if(touching&&bothFists){s.nearAt??=now;s.nearFrames++;}
      if(mapsOpen&&touching&&s.maxDistance>.34&&s.nearFrames>=3)return this.fire(()=>this.onCloseMap?.(),now);
      if(!mapsOpen&&!inventoryOpen&&s.nearFrames>=2&&d>.36)return this.fire(this.onMapPicker,now);
      return touching||d<s.maxDistance-.08||s.nearFrames>=2;
    }
    if(touching){s.nearAt??=now;s.nearFrames++;}
    if(s.nearAt!==null&&s.nearFrames>=2){
      // 合拢后迅速张开优先背包；持续停在合掌位置才打开地图。
      if(!inventoryOpen&&d>.48&&now-s.nearAt<1400)return this.fire(this.onInventory,now);
      if(touching&&now-s.nearAt>=520){
        if(inventoryOpen&&s.maxDistance>.34)return this.fire(this.onCloseInventory,now);
      }
      return true;
    }
    return false;
  }
}
export class MapHandGestures{
  constructor({onSelect,onZoom}){Object.assign(this,{onSelect,onZoom});this.reset();}
  reset(){this.anchor=null;this.pose=null;this.frames=0;this.cooldownUntil=0;}
  process(hand,center,now=performance.now()){
    if(!hand.valid)return;this.anchor??=center;
    const dx=center.x-this.anchor.x;if(Math.abs(dx)>.12&&now>this.cooldownUntil){this.onSelect(Math.sign(dx));this.anchor=center;this.cooldownUntil=now+420;}
    const pose=hand.fist?'fist':hand.open?'open':'other';
    if(pose===this.pose)this.frames++;else{this.pose=pose;this.frames=1;}
    if(this.frames===3){if(pose==='fist')this.onZoom(1);if(pose==='open')this.onZoom(-1);}
  }
}

