import {ASIAN_ANIMAL_INFO,ASIAN_ANIMAL_POOLS} from './asian-habitats.js';
import {REGIONAL_ANIMAL_INFO,REGIONAL_ANIMAL_POOLS} from './current-animals.js';
export const HABITAT_SCENES=[
 [{name:'栎树林缘',ground:'#9fa984'},{name:'松影缓坡',ground:'#abb18e'},{name:'古栎岩隙',ground:'#929e80'}],
 [{name:'枫杨溪岸',ground:'#91a18d'},{name:'竹影石涧',ground:'#879b8a'},{name:'苔岸幽径',ground:'#a0b19a'}],
 [{name:'高山花甸',ground:'#adb48b'},{name:'碎石草坡',ground:'#a9ae99'},{name:'圆柏岩脊',ground:'#b5b69f'}],
 [{name:'冰湖缓行',ground:'#aab49b'},{name:'峡湾雾岸',ground:'#91a18d'},{name:'海湾石径',ground:'#c4bfa3'}],
 [{name:'干谷寻沙',ground:'#cbb897'},{name:'裂谷旷野',ground:'#bd9975'},{name:'奥卡水泽',ground:'#9eaf91'}]
];
export const habitatPhase=local=>local<65?0:local<130?1:2;
export const habitatAt=(zone,local)=>HABITAT_SCENES[zone][habitatPhase(local)];
// 动物为景观对象，无采集碰撞。每张图仅有2—3种适生物种。
export const WILDLIFE=[
 {id:'squirrel',name:'欧亚红松鼠',size:[.9,.95],zones:[0],offset:[3,9],kind:'small'},
 {id:'tit',name:'林间山雀',size:[.55,.55],zones:[0],offset:[3,11],kind:'bird'},
 {id:'egret',name:'小白鹭',size:[1.0,1.45],zones:[1],offset:[4.3,6.8],kind:'wader'},
 {id:'frog',name:'溪岸蛙',size:[.65,.5],zones:[1],offset:[3.2,5],kind:'small'},
 {id:'marmot',name:'喜马拉雅旱獭',size:[1.0,1.0],zones:[2],offset:[3,9],kind:'small'},
 {id:'bharal',name:'岩羊',size:[2.3,1.8],zones:[2],offset:[5,15],kind:'grazer'},
 {id:'rabbit',name:'欧洲穴兔',size:[.95,1.0],zones:[3],offset:[3,8],kind:'small'},
 {id:'partridge',name:'红腿石鸡',size:[.75,.75],zones:[3],offset:[3,9],kind:'bird'},
 {id:'gull',name:'黄腿银鸥',size:[1.3,.9],zones:[3],offset:[7,16],kind:'flying'},
 {id:'zebra',name:'平原斑马',size:[3.1,2.4],zones:[4],offset:[8,19],kind:'grazer'},
 {id:'elephant',name:'非洲草原象',size:[5.4,4.4],zones:[4],offset:[13,26],kind:'large'},
 {id:'gazelle',name:'汤氏瞪羚',size:[2.0,1.8],zones:[4],offset:[8,19],kind:'grazer'}
];
WILDLIFE.push(...[{"id":"alpine_marmot","name":"阿尔卑斯旱獭","size":[1.1,1.1],"zones":[3],"offset":[4,12],"kind":"small"},{"id":"ibex","name":"阿尔卑斯羱羊","size":[2.4,2],"zones":[3],"offset":[8,21],"kind":"grazer"},{"id":"oryx","name":"南非剑羚","size":[3.2,2.5],"zones":[4],"offset":[10,23],"kind":"grazer"},{"id":"meerkat","name":"狐獴","size":[0.65,1],"zones":[4],"offset":[4,13],"kind":"small"},{"id":"hippo","name":"河马","size":[3.9,2.4],"zones":[4],"offset":[4.8,8],"kind":"wader"}]);
WILDLIFE.push({id:'chukar',name:'爱琴海石鸡',size:[.75,.75],zones:[3],offset:[3,10],kind:'bird'});
for(const info of REGIONAL_ANIMAL_INFO){const existing=WILDLIFE.find(a=>a.id===info.id);if(existing)Object.assign(existing,info);else WILDLIFE.push({...info,zones:[3,4]});}
for(const [id,info]of Object.entries({squirrel:{name:'岩松鼠',latin:'Sciurotamias davidianus',desc:'中国山地林缘常见的小型啮齿动物，常沿岩隙、灌丛和林地活动。'},tit:{name:'远东山雀',latin:'Parus minor',desc:'在林缘与疏林中寻找昆虫，白色脸颊与深色头顶醒目。'},egret:{latin:'Egretta garzetta',desc:'在浅水边缓步觅食的小白鹭，细长腿与洁白羽毛有助于辨认。'},frog:{name:'泽陆蛙',latin:'Fejervarya multistriata',desc:'活动于南方湿润草丛、浅水岸和农田附近，常隐蔽在低矮植被间。'},marmot:{latin:'Marmota himalayana',desc:'西部高山草甸的洞栖动物，常在洞口观察周围，冬季在地下越冬。'},bharal:{latin:'Pseudois nayaur',desc:'高原岩坡与草甸上的食草动物，灰褐体色与岩地相近，善于攀行。'}})){Object.assign(WILDLIFE.find(a=>a.id===id),info);}
for(const animal of ASIAN_ANIMAL_INFO)if(!WILDLIFE.some(a=>a.id===animal.id))WILDLIFE.push(animal);
const activeRegionalIds=new Set(REGIONAL_ANIMAL_INFO.map(a=>a.id));for(let i=WILDLIFE.length-1;i>=0;i--)if(!activeRegionalIds.has(WILDLIFE[i].id)&&WILDLIFE[i].zones.every(z=>z>=3))WILDLIFE.splice(i,1);
const OLD_REGIONAL_ANIMALS={3:[['gull','chukar'],['rabbit','partridge'],['alpine_marmot','ibex']],4:[['oryx','meerkat'],['zebra','elephant','gazelle'],['egret','hippo','elephant']]};
const ANIMAL_POOLS={...ASIAN_ANIMAL_POOLS,...REGIONAL_ANIMAL_POOLS};
export const wildlifeFor=(zone,phase=0)=>ANIMAL_POOLS[zone]?ANIMAL_POOLS[zone][phase].map(id=>WILDLIFE.find(a=>a.id===id)):WILDLIFE.filter(a=>a.zones.includes(zone));
// 按沿路分段生成；固定稀疏密度，面片总量受活跃距离窗口约束。
export function wildlifeEntries(segment,zone,random=Math.random,phase=0){
 const pool=wildlifeFor(zone,phase);if(segment%2!==0)return [];
 const species=pool[Math.floor(segment/2)%pool.length],side=species.id==='giant_panda'?-1:species.kind==='wader'||species.kind==='flying'?1:random()<.5?-1:1;
 return [{species,d:segment*10+(species.id==='giant_panda'?12:3)+random()*4,offset:side*(species.offset[0]+random()*(species.offset[1]-species.offset[0])),scale:.85+random()*.3,phase:random()*Math.PI*2}];
}

