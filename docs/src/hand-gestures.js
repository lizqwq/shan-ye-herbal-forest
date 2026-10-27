export const HAND_CONNECTIONS=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
export const validPoint=p=>!!p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,((a.z||0)-(b.z||0))*.35);
const clamp=n=>Math.max(0,Math.min(1,n));
export function classifyHand(input){
  const points=Array.isArray(input)?input:[],available=[0,5,9,13,17].map(i=>points[i]).filter(validPoint);
  if(!available.length&&validPoint(points[8]))available.push(points[8]);
  const palm=available.length?available.reduce((a,p)=>({x:a.x+p.x/available.length,y:a.y+p.y/available.length,z:a.z+(p.z||0)/available.length}),{x:0,y:0,z:0}):null;
  const wrist=points[0];
  const extensions=[8,12,16,20].map(tip=>validPoint(wrist)&&validPoint(points[tip])&&validPoint(points[tip-2])?clamp((distance(points[tip],wrist)/Math.max(distance(points[tip-2],wrist),.015)-.87)/.65):null).filter(v=>v!==null);
  const openness=extensions.length?extensions.reduce((a,b)=>a+b,0)/extensions.length:.5;
  // 张手、握拳均忽略拇指，允许一个其他手指缺失与非标准掌面。
  const open=extensions.length>=3&&openness>.67&&extensions.filter(v=>v>.53).length>=3;
  const fist=extensions.length>=3&&openness<.20&&extensions.filter(v=>v<.32).length>=3;
  // 虚握与紧拳之间留出迟滞区；仅根据弯曲程度推断姿态，不测量力度。
  const relaxed=extensions.length>=3&&openness>=.28&&openness<=.62&&extensions.filter(v=>v<.72).length>=2;
  // 食指方向仅供信息页滚动，不再用于探索前进。
  const pointing=validPoint(points[5])&&validPoint(points[8])&&points[5].y-points[8].y>.045;
  const visible=points.filter(validPoint);
  const bounds=visible.length?{left:Math.min(...visible.map(p=>1-p.x)),right:Math.max(...visible.map(p=>1-p.x)),top:Math.min(...visible.map(p=>p.y)),bottom:Math.max(...visible.map(p=>p.y))}:null;
  return {palm,openness,open,fist,relaxed,pointing,bounds,kind:relaxed?'虚握':open?'张开':fist?'握拳':pointing?'食指抬起':'半握',valid:!!palm};
}
export class GestureController{
  constructor({onMove,onGrab,onStore,onDiscard,onHand,isHolding}){Object.assign(this,{onMove,onGrab,onStore,onDiscard,onHand,isHolding});this.cooldownUntil=0;this.reset();}
  reset(){this.pointStart=null;this.pointFrames=0;this.openStart=null;this.armedUntil=0;this.frames=[];this.previousFist=false;this.holdOrigin=null;this.storeLatched=false;this.holdHasFist=false;this.onMove?.(false);}
  process(points,now=performance.now()){
    const hand=classifyHand(points);if(!hand.valid){this.lost();return;}
    const center={x:1-hand.palm.x,y:hand.palm.y};this.onHand?.(points,hand,center);
    const holding=this.isHolding();this.frames.push({open:hand.open,fist:hand.fist});if(this.frames.length>3)this.frames.shift();
    const stableOpen=this.frames.filter(f=>f.open).length>=2&&hand.open,stableFist=this.frames.filter(f=>f.fist).length>=2&&hand.fist;
    if(hand.relaxed&&!holding){this.pointStart??=now;this.pointFrames++;this.onMove(now-this.pointStart>=300&&this.pointFrames>=3);}else{this.pointStart=null;this.pointFrames=0;this.onMove(false);}
    if(holding){
      this.holdOrigin??=center;if(stableFist)this.holdHasFist=true;
      // 不再限制胸口区域：只需持续握拳并向下轻移 1.2% 画面高度。
      if(this.onStore&&stableFist&&center.y-this.holdOrigin.y>.012&&!this.storeLatched&&now>=this.cooldownUntil){this.storeLatched=true;this.onStore();this.cooldownUntil=now+650;return;}
      if(center.y-this.holdOrigin.y<.004)this.storeLatched=false;
      if(stableOpen&&this.holdHasFist&&now>=this.cooldownUntil){this.onDiscard();this.cooldownUntil=now+600;}
      this.armedUntil=0;
    }else{
      this.holdOrigin=null;this.holdHasFist=false;this.storeLatched=false;
      if(stableOpen){this.openStart??=now;if(now-this.openStart>=60)this.armedUntil=now+2200;}else this.openStart=null;
      if(stableFist&&!this.previousFist){if(now<this.armedUntil&&now>=this.cooldownUntil){this.holdOrigin=center;this.holdHasFist=true;this.onGrab(center);this.cooldownUntil=now+400;}this.armedUntil=0;}
    }
    this.previousFist=stableFist;
  }
  lost(){this.reset();this.onHand?.(null,null,null);}
}
export function drawHands(canvas,hands=[]){
  if(!canvas)return;const ctx=canvas.getContext('2d'),width=canvas.clientWidth,height=canvas.clientHeight,dpr=Math.min(globalThis.devicePixelRatio||1,2);
  if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.lineWidth=1.8;
  hands.filter(Array.isArray).forEach((points,index)=>{
    ctx.strokeStyle=index?'rgba(142,122,91,.75)':'rgba(104,112,83,.75)';ctx.fillStyle='rgba(222,216,182,.92)';
    for(const[a,b]of HAND_CONNECTIONS){if(!validPoint(points[a])||!validPoint(points[b]))continue;ctx.beginPath();ctx.moveTo((1-points[a].x)*width,points[a].y*height);ctx.lineTo((1-points[b].x)*width,points[b].y*height);ctx.stroke();}
    for(const p of points){if(!validPoint(p))continue;ctx.beginPath();ctx.arc((1-p.x)*width,p.y*height,3,0,Math.PI*2);ctx.fill();ctx.stroke();}
  });
}
export const drawHand=(canvas,points)=>drawHands(canvas,points?[points]:[]);
