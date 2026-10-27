// 亚洲包含三个独立大地图；欧洲和非洲各有一个大地图。
export function worldRegionMap(boardId,random=Math.random){
 if(boardId==='europe')return 3;
 if(boardId==='africa')return 4;
 if(boardId==='asia')return Math.min(2,Math.max(0,Math.floor(random()*3)));
 return null;
}
