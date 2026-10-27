import {HABITAT_SCENES} from './habitats.js';

// 一轮内洗牌且不放回；固定模式只锁定大地图，不锁定小地图顺序。
export class ExplorationRoute {
  constructor(map=0,mode='random',random=Math.random){this.random=random;this.mode=mode==='fixed'?'fixed':'random';this.map=map;this.round=0;this.startRound();}
  startRound(){
    this.remaining=HABITAT_SCENES[this.map].map((_,i)=>i);
    for(let i=this.remaining.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.remaining[i],this.remaining[j]]=[this.remaining[j],this.remaining[i]];}
    this.round++;this.visited=0;this.next();
  }
  next(){
    if(!this.remaining.length){
      if(this.mode==='random')this.map=(this.map+1+Math.floor(this.random()*(HABITAT_SCENES.length-1)))%HABITAT_SCENES.length;
      this.startRound();return;
    }
    this.submap=this.remaining.pop();this.visited++;
    const [min,max]=this.mode==='fixed'?[300,600]:[200,350];
    this.length=min+Math.floor(this.random()*(max-min+1));this.progress=0;
  }
  advance(meters){
    const transitions=[];
    while(meters>=this.length-this.progress){meters-=this.length-this.progress;this.next();transitions.push({map:this.map,submap:this.submap,length:this.length});}
    this.progress+=meters;return transitions;
  }
}
