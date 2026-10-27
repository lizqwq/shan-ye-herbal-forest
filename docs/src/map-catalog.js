import {HABITAT_FLORA} from './habitat-flora.js';
// 固定顺序；地点只用于叙事标注，所有地图均从第一个地点开始。
export const MAPS=[
 {id:'grove',name:'亚洲·东部山林',subtitle:'中国东部 · 栓皮栎林、马尾松坡与古栎岩隙',sky:'forest_path.jpg',names:['林间路口','紫花林园','艾草缓坡','古树转角'],common:['紫花地丁','蒲公英','车前草','艾草','仙鹤草','益母草','紫苏'],scarce:['桔梗','金银花'],legend:['五味子']},
 {id:'mist',name:'亚洲·南方溪谷',subtitle:'中国南方 · 枫杨溪岸、四川箭竹石涧与樟林苔径',sky:'mist_valley.jpg',names:['雾谷入口','苔石小径','溪岸转弯','垂枝回廊'],common:['鱼腥草','薄荷','车前草','白芷','菖蒲','积雪草','金钱草'],scarce:['伸筋草','石菖蒲'],legend:['重楼']},
 {id:'meadow',name:'亚洲·高原花甸',subtitle:'中国西部 · 融水花甸、碎石草坡与圆柏岩脊',sky:'alpine_meadow.jpg',names:['草甸入口','向阳草坡','远山望处','山野尽头'],common:['蒲公英','柴胡','黄芪','珠芽蓼','委陵菜','高山龙胆','亚洲蓍草'],scarce:['当归','川贝母'],legend:['红景天']},
 {id:'coast',name:'欧洲·欧陆山海',subtitle:'阿尔卑斯山地 · 挪威峡湾 · 爱琴海峡',sky:'silver_coast.jpg',names:['银叶路口','橄榄石坪'],common:['迷迭香','百里香','洋甘菊','金盏花','药鼠尾草','矢车菊','刺山柑'],scarce:['薰衣草','月桂'],legend:['苦橙花']},
 {id:'savanna',name:'非洲·旷野三境',subtitle:'撒哈拉干河谷 · 东非大裂谷 · 奥卡万戈湿地',sky:'red_savanna.jpg',names:['疏林路口','猴面包坪','红岩旱谷'],common:['好望角芦荟','猴面包树叶','非洲万寿菊','非洲罗勒','南非醉茄','布枯','非洲锦葵'],scarce:['没药','乌干达姜黄'],legend:['乳香']}
].map((m,index)=>{const pools=HABITAT_FLORA[index];if(pools)for(const tier of ['common','scarce','legend'])m[tier]=[...new Set(pools.flatMap(p=>p[tier]))];return ({...m,index,start:0,route:'M77 238 C22 206 129 178 65 141 S118 68 77 23',nodes:m.names.map((name,i)=>({name,x:[77,70,82,77][i],y:238-i*215/(m.names.length-1)}))});});
export {SPAWN_TIERS as RARITY_GROUPS} from './herb-spawner.js';
export const wrapMap=i=>(i%MAPS.length+MAPS.length)%MAPS.length;
export const wheelSlots=i=>[-2,-1,0,1,2].map(offset=>({offset,index:wrapMap(i+offset),number:wrapMap(i+offset)+1}));
