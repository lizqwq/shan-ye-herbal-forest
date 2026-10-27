import {classifyHand} from './hand-gestures.js';
// 专用于首次教程确认，不复用地图/背包的合掌与展开识别。
export class TutorialConfirmation{
 constructor(onConfirm){this.onConfirm=onConfirm;this.reset();}
 reset(){this.openFrames=0;this.fistFrames=0;this.armedUntil=0;this.done=false;}
 process(left,right,now=performance.now()){
  if(this.done)return;
  const a=classifyHand(left),b=classifyHand(right);
  if(!a.valid||!b.valid){this.openFrames=0;this.fistFrames=0;this.armedUntil=0;return;}
  if(a.open&&b.open){if(++this.openFrames>=3)this.armedUntil=now+3000;this.fistFrames=0;}
  else {this.openFrames=0;this.fistFrames=a.fist&&b.fist?this.fistFrames+1:0;}
  if(this.fistFrames>=2&&now<this.armedUntil){this.done=true;this.onConfirm();}
 }
}
