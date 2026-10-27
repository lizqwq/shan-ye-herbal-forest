import {habitatPhase} from './habitats.js';
// 三种地貌拥有独立植被配方、天空远景与地形高度，不仅是换色。
export const BIOMES=[
  {name:'林下小径',sky:'forest_path.jpg',fog:'#cbd0b7',near:18,far:96,ground:'#9fa984',road:'#d5c7a9',shoulder:'#b6b28e'},
  {name:'雾谷深处',sky:'mist_valley.jpg',fog:'#c4d1c9',near:12,far:72,ground:'#91a18d',road:'#c9cbbb',shoulder:'#a5b39c'},
  {name:'高山草甸',sky:'alpine_meadow.jpg',fog:'#d8ddce',near:38,far:150,ground:'#adb48b',road:'#d2c9ad',shoulder:'#babd99'},
 {name:'银叶石坡',sky:'silver_coast.jpg',fog:'#dbddd1',near:35,far:150,ground:'#c4bfa3',road:'#e0d5b9',shoulder:'#c9c1a5'},
 {name:'红土疏林',sky:'red_savanna.jpg',fog:'#e2d3b6',near:38,far:145,ground:'#bc9875',road:'#d5b18b',shoulder:'#c39b78'}
];
export const biomeIndex=distance=>distance<200?0:distance<400?1:2;
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function baseHeight(d,zone=biomeIndex(d)){if(zone===0)return 0;if(zone===1)return Math.sin(d*.04)*.18;if(zone===2)return Math.sin(d/34)*.8*ease(d/20);if(zone===3)return Math.sin(d*.018)*.45;return Math.sin(d*.014)*.22;}
export function surfaceHeight(d,offset=0,zone=biomeIndex(d)){
  // 为低面数地形留足平坦路肩，避免大三角形穿过精细曲线路面。
  const base=baseHeight(d,zone),edge=Math.max(0,Math.abs(offset)-4);
  if(zone===3){const phase=habitatPhase(d);if(phase===0)return base+Math.max(0,-offset-5)*.06-Math.max(0,offset-6)*.22;if(phase===1)return base+Math.sin(d*.055+offset*.06)*Math.min(edge*.12,3.2);return base+Math.min(edge*.32,9)*(1+Math.sin(d*.06+offset*.05)*.22);}
  if(zone===4){const phase=habitatPhase(d);if(phase===0)return base+Math.sin(d*.025+offset*.045)*Math.min(edge*.07,2.4);if(phase===1)return base+Math.max(0,-offset-12)*.3+Math.sin(offset*.07)*Math.min(edge*.035,1);const channels=Math.max(Math.exp(-Math.pow((offset-6)/3.8,4)),Math.exp(-Math.pow((offset-18)/4.7,4)));return base-channels*1.35;}
  if(zone===0)return base+ease((d-45)/25)*Math.min(edge*.11,2.8)*(.65+Math.sin(d*.04)*.35);
  if(zone===1){const channel=Math.exp(-Math.pow((offset-6)/2.8,4));return base+Math.min(edge*(.15+Math.max(0,1-Math.abs(d-100)/40)*.6),8)-channel*1.7;}
  return base+ease(edge/4)*(1.1+Math.sin(d*.055+offset*.11)*.65)*Math.min(edge/5,4.5);
}
export const VEGETATION_TYPES=[
  {name:'tree',capacity:650,size:[5.5,11]}, {name:'bush',capacity:400,size:[2.6,1.7]}, {name:'grass',capacity:650,size:[.9,.72]},
  {name:'pine',capacity:120,size:[3.6,6.5]}, {name:'fern',capacity:700,size:[1.7,1.1]}, {name:'reed',capacity:350,size:[1.25,1.9]},
  {name:'meadow',capacity:1100,size:[1.4,.8]}, {name:'flower',capacity:700,size:[1.2,1.15]}, {name:'rock',capacity:220,size:[3.4,2.2]}, {name:'willow',capacity:280,size:[4.5,8.5]}, {name:'olive',capacity:200,size:[5.5,5.8]}, {name:'silver_bush',capacity:700,size:[2.2,1.2]}, {name:'dry_grass',capacity:1000,size:[1.3,1.0]}, {name:'acacia',capacity:200,size:[7.5,6.8]}, {name:'baobab',capacity:80,size:[11,14]}, {name:'aloe',capacity:250,size:[1.8,1.7]}, {name:'dry_bush',capacity:350,size:[2.1,1.15]}, {name:'birch',capacity:300,size:[4.0,10]}, {name:'alder',capacity:250,size:[4.8,8.8]}, {name:'bamboo',capacity:450,size:[2.3,10]}, {name:'juniper',capacity:200,size:[2.8,1.8]}, {name:'maritime_pine',capacity:180,size:[6,7.5]}, {name:'heather',capacity:400,size:[1.4,1.0]}, {name:'lavender_bush',capacity:250,size:[1.6,1.2]}, {name:'limestone',capacity:400,size:[4,3.4]}, {name:'red_rock',capacity:300,size:[5.5,4.5]}, {name:'old_oak',capacity:180,size:[8.5,12]}, {name:'cypress',capacity:180,size:[2.4,10]}, {name:'papyrus',capacity:650,size:[2.1,3.0]}, {name:'fan_palm',capacity:100,size:[5,9]}, {name:'wheat',capacity:900,size:[1.5,1.15]}, {name:'camelthorn',capacity:80,size:[6.5,6]}
];
export function vegetationEntries(segment,random=Math.random,zone=biomeIndex(segment*4),local=segment*4){
  const entries=[],start=segment*4,phase=habitatPhase(local);
  const add=(type,count,side,min,max,size=.65,variation=.7)=>{for(let i=0;i<count;i++)entries.push({type,d:start+random()*4,offset:side*(min+random()*(max-min)),scale:size+random()*variation,flip:random()<.5?-1:1});};
  for(const side of [-1,1]){
    if(zone===0){add(phase===1?17:phase===2?26:0,phase===1?4:6,side,4.2,23);add(1,phase===1?2:4,side,2.15,13);add(2,phase===1?13:7,side,1.8,6.3,.6,.9);if(phase===2&&segment%3===0)add(8,2,side,5,13,.6,1.1);}
    if(zone===1){add(phase===0?18:phase===1?19:9,phase===1?7:3,side,side>0?9:3.8,side>0?20:15,.65,.65);add(4,8,side,1.85,4.7,.7,.8);if(phase===1||segment%3===0)add(8,phase===1?3:1,side,8,19,1.6,1.4);}
    if(zone===3){
      if(phase===0){add(11,5,side,2.4,13,.35,.5);add(12,5,side,2.2,14,.35,.5);add(8,12,side,2.8,17,.07,.12);if(side<0&&segment%7===0)add(10,1,side,12,24,.5,.4);}
      if(phase===1){add(27,2,side,5,17,.7,.3);if(segment%3===0)add(10,2,side,12,27,.7,.3);add(12,3,side,2.5,8,.4,.4);add(30,16,side,7,30,.5,.45);add(23,2,side,3,10,.4,.4);}
      if(phase===2){if(segment%3===0)add(3,2,side,12,27,.6,.65);add(20,3,side,5,20,.4,.5);add(6,10,side,2,19,.5,.7);add(7,3,side,2.4,14,.4,.5);add(8,3,side,6,24,.5,.9);}
    }
    if(zone===4){
      if(phase===0){add(12,3,side,3,24,.3,.5);add(16,2,side,5,27,.3,.5);if(segment%12===0)add(31,1,side,17,30,.5,.4);}
      if(phase===1){add(12,10,side,2,25,.4,.7);add(16,3,side,4,22,.4,.6);if(segment%4===0)add(13,2,side,8,28,.65,.6);if(segment%11===0)add(14,1,side,18,32,.9,.25);add(15,1,side,4,12,.5,.4);if(segment%4===0)add(25,1,side,16,26,.4,.5);}
      if(phase===2){add(6,10,side,2,24,.5,.6);if(side>0){add(28,9,side,4.5,9,.7,.5);add(5,8,side,4,8,.8,.6);}else{add(1,3,side,5,19,.4,.5);if(segment%9===0)add(29,1,side,14,28,.7,.4);}}
    }
    if(zone===2){add(6,phase===0?10:8,side,1.8,27,.6,.9);add(7,phase===0?10:2,side,2.1,18,phase===0?.8:.5,.5);if(phase===2)add(20,4,side,4,18,.5,.8);if(phase>0)add(8,phase===1?5:2,side,3.4,20,.8,1.7);if(segment%9===0&&side<0)add(3,1,side,14,25,.4,.5);}
  }
  if(zone===1){add(5,8,1,4.5,7.5,.65,.7);if(segment%2===0)add(8,2,1,4.4,7.8,.3,.4);}
  return entries;
}
