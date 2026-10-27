import {classifyHand} from './hand-gestures.js';
import {fingerScrollDirection} from './edge-gestures.js';
// Track each hand's open→fist sequence separately. An idle second palm must
// neither steal a grab nor erase the opening samples that armed that grab.
export class InteractionHand {
  constructor(){this.reset();}
  reset(){this.active=null;this.history={left:[],right:[]};this.previous={};}
  process(left,right,now,{holding=false,scrollable=false}={}){
    const points={left,right}, poses={left:classifyHand(left),right:classifyHand(right)};
    const ids=['left','right'].filter(id=>poses[id].valid);
    if(!ids.length){this.reset();return null;}
    let next=this.active;
    const closing=ids.find(id=>poses[id].fist&&!this.previous[id]?.fist&&this.history[id].length>=2);
    if(!holding&&closing)next=closing;
    else if(!holding&&scrollable&&ids.some(id=>!poses[id].open&&fingerScrollDirection(points[id])))next=ids.find(id=>!poses[id].open&&fingerScrollDirection(points[id]));
    else if(!next||!poses[next].valid)next=ids.find(id=>poses[id].open)||ids[0];
    const switched=next!==this.active, prime=switched?this.history[next].slice():[];
    this.active=next;
    for(const id of ['left','right']){
      this.history[id]=this.history[id].filter(s=>now-s.now<1800);
      if(poses[id].open){this.history[id].push({points:points[id],now});if(this.history[id].length>12)this.history[id].shift();}
      else if(!poses[id].valid)this.history[id]=[];
    }
    this.previous=poses;
    return {id:next,points:points[next],prime,switched};
  }
}
