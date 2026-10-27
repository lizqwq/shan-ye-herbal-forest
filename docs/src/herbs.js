import {PROFILE_RECORDS} from './03-渲染与交互.js';
const ids={1:'zihuadiding',2:'pugongying',3:'machixian',9:'aicao',4:'cheqiancao',37:'shenjincao',16:'jiegeng'};
export const HERBS=PROFILE_RECORDS.map(h=>({...h,id:ids[h.id]||'herb-'+h.id,codexId:h.id,name:h.n,latin:h.english?h.english+' · '+h.l:h.l,rarity:['','常见','少见','稀有'][h.r],text:h.desc+' '+h.props}));
export const herbImage=h=>'./herbs/'+h.id+'.png';
