import {ANIMAL_ANCHORS} from './animal-anchors.js';
import {ASIAN_KEYS} from './asian-landscapes.js';
import {PLANT_ANCHORS} from './plant-anchors.js';
import {terrainContact,plantedCenter} from './plant-grounding.js';
import {STUDY_TYPES,studyHeight,studyGroundColor,studyVegetation,makeStudyBackdrop} from './art-study.js';
import {floraFor} from './habitat-flora.js';
import {ExplorationRoute} from './exploration.js';
import * as THREE from '../vendor/three.js';
import {createPath,samplePath,WALK_SPEED,ROAD_HALF_WIDTH} from './path.js';
import {HERBS,herbImage} from './herbs.js';
import {BIOMES,VEGETATION_TYPES,biomeIndex,baseHeight,surfaceHeight,vegetationEntries} from './biomes.js';

import {MAPS,RARITY_GROUPS} from './map-catalog.js';
import {HerbSpawner} from './herb-spawner.js';
import {smoothSpeed,RUN_SPEED} from './movement.js';
import {habitatAt,WILDLIFE,wildlifeEntries} from './habitats.js';
export class Forest {
  constructor(container,{onUpdate,onCollect,onError,preview=false,artStudy=false}) {
    Object.assign(this,{container,onUpdate,onCollect,onError,preview,artStudy});this.random=Math.random;this.studyOverride=artStudy;
    this.path=createPath(); this.length=this.path.getLength();
    this.speed=WALK_SPEED;this.targetSpeed=WALK_SPEED;this.spawner=new HerbSpawner();this.biomeId=0;this.stageStart=0;this.distance=0; this.moving=false; this.look=0; this.targetLook=0;this.lateralOffset=0;this.targetLateral=0;
    this.route=new ExplorationRoute(0,'random');this.submapId=this.route.submap;this.submapLength=this.route.length;
    this.herbs=[]; this.picking=null; this.disposed=false;
    this.nextCommon=5+Math.random();this.nextRare=50;
    this.scene=new THREE.Scene();this.scene.fog=new THREE.Fog('#cbd0b7',18,96);
    this.camera=new THREE.PerspectiveCamera(58,1,0.1,180);
    this.raycaster=new THREE.Raycaster();this.clock=new THREE.Clock();
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.setClearColor('#d9dcc7');
    container.appendChild(this.renderer.domElement);
    this.assetsReady=new Promise(resolve=>{this.loadingManager=new THREE.LoadingManager(resolve);});this.loader=new THREE.TextureLoader(this.loadingManager);this.textures=[];this.materials=[];
    this.plane=new THREE.PlaneGeometry(1,1);
    this.makeWorld();if(!this.studyOverride)this.travelTo(0,MAPS[0],{submap:0,length:this.submapLength});this.resize();
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);
    this.renderer.domElement.addEventListener('webglcontextlost',this.onContextLost=(event)=>{event.preventDefault();this.moving=false;onError('画面暂时中断，请刷新页面重新进入秘境。');});
    this.frame=this.frame.bind(this);this.animation=requestAnimationFrame(this.frame);
  }
  texture(url) {
    const t=this.loader.load(url,undefined,undefined,()=>this.onError?.('部分画面素材未载入，请检查网络后刷新。'));
    t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());
    this.textures.push(t);return t;
  }
  material(params) {const m=new THREE.MeshBasicMaterial(params);this.materials.push(m);return m;}
  visualLocal(distance){return (this.submapId??0)*65+Math.max(0,Math.min(64,(distance-this.stageStart)/(this.submapLength||300)*64));}
  worldSample(distance,offset=0){const sample=samplePath(this.path,distance,offset);if(this.artStudy)sample.position.x+=Math.sin((distance-this.stageStart)*.06)*4;sample.position.y=this.artStudy?studyHeight(distance-this.stageStart,offset,this.artStudy):surfaceHeight(this.visualLocal(distance),offset,this.biomeId);return sample;}
  makeTerrain(){
    const vertices=[],colors=[],indices=[],start=Math.max(0,this.distance-35),rows=65,columns=typeof this.artStudy==='string'&&this.artStudy.startsWith('mist')?100:50,spacing=200/columns;
    for(let row=0;row<=rows;row++){const d=start+row*3;for(let col=0;col<=columns;col++){const offset=(col-columns/2)*spacing,p=this.worldSample(d,offset).position;vertices.push(p.x,p.y-.12,p.z);const fieldColors=['#b7b58d','#c5b792','#aab28b','#c6bd9d'];const field=Math.floor((offset+Math.sin(d*.018)*12)/16);const color=this.artStudy?studyGroundColor(d-this.stageStart,offset,this.artStudy):this.biomeId===3&&this.submapId===1?fieldColors[(field%4+4)%4]:habitatAt(this.biomeId,this.visualLocal(d)).ground;const c=new THREE.Color(color);c.multiplyScalar(.985+Math.sin(row*13+col*7)*.015);colors.push(c.r,c.g,c.b);if(row&&col){const k=row*(columns+1)+col;indices.push(k-columns-2,k-columns-1,k-1,k-columns-1,k,k-1);}}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(indices);const mesh=new THREE.Mesh(g,this.terrainMaterial||(this.terrainMaterial=this.material({vertexColors:true,side:THREE.DoubleSide})));mesh.userData.grid={start,rows,columns,spacing};return mesh;
  }
  makeStream(){
    const vertices=[],indices=[];let i=0;
    for(let d=Math.max(0,this.distance-30);d<this.distance+155;d+=1){for(const side of [-1,1]){const p=samplePath(this.path,d,6+side*(this.biomeId===4?2.5:1.05)).position;vertices.push(p.x,baseHeight(this.visualLocal(d),this.biomeId)-.12,p.z);}if(i){const n=i*2;indices.push(n-2,n-1,n,n-1,n+1,n);}i++;}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);
    if(this.stream){this.stream.geometry.dispose();this.stream.geometry=geometry;}else{this.stream=new THREE.Mesh(geometry,this.material({color:'#bdcfc2',side:THREE.DoubleSide}));this.scene.add(this.stream);}this.stream.visible=!this.artStudy&&(this.biomeId===1||(this.biomeId===4&&this.submapId===2));
    if(!this.sea){this.sea=new THREE.Mesh(new THREE.PlaneGeometry(170,350),this.material({color:'#b9cbc8',side:THREE.DoubleSide}));this.sea.rotation.x=-Math.PI/2;this.scene.add(this.sea);}this.sea.visible=!this.artStudy&&((this.biomeId===3&&this.submapId===0)||(this.biomeId===4&&this.submapId===2));const seaPoint=this.worldSample(this.distance+65,82).position;this.sea.position.set(seaPoint.x,this.biomeId===4?-.8:-3,seaPoint.z);
  }
  applyBiome(){
    if(this.artStudy&&this.studyBackdrop)return;
    const index=this.biomeId,key=index+'-'+this.submapId;if(key===this.activeBiome)return;this.activeBiome=key;
    const biome=BIOMES[index];this.scene.background=index===3?(this.submapId===2?this.biomeSkies[2]:this.submapId===1?this.regionalSkies[0]:this.biomeSkies[3]):index===4?this.regionalSkies[1+this.submapId]:this.biomeSkies[index];this.scene.fog.color.set(biome.fog);this.scene.fog.near=biome.near;this.scene.fog.far=biome.far;
    this.road.material.color.set(biome.road);this.shoulder.material.color.set(biome.shoulder);
  }
  makeWorld() {
    // Scene.background 的等矩形纹理只受相机旋转影响，不随相机平移。
    this.regionalSkies=['tuscany.jpg','kalahari.jpg','rift_valley.jpg','okavango.jpg'].map(name=>{const t=this.texture('./skybox/'+name);t.mapping=THREE.EquirectangularReflectionMapping;return t;});
    this.biomeSkies=BIOMES.map(b=>{const t=this.texture('./skybox/'+b.sky);t.mapping=THREE.EquirectangularReflectionMapping;return t;});
    this.scene.background=this.biomeSkies[0];this.activeBiome=-1;
    this.ground=this.makeTerrain();this.scene.add(this.ground);this.makeStream();
    this.road=new THREE.Mesh(new THREE.BufferGeometry(),this.material({color:'#d5c7a9',side:THREE.DoubleSide}));
    this.shoulder=new THREE.Mesh(new THREE.BufferGeometry(),this.material({color:'#b6b28e',side:THREE.DoubleSide}));
    this.scene.add(this.road,this.shoulder);this.updateRoad();
    this.vegetationTypes=[...VEGETATION_TYPES,...STUDY_TYPES].map(type=>({...type}));
    this.vegetationTypes.forEach(type=>{
      type.mesh=new THREE.InstancedMesh(this.plane,this.material({map:this.texture(`./vegetation/${type.name}.png`),transparent:true,alphaTest:0.12,depthWrite:true,side:THREE.DoubleSide}),type.capacity);
      type.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);type.mesh.frustumCulled=false;this.scene.add(type.mesh);
    });
    this.animalSegments=new Map();this.animals=[];this.animalMaterials=Object.fromEntries(WILDLIFE.map(a=>[a.id,this.material({map:this.texture('./animals/'+a.id+'.png'),transparent:true,alphaTest:.08,side:THREE.DoubleSide})]));
    this.segments=new Map();this.updateVegetation(true);this.updateAnimals(true);
    this.herbMaterials=HERBS.map(h=>this.material({map:this.texture(herbImage(h)),transparent:true,alphaTest:0.08,side:THREE.DoubleSide}));
    // 不预置草药：只有真实前进里程才会进入各档刷新窗口。
    this.applyBiome();
  }
  strip(width,y) {
    if(this.artStudy)width*=.55;
    const positions=[],indices=[];const start=Math.max(0,this.distance-16),end=this.distance+120;
    let i=0;
    for(let d=start;d<=end+0.001;d+=0.75) {
      for(const side of [-1,1]) {const p=this.worldSample(d,width*side).position;positions.push(p.x,p.y+y,p.z);}
      if(i>0){const k=i*2;indices.push(k-2,k-1,k,k-1,k+1,k);}i++;
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
  }
  updateRoad() {
    this.road.geometry.dispose();this.shoulder.geometry.dispose();
    this.road.geometry=this.strip(ROAD_HALF_WIDTH,0.012);this.shoulder.geometry=this.strip(ROAD_HALF_WIDTH+0.32,0.002);
    this.lastRoad=this.distance;
  }
  updateVegetation(force=false) {
    const current=Math.floor(this.distance/4);
    if(!force&&current===this.lastSegment&&Math.abs(this.look-this.lastLook)<0.10)return;
    // 植被分段回收；草药由 advance 独立按身后位置立即回收。
    for(const [key] of this.segments)if(key<current-4||key>current+25)this.segments.delete(key);
    for(let s=Math.max(0,current-4);s<=current+25;s++) {
      if(this.segments.has(s))continue;
      const entries=this.artStudy?studyVegetation(s,this.random,VEGETATION_TYPES.length,this.artStudy):vegetationEntries(s,this.random,this.biomeId,this.visualLocal(s*4));
      this.segments.set(s,entries);
    }
    const counts=this.vegetationTypes.map(()=>0),dummy=new THREE.Object3D();
    for(const entries of this.segments.values())for(const e of entries) {
      const type=this.vegetationTypes[e.type],index=counts[e.type]++;
      if(index>=type.capacity)continue;
      const {position}=this.worldSample(e.d,e.offset),h=type.size[1]*e.scale;
      dummy.position.copy(position);
      // 透明底图的实际根际贴住三角地表，向下少量埋入；地形刷新后重新求落点。
      if(e.groundMesh!==this.ground){e.groundY=terrainContact(this.ground,e.d,e.offset,position);e.groundMesh=this.ground;}
      dummy.position.y=plantedCenter(e.groundY,h,PLANT_ANCHORS[type.name]);
      dummy.rotation.set(0,this.camera.rotation.y,0);
      dummy.scale.set(type.size[0]*e.scale*e.flip,h,1);dummy.updateMatrix();type.mesh.setMatrixAt(index,dummy.matrix);
    }
    this.vegetationTypes.forEach((t,i)=>{t.mesh.count=Math.min(counts[i],t.capacity);t.mesh.instanceMatrix.needsUpdate=true;});
    this.lastSegment=current;this.lastLook=this.look;
  }
  updateAnimals(force=false){
    const current=Math.floor(this.distance/10);if(!force&&current===this.animalSegment)return;
    if(force){for(const a of this.animals)this.scene.remove(a.mesh);this.animals=[];this.animalSegments.clear();}
    for(const a of [...this.animals])if(a.d<this.distance-12||a.d>this.distance+105){this.scene.remove(a.mesh);this.animals=this.animals.filter(v=>v!==a);}
    for(const key of this.animalSegments.keys())if(key<current-2||key>current+10)this.animalSegments.delete(key);
    for(let seg=Math.max(0,current-1);seg<=current+9;seg++){if(this.animalSegments.has(seg))continue;this.animalSegments.set(seg,true);for(const entry of wildlifeEntries(seg,this.biomeId,this.random,this.submapId)){if(this.animals.length>=9)break;const {species}=entry;if(this.artStudy==='rift'&&entry.offset>5)entry.offset=-Math.abs(entry.offset);const p=this.worldSample(entry.d,entry.offset).position,h=species.size[1]*entry.scale,mesh=new THREE.Mesh(this.plane,this.animalMaterials[species.id]);mesh.scale.set(species.size[0]*entry.scale,h,1);if(species.kind==='wader'||species.id==='frog')p.y=Math.max(p.y,baseHeight(this.visualLocal(entry.d),this.biomeId)-.08);mesh.position.copy(p);mesh.position.y=plantedCenter(terrainContact(this.ground,entry.d,entry.offset,p),h,ANIMAL_ANCHORS[species.id])+(species.kind==='flying'?4:0);mesh.rotation.y=this.camera.rotation.y;const animal={...entry,mesh,anchor:mesh.position.clone(),groundMesh:this.ground};this.animals.push(animal);this.scene.add(mesh);}}
    this.animalSegment=current;
  }
  spawnHerb(index,d,offset) {
    if(this.herbs.length>=15)return;
    const mesh=new THREE.Mesh(this.plane,this.herbMaterials[index].clone());
    if(this.biomeId===4&&this.submapId===2&&['纸莎草','芦苇','非洲睡莲','水薄荷'].includes(HERBS[index].name))offset=4.2+this.random()*1.1;
    const herbOffset=offset??(Math.random()<0.5?-1:1)*(1.9+Math.random()*0.65);const {position}=this.worldSample(d,herbOffset);
    const scale=1.05+Math.random()*0.18;
    mesh.position.copy(position);mesh.position.y=plantedCenter(terrainContact(this.ground,d,herbOffset,position),scale*1.25,.92);
    mesh.scale.set(scale*1.25,scale*1.25,1);
    const herb={data:HERBS[index],mesh,d,radius:scale*0.43,sphere:new THREE.Sphere(mesh.position.clone(),scale*0.43*1.65),baseY:mesh.position.y,baseScale:scale*1.25,hoverAt:-Infinity};
    this.scene.add(mesh);this.herbs.push(herb);
  }
  advance(dt) {
    const meters=(this.speed??WALK_SPEED)*dt;this.distance+=meters;
    if(this.route){const transitions=this.route.advance(meters);if(transitions.length){const walking=this.moving,counters=this.spawner,route=this.route;this.travelTo(this.distance-route.progress,MAPS[route.map],{route,submap:route.submap,length:route.length});this.distance+=route.progress;this.spawner=counters;this.moving=walking;}}
    // 身后立即回收；材料与平面几何共享，移除实例不销毁共享资源。
    for(const h of [...this.herbs])if(h.d<this.distance&&!this.picking){this.scene.remove(h.mesh);h.mesh.material.dispose();this.herbs=this.herbs.filter(v=>v!==h);}
    const map=floraFor(this.biomeId,this.submapId,MAPS[this.biomeId]);
    // 地貌试样不套用旧地图药材池，避免把旧沙漠/高山药材误投到新地区。
    this.spawner.advance(meters,(tier,forced)=>{
      const names=map[tier.key],name=names[Math.floor(Math.random()*names.length)],index=HERBS.findIndex(h=>h.name===name);if(index<0)return false;
      if(this.herbs.length>=15){if(!forced)return false;const stale=[...this.herbs].sort((a,b)=>Math.abs(b.d-this.distance)-Math.abs(a.d-this.distance))[0];this.scene.remove(stale.mesh);stale.mesh.material?.dispose();this.herbs=this.herbs.filter(h=>h!==stale);}
      this.spawnHerb(index,this.distance+8+Math.random()*3);return true;
    });
    if(this.distance-(this.lastTerrain||0)>24){const previous=this.ground;this.scene.remove(previous);previous.geometry.dispose();this.ground=this.makeTerrain();this.scene.add(this.ground);this.makeStream();this.lastTerrain=this.distance;this.lastSegment=-1;}
  }
  // 将 MediaPipe 手心坐标转换成摄像机射线，与真正的三维球体求交。
  hitTest(center) {
    if(this.picking||this.animalHover)return null;
    this.raycaster.setFromCamera(new THREE.Vector2(center.x*2-1,1-center.y*2),this.camera);
    let target=null,nearest=Infinity;
    for(const herb of this.herbs) {
      const hit=this.raycaster.ray.intersectSphere(herb.sphere,new THREE.Vector3());
      if(!hit)continue;
      const distance=hit.distanceTo(this.camera.position);
      if(distance<=8&&distance<nearest){target=herb;nearest=distance;}
    }
    return target;
  }
  setHandPointer(center){this.animalHover=null;if(center){this.raycaster.setFromCamera(new THREE.Vector2(center.x*2-1,1-center.y*2),this.camera);const hits=this.raycaster.intersectObjects(this.animals.map(a=>a.mesh));const hit=hits.find(h=>h.distance<35&&h.uv.x>.12&&h.uv.x<.9&&h.uv.y>.12&&h.uv.y<.92);if(hit)this.animalHover=this.animals.find(a=>a.mesh===hit.object)?.species||null;}const target=center?this.hitTest(center):null;if(target!==this.hoveredHerb){this.hoveredHerb=target;if(target)target.hoverAt=performance.now();}}
  pick(center) {
    const target=this.hitTest(center);
    if(!target)return false;
    this.moving=false;this.picking={herb:target,start:performance.now()};return true;
  }
  frame(now) {
    if(this.disposed||this.preview)return;
    const dt=Math.min(this.clock.getDelta(),0.06);
    if(this.suspended){this.animation=requestAnimationFrame(this.frame);return;}
    this.speed=smoothSpeed(this.speed,this.targetSpeed,dt);
    if(this.moving&&!this.picking)this.advance(dt);
    this.applyBiome();
    const {position,right}=this.worldSample(this.distance);
    this.lateralOffset=THREE.MathUtils.lerp(this.lateralOffset,this.targetLateral,1-Math.exp(-4*dt));
    this.camera.position.copy(position).addScaledVector(right,this.lateralOffset);this.camera.position.y=position.y+1.62;
    if(this.studyBackdrop)for(const mesh of this.studyBackdrop.children)if(mesh.userData.remote){mesh.userData.baseX??=mesh.position.x;mesh.userData.baseZ??=mesh.position.z;mesh.position.x=mesh.userData.baseX+position.x-this.studyBackdrop.position.x;mesh.position.z=mesh.userData.baseZ+position.z-this.studyBackdrop.position.z;}
    this.look=THREE.MathUtils.damp(this.look,this.targetLook,5,dt);
    this.camera.lookAt(this.worldSample(this.distance+(this.artStudy?14:8)).position.addScaledVector(right,this.lateralOffset+(this.artStudy==='rift'?8:0)).add(new THREE.Vector3(0,this.artStudy?(/^(grove|mist)/.test(this.artStudy)?1.6:this.artStudy==='rift'?-3:this.artStudy==='sahara'?.7:this.artStudy==='delta'?1.2:2.2):1.57,0)));
    this.camera.rotateY(this.look);
    if(this.distance-this.lastRoad>3)this.updateRoad();
    this.updateVegetation();this.updateAnimals();
    for(const a of this.animals){const t=now*.001+a.phase,fly=a.species.kind==='flying';if(!fly&&a.groundMesh!==this.ground){const p=this.worldSample(a.d,a.offset).position;a.anchor.y=plantedCenter(terrainContact(this.ground,a.d,a.offset,p),a.mesh.scale.y,ANIMAL_ANCHORS[a.species.id]);a.groundMesh=this.ground;}a.mesh.rotation.y=this.camera.rotation.y;a.mesh.position.x=a.anchor.x+Math.sin(t*(fly?.7:.35))*(fly?1.4:.08);a.mesh.position.y=a.anchor.y+(fly?Math.sin(t*1.8)*.2:Math.sin(t*1.3)*.02);}
    for(const h of this.herbs){h.mesh.rotation.y=this.camera.rotation.y;const pulse=THREE.MathUtils.damp(h.mesh.scale.x/h.baseScale,this.hoveredHerb===h?1.24:1,16,dt);h.mesh.material.color.set(this.hoveredHerb===h?'#fff3c9':'#ffffff');h.mesh.scale.set(h.baseScale*pulse,h.baseScale*pulse,1);}
    if(this.picking) {
      const {herb,start}=this.picking,t=Math.min((now-start)/650,1);
      herb.mesh.rotation.z=Math.sin(t*Math.PI*7)*0.09*(1-t);
      herb.mesh.position.y=herb.baseY+t*0.65;
      if(t>=1) {
        this.scene.remove(herb.mesh);herb.mesh.material.dispose();this.herbs=this.herbs.filter(h=>h!==herb);
        this.picking=null;this.onCollect(herb.data);
      }
    }
    let nearest=null,nearestDistance=Infinity;
    for(const h of this.herbs){
      if(this.picking?.herb===h)continue;
      const d=h.mesh.position.distanceTo(this.camera.position),p=h.mesh.position.clone().project(this.camera);
      if(d<nearestDistance&&d<8&&p.z<1&&p.z>-1&&Math.abs(p.x)<0.92&&Math.abs(p.y)<0.85){nearestDistance=d;nearest={herb:h.data,x:(p.x+1)/2,y:(1-p.y)/2,distance:d};}
    }
    this.onUpdate({animalInfo:this.animalHover,distance:this.distance,moving:this.moving,nearest,herbCount:this.herbs.length,ended:false,biomeId:this.biomeId,submapId:this.submapId,submapLength:this.submapLength,submapProgress:this.distance-this.stageStart,speed:this.moving?this.speed:0});
    this.renderer.render(this.scene,this.camera);this.animation=requestAnimationFrame(this.frame);
  }
  resize() {
    const {clientWidth:w,clientHeight:h}=this.container;if(!w||!h)return;
    this.camera.aspect=w/h;this.camera.fov=w<760?76:58;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);
  }
  enableArtStudy(){if(this.studyBackdrop)return;makeStudyBackdrop(this);const origin=samplePath(this.path,this.stageStart).position;this.studyBackdrop.position.x=origin.x;this.studyBackdrop.position.z=origin.z;this.stream.visible=false;this.sea.visible=false;}
  setRunning(value){this.targetSpeed=value?RUN_SPEED:WALK_SPEED;}
  strafe(amount){this.moving=false;this.targetLateral=THREE.MathUtils.clamp(this.targetLateral+amount,-.65,.65);}
  startExploration(theme,mode='random'){const route=new ExplorationRoute(theme.index,mode);this.travelTo(0,theme,{route,submap:route.submap,length:route.length});}
  capturePreview(){const {position}=this.worldSample(this.distance);this.camera.position.copy(position);this.camera.position.y+=1.62;this.camera.lookAt(this.worldSample(this.distance+8).position.add(new THREE.Vector3(0,1.57,0)));this.updateVegetation(true);this.renderer.render(this.scene,this.camera);return this.renderer.domElement.toDataURL('image/jpeg',.88);}
  travelTo(distance,theme,options={}){
    // 预览固定种子：同一小地图反复打开仍是相同景观；游玩顺序由独立路线调度。
    if(this.preview){let seed=1009+(theme?.index??0)*131+(options.submap??0)*977;this.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
    this.route=options.route??new ExplorationRoute(theme?.index??0,'random');this.submapId=options.submap??this.route.submap;this.submapLength=options.length??this.route.length;
    if(this.studyBackdrop){this.scene.remove(this.studyBackdrop);this.studyBackdrop.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.dispose();this.materials=this.materials.filter(m=>m!==o.material);}});this.studyBackdrop=null;}
    const sceneKeys={...ASIAN_KEYS,3:['alpine','fjord','aegean'],4:['sahara','rift','delta']};
    this.artStudy=this.studyOverride||sceneKeys[theme?.index]?.[this.submapId]||false;this.activeBiome=-1;
    this.animalHover=null;
    this.moving=false;this.distance=Math.max(0,distance);this.biomeId=theme?.index??0;this.stageStart=this.distance;this.spawner=new HerbSpawner();for(const h of this.herbs)this.scene.remove(h.mesh);this.herbs=[];this.segments.clear();const previous=this.ground;this.scene.remove(previous);previous.geometry.dispose();this.ground=this.makeTerrain();this.scene.add(this.ground);this.makeStream();this.lastTerrain=this.distance;this.targetLateral=0;this.lateralOffset=0;
    this.nextCommon=this.distance+5+Math.random();this.nextRare=(Math.floor(this.distance/50)+1)*50;
    this.updateRoad();this.updateVegetation(true);this.updateAnimals(true);
    if(this.artStudy)this.enableArtStudy();else this.applyBiome();
  }
  dispose() {
    this.disposed=true;cancelAnimationFrame(this.animation);this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('webglcontextlost',this.onContextLost);
    this.scene.traverse(o=>{if(o.geometry&&o.geometry!==this.plane)o.geometry.dispose();});
    this.herbs.forEach(h=>h.mesh.material.dispose());this.plane.dispose();this.materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose());this.renderer.dispose();this.renderer.domElement.remove();
  }
}
