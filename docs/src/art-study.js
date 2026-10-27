import {ASIAN_PLANT_TYPES} from './asian-habitats.js';
import {isAsian,asianHeight,asianColor,asianVegetation,asianBackdrop} from './asian-landscapes.js';
import * as THREE from '../vendor/three.js';
import {regionalHeight,regionalColor,regionalVegetation,regionalBackdrop} from './regional-study.js';

// 正式探索与美术预览共用的场景配方。
export const STUDY_TYPES=[
  {name:'study_willow',capacity:350,size:[1.4,.65]},
  {name:'study_edelweiss',capacity:350,size:[.8,.8]},
  {name:'study_gentian',capacity:350,size:[.7,.65]},
  {name:'study_grass',capacity:900,size:[1.2,.65]},
  {name:'study_seedling',capacity:120,size:[1.2,2.1]},
  {name:'study_rockrose',capacity:300,size:[1.5,1.0]},
  {name:'study_bilberry',capacity:300,size:[1.5,1.0]},
  {name:'study_lichen',capacity:300,size:[1.5,1.0]},
  {name:'study_rosemary',capacity:300,size:[1.5,1.0]},
  {name:'study_thyme',capacity:300,size:[1.5,1.0]},
  {name:'study_tamarisk',capacity:300,size:[3.5,4.5]},
  {name:'study_desertdate',capacity:300,size:[3.5,4.5]},
  {name:'study_reed',capacity:600,size:[1.5,2.2]},
  {name:'study_sedge',capacity:700,size:[1.4,.9]},
  ...ASIAN_PLANT_TYPES
];
// 站在已开始下行的坡面上，连续下降至湖岸，接近湖边时逐渐放缓。
// 相机、路面、植被都取同一个连续高程，行走时眼高始终为 1.62 米。
export const studyTrailHeight=d=>-7+17*Math.exp(-Math.max(0,d)/45);
export function studyHeight(d,offset,kind='alpine'){
  if(isAsian(kind))return asianHeight(d,offset,kind);
  if(kind!==true&&kind!=='alpine')return regionalHeight(d,offset,kind);
  const base=studyTrailHeight(d),edge=Math.max(0,Math.abs(offset)-5);
  // 道路附近保留平整横截面，防止粗网格地表穿过弯曲路面。
  if(offset>4.5&&d<125){const basin=Math.min(1,(offset-4.5)/6.5)*Math.min(1,(Math.max(0,d)+4)/18)*Math.min(1,(125-d)/15);return base*(1-basin)-10*basin;}
  return base+Math.sin(d*.04+offset*.08)*Math.min(edge*.09,1.7)+Math.max(0,-offset-10)*.15;
}
export function studyGroundColor(d,offset,kind='alpine'){
  if(isAsian(kind))return asianColor(d,offset,kind);
  if(kind!==true&&kind!=='alpine')return regionalColor(d,offset,kind);
  const patch=Math.sin(d*.038+offset*.055);
  return d<27?(patch>.2?'#a4af8c':'#9eab88'):d<60?(patch>-.2?'#acb795':'#a5b18f'):'#b1bc9d';
}
export function studyVegetation(segment,random,base,kind='alpine'){
  if(isAsian(kind))return asianVegetation(segment,random,base,kind);
  if(kind!==true&&kind!=='alpine')return regionalVegetation(segment,random,base,kind);
  const entries=[];const add=(type,count,side,min,max,scale,variation)=>{for(let i=0;i<count;i++)entries.push({type,d:segment*4+random()*4,offset:side*(min+random()*(max-min)),scale:scale+random()*variation,flip:random()<.5?-1:1});};
  for(const side of [-1,1]){
    add(base+3,12,side,1.8,18,.8,.45);
    add(base,4,side,2.5,17,.8,.4);
    add(base+1,3,side,1.9,10,.8,.4);
    add(base+2,3,side,2,12,.7,.35);
    if(segment%6===0)add(base+4,1,side,6,20,.6,.6);
    if(segment%3===0)add(8,2,side,3.5,15,.18,.3);
    if(segment>12&&side<0&&segment%2===0)add(3,3,side,17,44,.5,.35);
  }
  return entries.filter(e=>!(e.offset>7&&e.d>15));
}
export function makeStudyBackdrop(forest){
  if(isAsian(forest.artStudy))return asianBackdrop(forest);
  if(forest.artStudy!==true&&forest.artStudy!=='alpine')return regionalBackdrop(forest);
  const group=new THREE.Group();group.name='alpine-art-study';
  const valleyFloor=new THREE.Mesh(new THREE.PlaneGeometry(700,460),forest.material({color:'#b2bd9e',side:THREE.DoubleSide}));valleyFloor.rotation.x=-Math.PI/2;valleyFloor.position.set(0,-10.7,-275);group.add(valleyFloor);
  const mesh=(coords,color)=>{const triangles=[];for(let i=1;i<coords.length-1;i++)triangles.push(coords[0],coords[i],coords[i+1]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(triangles.flat(),3));const m=new THREE.Mesh(g,forest.material({color,side:THREE.DoubleSide}));m.userData.remote=true;group.add(m);return m;};
  // 实体远山有独立远近层次；湖面与坡路都处于三维场景中。
  for(const [z,color,peaks] of [[-235,'#bcc9c1',[[-180,34,65],[-120,52,48],[-64,41,43],[-18,62,57],[45,46,62],[108,56,60],[177,36,63]]],[-181,'#9fadab',[[-151,28,73],[-89,41,57],[-24,34,45],[50,39,62],[136,31,71]]]]){
    for(const [x,top,width] of peaks){
      mesh([[x-width,-12,z],[x-width*.38,top*.47,z-3],[x-4,top,z-8],[x+6,top-5,z-7],[x+width*.43,top*.48,z-2],[x+width,-12,z]],color);
      mesh([[x-4,top,z-8],[x+6,top-5,z-7],[x+width,-12,z],[x+12,top*.3,z+2]],z===-181?'#afbbb3':'#c9d1c6');
      mesh([[x-4,top,z-8],[x-13,top-11,z-5],[x-3,top-8,z-3],[x+5,top-15,z-2],[x+14,top-13,z-4],[x+6,top-5,z-7]],'#e7e7d8');
    }
  }
  const shape=new THREE.Shape();shape.absellipse(0,0,27,32,0,Math.PI*2,false,0);
  const lake=new THREE.Mesh(new THREE.ShapeGeometry(shape,60),forest.material({color:'#9ebdb6',side:THREE.DoubleSide}));lake.rotation.x=-Math.PI/2;lake.position.set(40,-7.5,-55);group.add(lake);
  forest.scene.add(group);forest.studyBackdrop=group;
  forest.scene.background=new THREE.Color('#e0e6dc');forest.scene.fog=new THREE.Fog('#d1dbd0',80,300);
  forest.camera.far=380;forest.camera.updateProjectionMatrix();
  forest.road.material.color.set('#d5c9ab');forest.shoulder.material.color.set('#adb28f');
}
