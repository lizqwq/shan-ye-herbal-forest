// The same-origin workshop consumes the existing camera and inference results.
// It never opens a device or owns the parent's MediaStream tracks.
export class WorkshopCameraBridge{
  constructor(getFrame,getVideo,key='herbalWorkshopHost',getContext=()=>({})){this.getFrame=getFrame;this.getVideo=getVideo;this.key=key;this.getContext=getContext;this.target=null;this.stream=undefined;}
  connect(){
    const target=this.getFrame()?.contentWindow?.[this.key];
    if(!target)return null;
    const video=this.getVideo(),stream=video?.srcObject??null;
    if(target!==this.target||stream!==this.stream){this.target=target;this.stream=stream;target.attach(video,this.getContext());}
    return target;
  }
  process(result){const target=this.connect();if(target)target.process(result??{landmarks:[],handedness:[]},this.getVideo());}
  reset(){this.target=null;this.stream=undefined;}
}
