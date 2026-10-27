import {CURRENT_REGIONAL_HERBS} from './current-regional-herbs.js';
import {REGIONAL_HERBS,RETIRED_HERB_IDS} from './regional-herbs.js';
import {CODEX_SEED} from './01-草药数据.js';
import {EXTRA_HERBS} from './extra-herbs.js';
import {MAPS} from './map-catalog.js';
export const PROFILE_KEY='shan-ye-profile-v1';
export const HERB_CODEX_IDS={zihuadiding:1,pugongying:2,machixian:3,cheqiancao:4,aicao:9,jiegeng:16,shenjincao:37,...Object.fromEntries([...CODEX_SEED,...EXTRA_HERBS.filter(h=>h.region==='亚洲'),...CURRENT_REGIONAL_HERBS].filter(h=>!RETIRED_HERB_IDS.has(h.id)).map(h=>['herb-'+h.id,h.id]))};
export const PROFILE_RECORDS=[...CODEX_SEED,{
  id:37,n:'伸筋草',l:'Lycopodium japonicum',cat:'全草类',sc:'森林秘境',r:2,own:0,
  props:'传统本草记载｜祛风除湿，舒筋活络',desc:'石松类植物，匍匐茎沿潮湿山地林缘生长。',shape:'fern'
},...EXTRA_HERBS.filter(h=>h.region==='亚洲'),...CURRENT_REGIONAL_HERBS].filter(h=>!RETIRED_HERB_IDS.has(h.id)).map(h=>{const n=h.id===9?'艾草':h.n;const maps=MAPS.filter(m=>[...m.common,...m.scarce,...m.legend].includes(n));return {...h,own:0,n,regions:maps.length?[...new Set(maps.map(m=>m.name.split('·')[0]))]:[h.region||'亚洲'],maps:maps.map(m=>m.name),sc:maps.length?maps.map(m=>m.name).join(' / '):h.sc||'其他生境',r:maps.length?Math.max(...maps.map(m=>m.legend.includes(n)?3:m.scarce.includes(n)?2:1)):h.r};});
export const CATEGORIES=['全部',...new Set(PROFILE_RECORDS.map(h=>h.cat))];
export function readProfile(storage){
  let saved={};try{saved=JSON.parse(storage?.getItem(PROFILE_KEY)||'{}');}catch{}
  const additions=saved&&typeof saved==='object'?saved.additions:{};
  return Object.fromEntries(PROFILE_RECORDS.map(h=>{
    const value=additions?.[h.id];return [h.id,Number.isSafeInteger(value)&&value>=-h.own?value:0];
  }));
}
export function profileRecords(additions){return PROFILE_RECORDS.map(h=>({...h,own:Math.max(0,h.own+(additions[h.id]||0))}));}
export function saveProfile(storage,additions){try{storage?.setItem(PROFILE_KEY,JSON.stringify({version:1,additions}));return true;}catch{return false;}}
export function addToProfile(additions,herbId){const id=HERB_CODEX_IDS[herbId];if(!id)return false;additions[id]=(additions[id]||0)+1;return true;}
export function removeFromProfile(additions,id){const item=PROFILE_RECORDS.find(h=>h.id===id);if(!item||item.own+(additions[id]||0)<=0)return false;additions[id]=(additions[id]||0)-1;return true;}
// 保留 B 的三个渲染入口。返回视图数据，由 Vue 渲染到 #statbar/#tabs/#dex。
export function renderStat(records){const got=records.filter(h=>h.own>0);return {total:records.length,got:got.length,percent:records.length?Math.round(got.length/records.length*100):0,rare:got.filter(h=>h.r===2).length,legend:got.filter(h=>h.r===3).length,sum:records.reduce((a,h)=>a+h.own,0)};}
export function renderTabs(records){return CATEGORIES.map(name=>({name,count:name==='全部'?records.length:records.filter(h=>h.cat===name).length}));}
export function renderDex(records,{category='全部',search=''}={}){const query=search.toLowerCase().trim();return records.filter(h=>(category==='全部'||h.cat===category)&&(!query||`${h.n} ${h.l} ${h.sc}`.toLowerCase().includes(query)));}
