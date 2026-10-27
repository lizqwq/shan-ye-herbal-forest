import {splitHands,HandSmoother} from './hand-tracking.js';
// 模型、JS、WASM 均随项目本地托管，视频不上传、不保存。
export const HAND_OPTIONS={runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.4,minHandPresenceConfidence:.35,minTrackingConfidence:.4};
export class HandCamera{
  constructor(video,{onResults,onStatus}){Object.assign(this,{video,onResults,onStatus});this.running=false;this.attempt=0;this.smoother=new HandSmoother();}
  async start(){
    if(this.running||this.starting)return;this.starting=true;const attempt=++this.attempt;this.onStatus('requesting','正在连接摄像头');
    try{
      if(!isSecureContext||!navigator.mediaDevices?.getUserMedia)throw new Error('请使用 HTTPS 或 localhost 开启摄像头');
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:30,max:30}},audio:false});
      if(attempt!==this.attempt){stream.getTracks().forEach(t=>t.stop());return;}
      this.stream=stream;this.video.srcObject=stream;await this.video.play();this.onStatus('loading','正在载入双手识别模型');
      const {FilesetResolver,HandLandmarker}=await import('../vendor/mediapipe/vision_bundle.mjs');
      const fileset=await FilesetResolver.forVisionTasks(new URL('./vendor/mediapipe/wasm',document.baseURI).href);
      const options={...HAND_OPTIONS,baseOptions:{modelAssetPath:new URL('./vendor/mediapipe/hand_landmarker.task',document.baseURI).href,delegate:'GPU'}};
      let landmarker;try{landmarker=await HandLandmarker.createFromOptions(fileset,options);}catch{options.baseOptions.delegate='CPU';landmarker=await HandLandmarker.createFromOptions(fileset,options);}
      if(attempt!==this.attempt){landmarker.close();return;}
      this.landmarker=landmarker;this.running=true;this.lastVideoTime=-1;this.lastInference=0;this.onStatus('ready','双手识别已连接');this.tick();
    }catch(error){this.stream?.getTracks().forEach(t=>t.stop());this.video.srcObject=null;const message=error.name==='NotAllowedError'?'摄像头未授权，可使用键盘体验':error.name==='NotFoundError'?'未发现摄像头，可使用键盘体验':error.message||'双手识别加载失败';if(attempt===this.attempt)this.onStatus('error',message);}finally{this.starting=false;}
  }
  tick(){
    if(!this.running)return;const now=performance.now();
    try{if(!document.hidden&&this.video.readyState>=2&&this.video.currentTime!==this.lastVideoTime&&now-this.lastInference>=40){this.lastVideoTime=this.video.currentTime;this.lastInference=now;const result=this.landmarker.detectForVideo(this.video,now),hands=splitHands(result),handLeft=this.smoother.filter('left',hands.handLeft),handRight=this.smoother.filter('right',hands.handRight);try{this.onResults({handLeft,handRight,landmarks:[handLeft,handRight].filter(Boolean),raw:result,timestamp:now});}catch(error){console.warn('Hand interaction recovered; camera remains active.',error);}}}
    catch{if(now-(this.lastRecoveryNotice||0)>3000){this.lastRecoveryNotice=now;this.onStatus('ready','摄像头保持开启，手势识别正在重试');}}
    this.frame=requestAnimationFrame(()=>this.tick());
  }
  async stop(){this.attempt++;this.running=false;cancelAnimationFrame(this.frame);this.stream?.getTracks().forEach(t=>t.stop());this.video.srcObject=null;try{this.landmarker?.close();}catch{}this.landmarker=null;this.smoother.clear();}
}
