import * as THREE from '../vendor/three.js';

// 每三个控制点衔接一条三次贝塞尔曲线；地面 y=0，相机另加眼高。
// 相邻曲线端点、切线连续，避免转弯时突跳。单位：米。
export const PATH_POINTS = [
  [0,0,0],[0,0,-20],[8,0,-40],[8,0,-60],
  [8,0,-80],[-6,0,-100],[-6,0,-120],
  [-6,0,-140],[-14,0,-160],[-14,0,-180],
  [-14,0,-200],[2,0,-220],[2,0,-240],
  [2,0,-260],[14,0,-280],[14,0,-300],
  [14,0,-320],[4,0,-340],[4,0,-360],
  [4,0,-380],[-12,0,-400],[-12,0,-420],
  [-12,0,-440],[-4,0,-460],[-4,0,-480],
  [-4,0,-500],[10,0,-520],[10,0,-540],
  [10,0,-560],[0,0,-580],[0,0,-600]
];
export const WALK_SPEED = 2;
export const ROAD_HALF_WIDTH = 1.45;
export function createPath() {
  const path = new THREE.CurvePath();
  for (let i=0; i<PATH_POINTS.length-1; i+=3) {
    path.add(new THREE.CubicBezierCurve3(...PATH_POINTS.slice(i,i+4).map(p=>new THREE.Vector3(...p))));
  }
  path.arcLengthDivisions = 2400;
  path.updateArcLengths();
  return path;
}

// 相机、道路、草药、植被共用按弧长采样，确保米制速度与间隔一致。
export function samplePath(path, distance, offset=0) {
  const length=path.getLength(),cycle=Math.floor(Math.max(0,distance)/length);
  const u = (Math.max(0,distance)-cycle*length)/length;
  const center = path.getPointAt(u);center.z+=cycle*path.getPointAt(1).z;
  const tangent = path.getTangentAt(u).normalize();
  const right = new THREE.Vector3(-tangent.z,0,tangent.x).normalize();
  return { position: center.addScaledVector(right,offset), tangent, right };
}
