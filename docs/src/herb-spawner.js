export const SPAWN_TIERS=[
 {key:'common',label:'常见',min:5,max:10,rate:.2},
 {key:'scarce',label:'少见',min:50,max:100,rate:.025},
 {key:'legend',label:'稀有',min:100,max:150,rate:.015}
];
// 每米概率密度转为本次前进距离的概率，帧率不改变总体遇见率。
export class HerbSpawner{
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){this.dist=Object.fromEntries(SPAWN_TIERS.map(t=>[t.key,0]));}
 advance(meters,spawn){
  if(!(meters>0)||!Number.isFinite(meters))return;
  for(const tier of SPAWN_TIERS){const before=this.dist[tier.key],after=before+meters;this.dist[tier.key]=after;
   const forced=after>=tier.max-1e-8,eligible=Math.max(0,after-Math.max(before,tier.min));
   if(forced||(eligible>0&&this.random()<1-Math.exp(-tier.rate*eligible))){if(spawn(tier,forced)!==false)this.dist[tier.key]=0;}
  }
 }
}
