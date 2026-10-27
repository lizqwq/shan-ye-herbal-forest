import * as THREE from '../vendor/three.js';
// 六个试样共享相机、路面、实例化与回收机制；差异来自真实地形与植物配方。
export const STUDY_SCENES={alpine:{title:'阿尔卑斯 · 冰湖缓行'},fjord:{title:'挪威峡湾 · 雾岸下行'},aegean:{title:'爱琴海峡 · 海湾石径'},sahara:{title:'撒哈拉 · 干谷寻沙'},rift:{title:'东非裂谷 · 旷野登坡'},delta:{title:'奥卡万戈 · 水泽漫行'}};
const palettes={fjord:['#8f9f8d','#a4b29c','#d9e1da','#c4c6b3'],aegean:['#b8b697','#c7c3a6','#e3e4d6','#d9cbb0'],sahara:['#c5a27b','#d2b68b','#e9dfc9','#ddc29a'],rift:['#b3aa7d','#c4b58a','#e2ddc9','#cbb18a'],delta:['#99ab86','#afba94','#dbe1ce','#c4bd99']};
export function regionalHeight(d,o,k){const t=Math.max(0,d),edge=Math.max(0,Math.abs(o)-5);let h;
 if(k==='fjord')h=-6+18*Math.exp(-t/55);
 else if(k==='aegean')h=-4+13*Math.exp(-t/65);
 else if(k==='sahara')h=4+4*(1-Math.exp(-t/100));
 else if(k==='rift')h=10+5*(1-Math.exp(-t/100));
 else h=.25+Math.sin(t*.035)*.15;
 if((k==='fjord'||k==='aegean')&&o>5)return h-Math.min(edge*.7,16);
 // 裂谷是下陷的地堑：近岸台地→断崖→谷底→对岸断崖，而不是凸起的山。
 if(k==='rift'&&o>6){
  if(o<7)return h-(o-6)*.08;
  if(o<17)return h-.08-(o-7)/10*16;
  if(o<65)return h-16.08+Math.sin(t*.018+o*.04)*.5;
  if(o<88)return h-34.32+(o-65)/23*19;
  return h+2.92+Math.sin(t*.025)*.6;
 }
 if(k==='delta'&&o>5)return h-Math.min(edge*.6,2.8);
 return h+Math.sin(t*.025+o*.04)*Math.min(edge*.09,2.4)+(k==='sahara'?edge*.08:k==='rift'&&o<0?edge*.13:0);
}
export function regionalColor(d,o,k){if(k==='rift'){if(o>7&&o<18)return Math.sin(d*.07)>.2?'#b49a7d':'#a48a73';if(o>=18&&o<65)return '#d0bf9c';if(o>=65&&o<88)return '#b79f88';}const p=palettes[k]||palettes.fjord;return Math.sin(d*.035+o*.07)>.15?p[0]:p[1];}
export function regionalVegetation(segment,r,base,k){const out=[];const add=(type,n,side,a,b,scale=.7,v=.4)=>{for(let i=0;i<n;i++)out.push({type,d:segment*4+r()*4,offset:side*(a+r()*(b-a)),scale:scale+r()*v,flip:r()<.5?-1:1});};
 for(const side of [-1,1]){
  if(k==='fjord'){add(base+3,9,side,2,18);add(22,4,side,2,15,.5);add(base+6,4,side,2.5,16,.5);add(base+7,4,side,3,17,.4);if(side<0&&segment%2===0){add(3,2,side,7,28,.9);add(18,1,side,5,15,.35);}if(segment%3===0)add(8,2,side,4,16,.25);}
  if(k==='aegean'){add(11,5,side,2,17,.45);add(base+8,3,side,2,12,.5);add(base+9,4,side,2,13,.5);add(base+5,2,side,3,14,.6);add(12,5,side,2,17,.4);add(8,3,side,2,19,.035,.07);if(side<0&&segment%5===0){add(10,1,side,8,20,.65);add(26,1,side,15,30,.4);}}
  if(k==='sahara'){add(12,5,side,3,28,.5);add(16,2,side,5,25,.45);if(segment%7===0)add(base+10,1,side,10,23,.8);if(segment%13===0)add(13,1,side,19,35,.55);if(segment%9===0)add(base+11,1,side,12,26,.8);if(segment%4===0)add(8,3,side,4,22,.1,.12);}
  if(k==='rift'){add(12,13,side,2,28,.65);add(15,2,side,3,12,.65);add(16,3,side,5,23,.5);if(segment%5===0)add(13,1,side,12,30,1);if(segment%15===0)add(14,1,side,23,38,1.2,.2);if(segment%6===0)add(25,1,side,13,25,.45);}
  if(k==='delta'){add(base+13,10,side,2,20,.9);if(side>0){add(28,4,side,6,12,.9);add(base+12,5,side,4,10,.9);}else{add(base+12,3,side,4,13,.65);if(segment%8===0)add(29,1,side,13,27,.9);}}
 }
 return out.filter(e=>!(['fjord','aegean'].includes(k)&&e.offset>12)&&!(k==='rift'&&e.offset>5.5));
}
export function regionalBackdrop(f){const k=f.artStudy,p=palettes[k],g=new THREE.Group();g.name=k+'-art-study';
 const polygon=(pts,c)=>{const shape=new THREE.Shape();pts.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),f.material({color:c,side:THREE.DoubleSide}));g.add(m);return m;};
 const ridge=(z,c,points)=>{const m=polygon([[-240,-25],...points,[240,-25]],c);m.userData.remote=true;m.position.z=z;if(k==='sahara')m.position.y=10;if(k==='rift')m.position.y=18;return m;};
 if(k==='fjord'){ridge(-240,'#b4c3bd',[[-240,20],[-180,74],[-110,80],[-65,18],[25,14],[90,74],[180,92],[240,55]]);ridge(-170,'#8faaa5',[[-240,22],[-150,68],[-90,62],[-45,0],[40,0],[95,59],[180,76],[240,21]]);}
 if(k==='aegean'){ridge(-240,'#b9c5bf',[[-240,9],[-155,20],[-85,7],[0,4],[80,16],[140,24],[240,6]]);ridge(-175,'#c9c4ab',[[-240,20],[-170,31],[-100,10],[-50,-6],[240,-9]]);}
 if(k==='sahara'){ridge(-230,'#c6a48c',[[-240,13],[-140,24],[-40,15],[60,28],[160,22],[240,12]]);ridge(-155,'#d9b48b',[[-240,4],[-170,32],[-80,22],[0,5],[95,24],[155,36],[240,14]]);ridge(-115,'#d3ac7f',[[-240,8],[-170,18],[-90,6],[0,-4],[100,9],[170,18],[240,3]]);}
 // 裂谷远处保持开口，不用横贯整个谷口的山体面片遮挡谷底。
 if(k==='rift'){ridge(-280,'#c9c2ad',[[-240,-8],[-100,-7],[-35,-30],[45,-33],[120,-8],[240,-7]]);}
 if(k==='rift'){
  // 与真实坡面贴合的宽岩层色带，随路径弯曲；不用悬空的立面贴图。
  const ribbon=(offsetA,offsetB,color)=>{const pos=[],idx=[];for(let d=0;d<=240;d+=4){for(const o of [offsetA(d),offsetB(d)]){const q=f.worldSample((f.stageStart||0)+d,o).position,origin=f.worldSample(f.stageStart||0,0).position;pos.push(q.x-origin.x,q.y+.035,q.z-origin.z);}if(d){const n=d/4*2;idx.push(n-2,n-1,n,n-1,n+1,n);}}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);g.add(new THREE.Mesh(geo,f.material({color,side:THREE.DoubleSide})));};
  for(const [a,b] of [[7,17],[65,88]])for(const t of [.26,.54,.77])ribbon(d=>a+(b-a)*(t+Math.sin(d*.04)*.015),d=>a+(b-a)*(t+.035+Math.sin(d*.04)*.015),'#c6ad8f');
  ribbon(d=>37+Math.sin(d*.035)*5,d=>38.1+Math.sin(d*.035)*5,'#dcd0b1');
 }
 if(k==='delta')ridge(-240,'#a7b8a1',[[-240,1],[-170,4],[-90,2],[0,3],[90,1],[170,4],[240,2]]);
 // 宽阔水面使用真实水平面；沿岸坡面下沉，不会生成竖直矩形水墙。
 const water=(x,y,z,rx,rz,c)=>{const sh=new THREE.Shape();sh.absellipse(0,0,rx,rz,0,Math.PI*2,false);const m=new THREE.Mesh(new THREE.ShapeGeometry(sh,80),f.material({color:c,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);g.add(m);};
 if(['fjord','aegean','delta'].includes(k)){const m=new THREE.Mesh(new THREE.PlaneGeometry(1100,2200),f.material({color:k==='delta'?'#adbfaf':k==='fjord'?'#a4bfbc':'#9fbfbe',side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(450,k==='delta'?-1:k==='fjord'?-8:-7,-850);g.add(m);}
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(700,500),f.material({color:p[1],side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.set(0,k==='rift'?-45:-15,-280);g.add(floor);
 f.scene.add(g);f.studyBackdrop=g;f.scene.background=new THREE.Color(p[2]);f.scene.fog=new THREE.Fog(p[2],80,300);f.camera.far=380;f.camera.updateProjectionMatrix();f.road.material.color.set(p[3]);f.shoulder.material.color.set(p[0]);
}

