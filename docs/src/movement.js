export const WALK_SPEED=2,RUN_SPEED=4;
export const smoothSpeed=(current,target,dt)=>current+(target-current)*(1-Math.exp(-2.8*Math.max(0,dt)));
