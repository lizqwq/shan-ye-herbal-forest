// 网页 B 原始插画绘制器，改为 ES Module；滤镜由 Vue 容器承载。
export const CODEX_FILTERS="<svg width=\"0\" height=\"0\" aria-hidden=\"true\"><defs>\n    <filter id=\"wp\" x=\"-15%\" y=\"-15%\" width=\"130%\" height=\"130%\">\n      <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"3\" seed=\"7\" result=\"n\"/>\n      <feDisplacementMap in=\"SourceGraphic\" in2=\"n\" scale=\"3.2\"/>\n    </filter>\n    <filter id=\"wsoft\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"0.7\"/></filter>\n  </defs></svg>";
  const G1="#87a17e",G2="#9db28f",G3="#b3c2a0",GD="#6f8a6a",GE="#7c957a";
  const P1="#b9a4cf",P2="#c9b6da",P3="#a892c4";
  const Y1="#f0d98c",Y2="#e8c96a",W1="#f5f1e6",W2="#ece5d2";

  const leaf=(x,y,l,w,deg,c,o=1)=>`<path d="M0 0 Q ${w/2} ${-l/2} 0 ${-l} Q ${-w/2} ${-l/2} 0 0 Z" transform="translate(${x} ${y}) rotate(${deg})" fill="${c}" opacity="${o}"/>`;
  const blob=(x,y,rx,ry,deg,c,o=1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${deg} ${x} ${y})" fill="${c}" opacity="${o}"/>`;
  const stem=(x1,y1,x2,y2,w,c)=>`<path d="M${x1} ${y1} Q ${(x1+x2)/2} ${(y1+y2)/2-4} ${x2} ${y2}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const vein=(x,y,l,w,deg)=>`<path d="M0 0 Q 0 ${-l/2} 0 ${-l}" transform="translate(${x} ${y}) rotate(${deg})" stroke="rgba(255,255,255,.45)" stroke-width="${w}" fill="none"/>`;
  const fl5=(cx,cy,r,c1,c2,cc)=>{let s="";for(let i=0;i<5;i++){const a=i*72;s+=`<ellipse cx="${cx}" cy="${cy-r*0.62}" rx="${r*0.46}" ry="${r*0.7}" transform="rotate(${a} ${cx} ${cy})" fill="${c1}"/>`;s+=`<ellipse cx="${cx}" cy="${cy-r*0.6}" rx="${r*0.26}" ry="${r*0.5}" transform="rotate(${a} ${cx} ${cy})" fill="${c2}" opacity=".7"/>`}return s+`<circle cx="${cx}" cy="${cy}" r="${r*0.28}" fill="${cc}"/>`};
  const bell=(cx,cy,r,c,deg=0)=>`<path d="M0 ${-r} Q ${r*0.9} ${-r*0.3} ${r*0.55} ${r*0.75} Q 0 ${r*1.15} ${-r*0.55} ${r*0.75} Q ${-r*0.9} ${-r*0.3} 0 ${-r} Z" transform="translate(${cx} ${cy}) rotate(${deg})" fill="${c}"/>`;
  const mound=(c1="#c9cfae",c2="#b6c09b")=>`
    <ellipse cx="60" cy="102" rx="44" ry="10" fill="${c1}"/>
    ${blob(38,96,16,7,-8,c2)}${blob(60,99,20,8,0,c2,.9)}${blob(82,96,15,7,10,c2)}`;

  const ART={
    /* 1 紫花地丁：心形基生叶莲座 + 细长花葶顶生五瓣紫花 */
    1:()=>svg(mound()+`
      ${blob(60,86,26,9,0,G2)}${blob(48,88,14,7,-15,G1)}${blob(72,88,14,7,15,G1)}
      ${leaf(52,92,26,13,-38,G2)}${leaf(58,94,30,15,-12,GE)}${leaf(64,94,28,14,10,G1)}${leaf(70,92,24,12,32,G3)}
      ${leaf(48,90,18,10,-60,G3)}${leaf(72,90,18,10,58,G3)}
      ${vein(58,94,26,1.2,-12)}${vein(64,94,24,1.1,10)}
      ${stem(56,88,50,52,1.8,GD)}${stem(64,88,72,56,1.8,GD)}${stem(60,90,60,66,1.6,GD)}
      ${fl5(50,48,11,P1,P2,"#f2e9c8")}
      ${fl5(72,52,9,P2,"#d8c8e6","#f2e9c8")}
      ${fl5(60,62,7,P3,P2,"#efe6c6")}`),
    /* 2 蒲公英：贴地深裂锯齿叶莲座 + 空管花葶顶生黄绒球 */
    2:()=>svg(mound()+`
      ${leaf(60,98,34,14,-70,GE)}${leaf(60,98,36,15,-42,G1)}${leaf(60,98,38,16,-15,G2)}${leaf(60,98,38,16,15,G1)}${leaf(60,98,36,15,42,GE)}${leaf(60,98,34,14,70,G2)}
      ${leaf(60,98,30,11,-70,"#a9bb98")}${leaf(60,98,32,12,-15,"#a9bb98")}${leaf(60,98,32,12,42,"#a9bb98")}
      ${stem(58,94,50,38,2,GD)}${stem(64,94,74,46,2,GD)}
      <g fill="${Y1}">${[...Array(14)].map((_,i)=>{const a=i/14*6.283;return `<ellipse cx="${50+9*Math.cos(a)}" cy="${30+9*Math.sin(a)}" rx="3.6" ry="1.9" transform="rotate(${a*57.3+90} ${50+9*Math.cos(a)} ${30+9*Math.sin(a)})"/>`}).join("")}</g>
      <circle cx="50" cy="30" r="7.5" fill="${Y2}"/><circle cx="50" cy="30" r="4" fill="#dcb854"/>
      <g fill="${Y1}">${[...Array(10)].map((_,i)=>{const a=i/10*6.283;return `<ellipse cx="${74+7*Math.cos(a)}" cy="${40+7*Math.sin(a)}" rx="3" ry="1.6" transform="rotate(${a*57.3+90} ${74+7*Math.cos(a)} ${40+7*Math.sin(a)})"/>`}).join("")}</g>
      <circle cx="74" cy="40" r="5.5" fill="${Y2}"/>`),
    /* 3 马齿苋：红褐色肉质匍匐茎 + 匙形厚叶 */
    3:()=>svg(mound()+`
      ${stem(60,98,42,72,3,"#a5674f")}${stem(60,98,74,70,3,"#a5674f")}${stem(60,98,58,64,3,"#b07458")}${stem(60,98,84,84,2.6,"#a5674f")}${stem(60,98,38,84,2.6,"#a5674f")}
      <g fill="#8fae7d">${blob(42,68,8,5.5,-30)}${blob(74,66,8,5.5,25)}${blob(58,60,8.5,5.5,0)}${blob(84,80,7,5,40)}${blob(38,80,7,5,-40)}
      ${blob(50,76,7,4.8,-15)}${blob(68,78,7,4.8,12)}${blob(60,72,6.5,4.5,30)}</g>
      <g fill="#a5bf92">${blob(42,66,4.5,3.2,-30)}${blob(58,58,5,3.4,0)}${blob(74,64,4.5,3.2,25)}${blob(50,74,4,2.8,-15)}</g>
      <circle cx="58" cy="56" r="3" fill="${Y1}"/><circle cx="58" cy="56" r="1.4" fill="#d9b84e"/>`),
    /* 4 车前草：宽卵叶贴地莲座 + 直立细穗花序 */
    4:()=>svg(mound()+`
      ${leaf(60,96,30,20,-65,G2)}${leaf(60,96,34,22,-36,GE)}${leaf(60,96,36,24,-10,G1)}${leaf(60,96,36,24,12,G2)}${leaf(60,96,34,22,38,GE)}${leaf(60,96,30,20,66,G2)}
      ${vein(60,96,32,1.3,-10)}${vein(60,96,30,1.3,12)}${vein(60,96,28,1.2,-36)}
      ${stem(56,88,50,34,1.7,GD)}${stem(64,88,72,44,1.7,GD)}
      <g fill="#c7bb8f"><ellipse cx="50" cy="30" rx="3.4" ry="10"/><ellipse cx="72" cy="40" rx="3" ry="8.5"/></g>
      <g fill="#d8cba4">${[0,1,2,3,4,5].map(i=>`<circle cx="${50+(i%2?3.4:-3.4)}" cy="${24+i*2.6}" r="1.3"/>`).join("")}${[0,1,2,3,4].map(i=>`<circle cx="${72+(i%2?3:-3)}" cy="${35+i*2.4}" r="1.2"/>`).join("")}</g>`),
    /* 5 鱼腥草：心形大叶 + 顶生白色四瓣小花 */
    5:()=>svg(mound()+`
      ${stem(60,98,58,58,2.6,GD)}${stem(58,86,40,64,2,GD)}${stem(62,88,80,68,2,GD)}
      <path d="M58 30 Q46 22 40 34 Q36 46 52 50 Q66 52 66 38 Q64 30 58 30 Z" fill="${GE}"/>
      <path d="M40 56 Q30 50 26 60 Q24 70 38 72 Q48 72 48 62 Q46 56 40 56 Z" fill="${G2}"/>
      <path d="M80 60 Q70 54 66 64 Q64 74 78 76 Q88 76 88 66 Q86 60 80 60 Z" fill="${G1}"/>
      <path d="M58 34 Q52 40 54 46" stroke="rgba(255,255,255,.4)" stroke-width="1.4" fill="none"/>
      <g>${[0,1,2,3].map(i=>{const a=i*90+45;return `<ellipse cx="${60+7*Math.cos(a*Math.PI/180)}" cy="${56+7*Math.sin(a*Math.PI/180)}" rx="4.6" ry="2.8" transform="rotate(${a} ${60+7*Math.cos(a*Math.PI/180)} ${56+7*Math.sin(a*Math.PI/180)})" fill="${W1}"/>`}).join("")}</g>
      <circle cx="60" cy="56" r="3" fill="#e8d79a"/>`),
    /* 6 薄荷：方形直立茎 + 对生锯齿卵叶 */
    6:()=>svg(mound()+`
      ${stem(60,98,60,26,3,GE)}${stem(60,86,44,66,2.2,GE)}${stem(60,80,78,60,2.2,GE)}
      ${leaf(44,66,22,13,-52,G2)}${leaf(44,66,20,12,15,G1)}${leaf(78,60,22,13,52,G2)}${leaf(78,60,20,12,-18,G1)}
      ${leaf(60,56,24,14,-42,GE)}${leaf(60,56,22,13,44,G2)}${leaf(60,38,18,11,-30,G1)}${leaf(60,38,18,11,32,GE)}
      ${leaf(60,26,14,9,0,G2)}
      ${vein(44,66,18,1,-52)}${vein(78,60,18,1,52)}${vein(60,56,20,1,-42)}
      ${fl5(60,20,4.5,"#cbb8dd","#d9cbe8","#efe8c9")}`),
    /* 7 益母草：四棱茎 + 羽裂叶 + 腋生粉紫轮伞花 */
    7:()=>svg(mound()+`
      ${stem(60,98,60,24,2.8,"#8a8f6e")}
      ${leaf(56,88,20,10,-58,G2)}${leaf(64,88,20,10,58,G1)}${leaf(56,74,18,9,-56,GE)}${leaf(64,74,18,9,56,G2)}
      ${leaf(56,60,16,8,-54,G1)}${leaf(64,60,16,8,54,GE)}${leaf(56,46,14,7,-52,G2)}${leaf(64,46,14,7,52,G1)}
      ${[80,70,60,50,40].map((y,i)=>`<g fill="${i%2?"#d9a8bd":"#cf93ad"}">${[...Array(7)].map((_,k)=>{const a=k/7*6.283;return `<ellipse cx="${60+6*Math.cos(a)}" cy="${y+6*Math.sin(a)}" rx="2.6" ry="1.7" transform="rotate(${a*57.3} ${60+6*Math.cos(a)} ${y+6*Math.sin(a)})"/>`}).join("")}</g>`).join("")}
      ${fl5(60,26,4,"#d9a8bd","#e5bdcf","#f2e6c4")}`),
    /* 8 仙鹤草：羽状复叶 + 顶生黄色总状花序 */
    8:()=>svg(mound()+`
      ${stem(60,98,58,30,2.4,GE)}
      ${[0,1,2].map(i=>{const y=88-i*16;return `<path d="M58 ${y} l-16 -6" stroke="${GE}" stroke-width="1.6"/>${leaf(42,y-8,12,7,-68,G2)}${leaf(48,y-6,10,6,-60,G1)}<path d="M58 ${y} l16 -6" stroke="${GE}" stroke-width="1.6"/>${leaf(74,y-8,12,7,68,G1)}${leaf(68,y-6,10,6,60,G2)}`}).join("")}
      ${leaf(58,50,14,8,0,GE)}
      <g fill="${Y1}">${[0,1,2,3,4,5,6].map(i=>`<circle cx="${58+(i%2?3.6:-3.6)}" cy="${42-i*3.4}" r="2.4"/>`).join("")}</g>
      <circle cx="58" cy="18" r="2.2" fill="${Y2}"/>`),
    /* 9 艾叶：背面泛白的羽状深裂叶丛 */
    9:()=>svg(mound()+`
      ${stem(52,98,48,40,2.6,GD)}${stem(64,98,68,48,2.6,GD)}${stem(60,98,58,32,2.8,GD)}
      ${[0,1,2,3].map(i=>{const y=86-i*14,x=52-(i%2)*4;return `<g><path d="M${x} ${y} q-12 -4 -16 -12" stroke="${G2}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M${x} ${y} q-10 0 -14 6" stroke="${G2}" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M${x+4} ${y-6} q-8 -2 -11 -9" stroke="#c9d4b8" stroke-width="3.4" stroke-linecap="round" fill="none"/></g>`}).join("")}
      ${[0,1,2,3].map(i=>{const y=88-i*13,x=66+(i%2)*3;return `<g><path d="M${x} ${y} q12 -4 16 -12" stroke="${G1}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M${x} ${y} q10 0 14 6" stroke="${G1}" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M${x-4} ${y-6} q8 -2 11 -9" stroke="#c9d4b8" stroke-width="3.4" stroke-linecap="round" fill="none"/></g>`}).join("")}
      <path d="M58 32 q-10 -2 -14 -10 M58 32 q10 -2 14 -10 M58 32 q0 -8 0 -14" stroke="${G3}" stroke-width="4.4" stroke-linecap="round" fill="none"/>`),
    /* 10 金银花：缠绕藤茎 + 对生叶 + 唇形双花（白转黄） */
    10:()=>svg(mound()+`
      <path d="M52 98 Q44 78 52 62 Q60 46 52 30" stroke="${GE}" stroke-width="2.6" fill="none"/>
      <path d="M66 98 Q74 76 64 58 Q56 42 68 28" stroke="${GD}" stroke-width="2.2" fill="none"/>
      ${leaf(48,80,16,9,-48,G2)}${leaf(60,72,16,9,42,G1)}${leaf(48,56,14,8,-46,GE)}${leaf(66,44,14,8,48,G2)}${leaf(60,30,12,7,-30,G1)}
      <g><path d="M52 26 q-8 -2 -10 -10 M52 26 q-2 -9 -6 -13" stroke="${GE}" stroke-width="1.6" fill="none"/>
      ${fl5(40,12,6,W1,W2,"#f0df9e")}${fl5(46,10,5,W2,"#e4dcc6","#f0df9e")}</g>
      <g><path d="M68 28 q8 -2 10 -10 M68 28 q2 -9 6 -13" stroke="${GD}" stroke-width="1.6" fill="none"/>
      ${fl5(80,14,6,Y1,"#f4e2a6","#e0b84f")}${fl5(74,16,5,Y2,"#f0d98c","#e0b84f")}</g>`),
    /* 11 菊花：重瓣放射菊 + 深裂叶 */
    11:()=>svg(mound()+`
      ${stem(60,96,60,42,2.6,GE)}
      ${leaf(52,84,18,10,-52,G1)}${leaf(68,88,18,10,50,G2)}${leaf(56,66,16,9,-40,GE)}
      <g>${[...Array(16)].map((_,i)=>{const a=i*22.5;return `<ellipse cx="60" cy="36" rx="3.4" ry="13" transform="rotate(${a} 60 36)" fill="${i%2?Y1:Y2}"/>`}).join("")}</g>
      <g>${[...Array(12)].map((_,i)=>{const a=i*30;return `<ellipse cx="60" cy="36" rx="2.8" ry="9" transform="rotate(${a+15} 60 36)" fill="#f4e2a8"/>`}).join("")}</g>
      <circle cx="60" cy="36" r="6" fill="#e0a94f"/><circle cx="60" cy="36" r="3" fill="#c98a3b"/>`),
    /* 12 辛夷：木兰花枝 + 毛笔头花蕾 + 初绽花 */
    12:()=>svg(mound("#cfc4a8","#c0b696")+`
      <path d="M60 98 Q58 66 60 40" stroke="#8a6b4f" stroke-width="4" fill="none"/>
      <path d="M60 66 Q46 58 42 44" stroke="#8a6b4f" stroke-width="2.6" fill="none"/>
      <path d="M60 54 Q74 46 78 32" stroke="#8a6b4f" stroke-width="2.6" fill="none"/>
      <path d="M42 44 q-3 -14 4 -20 q8 4 5 20 q-4 6 -9 0z" fill="#d9bcc2"/>
      <path d="M44 40 q-2 -10 3 -15" stroke="#b08a96" stroke-width="1.6" fill="none"/>
      <path d="M78 32 q-3 -14 4 -20 q8 4 5 20 q-4 6 -9 0z" fill="#e3c9cf"/>
      <g><ellipse cx="60" cy="26" rx="8" ry="12" fill="#eccfd5"/><ellipse cx="53" cy="32" rx="7" ry="10" transform="rotate(-28 53 32)" fill="#e3bfc7"/><ellipse cx="67" cy="32" rx="7" ry="10" transform="rotate(28 67 32)" fill="#e3bfc7"/><ellipse cx="60" cy="24" rx="4.5" ry="8" fill="#f4dde1"/></g>
      <ellipse cx="60" cy="40" rx="3" ry="5" fill="#9a7ab5"/>`),
    /* 13 桑叶：桑枝 + 宽卵锯齿大叶 + 桑葚 */
    13:()=>svg(mound()+`
      <path d="M58 98 Q54 60 58 30" stroke="#96755a" stroke-width="3.4" fill="none"/>
      <path d="M58 60 Q44 52 38 40 M58 48 Q72 40 78 30 M58 76 Q44 72 38 62" stroke="#96755a" stroke-width="2" fill="none"/>
      <path d="M38 22 Q20 26 22 44 Q26 60 44 58 Q56 52 52 34 Q48 24 38 22 Z" fill="${G2}"/>
      <path d="M78 12 Q62 14 62 30 Q64 44 80 44 Q92 40 88 24 Q84 14 78 12 Z" fill="${GE}"/>
      <path d="M38 44 Q24 48 26 62 Q30 74 44 72 Q54 68 50 54 Q46 46 38 44 Z" fill="${G1}"/>
      <path d="M38 26 q4 12 10 26 M78 16 q2 12 4 24 M38 48 q3 10 8 20" stroke="rgba(255,255,255,.4)" stroke-width="1.4" fill="none"/>
      <g fill="#5c2f3d"><ellipse cx="58" cy="40" rx="4" ry="6.5"/>${[0,1,2,3].map(i=>`<circle cx="${56+i*1.6}" cy="${37+i*1.8}" r="1.4" fill="#7a4556"/>`).join("")}</g>`),
    /* 14 枇杷叶：革质大长叶 + 明显平行侧脉 */
    14:()=>svg(mound()+`
      <path d="M60 98 V40" stroke="#96755a" stroke-width="3.6"/>
      <g><ellipse cx="44" cy="38" rx="11" ry="26" transform="rotate(-24 44 38)" fill="${GD}"/>
      ${[-14,-7,0,7,14].map(o=>`<path d="M44 ${44+o} q-9 ${-2} -14 ${o-8}" stroke="rgba(255,255,255,.4)" stroke-width="1.3" fill="none"/>`).join("")}
      <ellipse cx="76" cy="42" rx="10.5" ry="24" transform="rotate(22 76 42)" fill="${G1}"/>
      ${[-12,-6,0,6,12].map(o=>`<path d="M76 ${48+o} q9 ${-2} 13 ${o-8}" stroke="rgba(255,255,255,.4)" stroke-width="1.3" fill="none"/>`).join("")}
      <ellipse cx="60" cy="22" rx="9.5" ry="20" fill="${GE}"/>
      <path d="M60 8 v28" stroke="rgba(255,255,255,.4)" stroke-width="1.4"/></g>`),
    /* 15 银杏叶：扇形二叉叶脉 + 枝上白果 */
    15:()=>svg(mound("#cfc4a8","#c2b898")+`
      <path d="M60 98 V44" stroke="#8a6b4f" stroke-width="3.6"/>
      <g><path d="M56 46 C34 44 20 30 24 12 C44 6 62 16 58 44 Z" fill="#dcb84e"/>
      <path d="M58 46 C80 44 96 30 92 12 C72 6 54 16 60 44 Z" fill="#e6c562"/>
      <path d="M57 44 V10 M57 44 Q46 26 36 16 M57 44 Q36 34 27 24 M60 44 Q74 28 84 16 M60 44 Q80 36 90 24" stroke="#c49a34" stroke-width="1.6" fill="none"/></g>
      <g fill="#f0e6c8"><ellipse cx="48" cy="58" rx="4" ry="5"/><ellipse cx="70" cy="62" rx="4" ry="5"/></g>
      <path d="M56 50 q-6 4 -8 8 M64 54 q5 4 6 8" stroke="#8a6b4f" stroke-width="1.6" fill="none"/>`),
    /* 16 桔梗：蓝紫钟形花 + 轮生卵叶 + 露出根头 */
    16:()=>svg(mound()+`
      ${stem(60,92,60,36,2.4,GE)}
      ${leaf(52,76,16,9,-52,G2)}${leaf(68,76,16,9,52,G1)}${leaf(52,62,14,8,-50,GE)}${leaf(68,62,14,8,50,G2)}${leaf(52,50,12,7,-48,G1)}${leaf(68,50,12,7,48,GE)}
      ${stem(60,40,48,26,1.6,GE)}${stem(60,44,72,30,1.6,GE)}
      ${bell(48,22,7,"#8fa0c9",-8)}${bell(72,26,6.4,"#a3b0d4",10)}${bell(60,30,7.6,"#96a5cf")}
      <g fill="#eef">${[...Array(5)].map((_,i)=>{const a=i*72-90;return `<circle cx="${60+3.6*Math.cos(a*Math.PI/180)}" cy="${30+3.6*Math.sin(a*Math.PI/180)}" r="1"/>`}).join("")}</g>
      <path d="M56 96 q-4 6 -10 8 M60 96 q0 8 0 12 M64 96 q5 6 10 8" stroke="#c9b28a" stroke-width="4" fill="none" stroke-linecap="round"/>`),
    /* 17 柴胡：纤细直立茎 + 线形叶 + 黄色小伞形花序 */
    17:()=>svg(mound()+`
      ${stem(58,98,56,30,2,GE)}${stem(64,98,66,44,1.8,GD)}
      ${[0,1,2,3].map(i=>{const y=88-i*14;return `${leaf(56,y,14,4.5,-66,G1)}${leaf(58,y-4,14,4.5,64,G2)}`}).join("")}
      ${leaf(66,84,13,4.2,-60,GE)}${leaf(68,74,12,4,58,G1)}
      <g>${[-14,-7,0,7,14].map(a=>`<path d="M56 30 L${56+a*0.9} ${18+Math.abs(a)*0.15}" stroke="${GD}" stroke-width="1.2"/><circle cx="${56+a*0.9}" cy="${16+Math.abs(a)*0.15}" r="2.6" fill="${Y1}"/>`).join("")}</g>
      <g>${[-9,0,9].map(a=>`<path d="M66 44 L${66+a} 34" stroke="${GD}" stroke-width="1.1"/><circle cx="${66+a}" cy="32" r="2.2" fill="${Y2}"/>`).join("")}</g>`),
    /* 18 当归：粗壮棕根 + 复伞形白花 + 羽状裂叶 */
    18:()=>svg(mound("#cfc4a8","#bfae8e")+`
      <path d="M60 98 q-2 -12 -4 -18 M56 80 q-8 6 -12 12 M62 82 q8 6 10 12" stroke="#b08a54" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M60 82 V36" stroke="#7a9568" stroke-width="3"/>
      ${leaf(52,64,18,9,-54,G2)}${leaf(68,64,18,9,54,G1)}${leaf(52,50,15,8,-52,GE)}${leaf(68,50,15,8,52,G2)}
      <g>${[-18,-9,0,9,18].map(a=>`<path d="M60 36 L${60+a} ${20+Math.abs(a)*0.2}" stroke="#7a9568" stroke-width="1.3"/>`).join("")}
      ${[-18,-9,0,9,18].map(a=>`<g>${[0,1,2,3].map(k=>`<circle cx="${60+a+(k%2?2.4:-2.4)}" cy="${18+Math.abs(a)*0.2+Math.floor(k/2)*2.6}" r="1.7" fill="${W1}"/>`).join("")}</g>`).join("")}</g>
      <path d="M60 36 q-2 6 -6 8 M60 36 q2 6 6 8" stroke="#7a9568" stroke-width="1.3" fill="none"/>`),
    /* 19 枸杞：下垂拱枝 + 披针叶 + 红玛瑙浆果 */
    19:()=>svg(mound()+`
      <path d="M50 98 Q48 60 62 34 Q74 16 92 20" stroke="#8a6b4f" stroke-width="2.6" fill="none"/>
      <path d="M58 98 Q64 72 84 58 Q96 50 104 54" stroke="#96755a" stroke-width="2.2" fill="none"/>
      ${leaf(56,74,12,5,-38,G2)}${leaf(66,52,12,5,-20,GE)}${leaf(76,36,12,5,10,G1)}${leaf(88,24,11,5,25,G2)}${leaf(72,64,12,5,-14,G1)}${leaf(88,54,11,5,18,GE)}${leaf(100,52,10,4.5,40,G2)}
      <g fill="#d4553f">${[[64,44],[74,30],[84,22],[70,58],[84,52],[94,54]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]+6}" rx="3.4" ry="4.6"/><circle cx="${p[0]-1}" cy="${p[1]+4.6}" r="1.1" fill="#f08a6a"/>`).join("")}</g>
      ${[[64,44],[74,30],[84,22],[70,58],[84,52],[94,54]].map(p=>`<path d="M${p[0]} ${p[1]} v1.6" stroke="#8a6b4f" stroke-width="1.2"/>`).join("")}`),
    /* 20 山楂：裂叶 + 成簇带白点红果 */
    20:()=>svg(mound()+`
      <path d="M60 98 V40" stroke="#8a6b4f" stroke-width="3.4"/>
      <path d="M60 66 Q48 58 44 48 M60 56 Q72 48 76 38" stroke="#8a6b4f" stroke-width="2.2" fill="none"/>
      <path d="M44 48 q-8 -2 -10 -10 q6 -6 12 -2 q-2 -8 6 -10 q6 4 4 10 q8 0 6 8 q-8 6 -18 4z" fill="${G2}"/>
      <path d="M76 38 q-8 -2 -10 -10 q6 -6 12 -2 q-2 -8 6 -10 q6 4 4 10 q8 0 6 8 q-8 6 -18 4z" fill="${G1}"/>
      <g>${[[56,72],[66,70],[61,80],[72,78],[52,80]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5.4" fill="#c94f3d"/><circle cx="${p[0]-1.4}" cy="${p[1]-1.4}" r="1.4" fill="#f08a6a"/><circle cx="${p[0]+1.6}" cy="${p[1]+1.8}" r="0.9" fill="#f6dfc0" opacity=".8"/><circle cx="${p[0]-1.8}" cy="${p[1]+2}" r="0.8" fill="#f6dfc0" opacity=".8"/>`).join("")}</g>
      ${[[56,72],[66,70],[61,80],[72,78],[52,80]].map(p=>`<path d="M60 66 q${(p[0]-60)/2} ${(p[1]-70)/2} ${p[0]-60} ${p[1]-66}" stroke="#8a6b4f" stroke-width="1.2" fill="none"/>`).join("")}`),
    /* 21 茯苓：松木桩旁的不规则菌核（外褐内白切面） */
    21:()=>svg(mound("#c9bfa0","#b7ac8c")+`
      <path d="M28 98 L28 62 q0 -4 4 -4 h20 q4 0 4 4 V98 Z" fill="#96755a"/>
      <ellipse cx="42" cy="60" rx="14" ry="5" fill="#b08a66"/>
      <ellipse cx="42" cy="60" rx="10" ry="3.4" fill="#c9a274"/>
      <path d="M30 70 q8 3 16 1 M30 78 q8 3 16 1 M30 86 q8 3 16 1" stroke="#7a5c44" stroke-width="1.4" fill="none"/>
      <path d="M64 84 q-8 -14 4 -22 q14 -8 22 2 q8 10 -2 20 q-12 10 -24 0z" fill="#6e4f36"/>
      <path d="M66 82 q-6 -11 3 -17 q11 -6 17 2 q6 8 -2 15 q-9 8 -18 0z" fill="#8a6a4d"/>
      <path d="M84 66 q10 -2 12 6 q2 8 -6 12 q6 -10 -6 -18z" fill="#f2ece0"/>
      <path d="M86 68 q7 -1 8 5" stroke="#d8cfc0" stroke-width="1.4" fill="none"/>`),
    /* 22 决明子：羽状复叶 + 细长荚果 + 菱形种子 */
    22:()=>svg(mound()+`
      ${stem(58,96,56,34,2.2,GE)}
      ${[0,1,2].map(i=>{const y=86-i*16;return `<path d="M56 ${y} l-14 -8" stroke="${GE}" stroke-width="1.5"/>${leaf(42,y-8,9,6,-62,G2)}${leaf(48,y-4,9,6,-48,G1)}<path d="M56 ${y} l14 -8" stroke="${GE}" stroke-width="1.5"/>${leaf(70,y-8,9,6,62,G1)}${leaf(64,y-4,9,6,48,G2)}`}).join("")}
      <path d="M64 60 q12 -6 16 -18 q2 14 -10 22 q-6 2 -6 -4z" fill="#a98d4e"/>
      <path d="M66 62 q9 -6 12 -14" stroke="#8a6f3a" stroke-width="1.3" fill="none"/>
      ${fl5(56,26,5,Y1,"#f4e2a6","#e0b84f")}
      <g fill="#8a6b3f"><ellipse cx="44" cy="58" rx="4" ry="6" transform="rotate(-24 44 58)"/><ellipse cx="52" cy="64" rx="4" ry="6" transform="rotate(10 52 64)"/></g>
      <g fill="#c9a76a"><ellipse cx="44" cy="57" rx="1.6" ry="3.4" transform="rotate(-24 44 57)"/><ellipse cx="52" cy="63" rx="1.6" ry="3.4" transform="rotate(10 52 63)"/></g>`),
    /* 23 肉桂：桂枝绿叶 + 卷起的肉桂皮筒 */
    23:()=>svg(mound("#cfc4a8","#c0b696")+`
      <path d="M40 98 V52" stroke="#8a6b4f" stroke-width="3.4"/>
      ${leaf(32,44,20,8,-40,G1)}${leaf(48,40,20,8,38,GE)}${leaf(40,26,18,7,0,G2)}${leaf(30,60,16,7,-48,GE)}${leaf(50,58,16,7,46,G1)}
      ${vein(32,44,16,1.1,-40)}${vein(48,40,16,1.1,38)}
      <g><path d="M64 98 V56 q0 -5 7 -5 q7 0 7 5 V98 Z" fill="#a06b3f"/>
      <ellipse cx="71" cy="55" rx="7" ry="3.6" fill="#c98f5c"/>
      <ellipse cx="71" cy="55" rx="4" ry="2" fill="#8a5630"/>
      <path d="M66 64 q5 3 10 0 M66 74 q5 3 10 0 M66 84 q5 3 10 0" stroke="#7a4d28" stroke-width="1.5" fill="none"/>
      <path d="M80 98 V64 q0 -4 5.5 -4 q5.5 0 5.5 4 V98 Z" fill="#b57c4a"/>
      <ellipse cx="85.5" cy="63" rx="5.5" ry="2.8" fill="#d59c68"/>
      <ellipse cx="85.5" cy="63" rx="3" ry="1.5" fill="#8a5630"/></g>`),
    /* 24 紫苏：卵圆锯齿叶，正面绿背面紫 */
    24:()=>svg(mound()+`
      ${stem(60,98,60,34,2.8,"#7a5c6e")}
      <g>
      ${blob(46,52,15,11,-40,GE)}${blob(74,52,15,11,40,"#8f7490")}
      ${blob(42,72,14,10,-48,G1)}${blob(78,72,14,10,48,"#9a7f9a")}
      ${blob(60,34,13,9,0,G2)}
      <path d="M46 52 q-6 -4 -8 -10 M74 52 q6 -4 8 -10" stroke="rgba(255,255,255,.4)" stroke-width="1.3" fill="none"/>
      <path d="M46 58 q-3 5 2 8 q-6 1 -7 -4 q6 0 5 -4z" fill="#7a5c6e" opacity=".6"/>
      <path d="M74 58 q3 5 -2 8 q6 1 7 -4 q-6 0 -5 -4z" fill="#b092b4" opacity=".55"/>
      </g>
      ${fl5(60,22,4.5,"#c4a3c9","#d3b8d8","#efe6c4")}`),
  };

  function svg(inner){
    return `<svg class="pot" viewBox="0 0 120 120"><g filter="url(#wp)"><g filter="url(#wsoft)">${inner}</g></g></svg>`;
  }
  export const codexArt = h => botanicalArt(h);

import {expandedArt} from './expanded-art.js';

import {botanicalArt} from './botanical-art.js';
