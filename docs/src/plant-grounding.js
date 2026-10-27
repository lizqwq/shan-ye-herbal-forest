import * as THREE from '../vendor/three.js';
const ray=new THREE.Ray(new THREE.Vector3(),new THREE.Vector3(0,-1,0)),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),hit=new THREE.Vector3();
// 对实际渲染的地面三角形求交。局部网格查询避免每株植物遍历整张地形。
export function terrainContact(ground,d,offset,position){
 const grid=ground?.userData?.grid;if(!grid)return position.y-.12;
 const attr=ground.geometry.attributes.position,indices=ground.geometry.index;
 const row=Math.floor((d-grid.start)/3),col=Math.floor(offset/(grid.spacing||4)+grid.columns/2);
 ray.origin.set(position.x,10000,position.z);let height=-Infinity;
 for(let r=Math.max(0,row-2);r<=Math.min(grid.rows-1,row+2);r++)for(let q=Math.max(0,col-2);q<=Math.min(grid.columns-1,col+2);q++){
  const start=(r*grid.columns+q)*6;
  for(let j=0;j<6;j+=3){a.fromBufferAttribute(attr,indices.getX(start+j));b.fromBufferAttribute(attr,indices.getX(start+j+1));c.fromBufferAttribute(attr,indices.getX(start+j+2));if(ray.intersectTriangle(a,b,c,false,hit))height=Math.max(height,hit.y);}
 }
 return Number.isFinite(height)?height:position.y-.12;
}
export function plantedCenter(groundY,height,anchor=.92){return groundY+height*(anchor-.5)-Math.min(.32,Math.max(.045,height*.025));}
