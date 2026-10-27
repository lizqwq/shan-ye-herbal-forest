const C={g:'#87a17e',g2:'#a3b595',s:'#7c957a',w:'#9b886b',p:'#b4a0c6',y:'#ddca87',white:'#eee9da'};
const e=(x,y,rx,ry,c=C.g,a=0)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`;
const l=(x,y,n=22,w=7,a=0,c=C.g)=>`<path d="M0 0Q${w} ${-n*.5} 0 ${-n}Q${-w} ${-n*.5} 0 0Z" transform="translate(${x} ${y}) rotate(${a})" fill="${c}"/>`;
const s=(x,y,a,b,w=1.6,c=C.s)=>`<path d="M${x} ${y}Q${(x+a)/2} ${(y+b)/2-2} ${a} ${b}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const flower=(x,y,r=6,c=C.white,n=5)=>Array.from({length:n},(_,i)=>e(x+Math.sin(i*6.283/n)*r*.65,y+Math.cos(i*6.283/n)*r*.65,r*.5,r*.6,c,i*360/n)).join('')+e(x,y,r*.25,r*.25,C.y);
const comp=(x,y,a=0,n=7)=>`<g transform="translate(${x} ${y}) rotate(${a})">${s(0,0,0,-28,1)}${Array.from({length:n},(_,i)=>l(0,-i*4,10,2,-60)+l(0,-i*4,10,2,60,C.g2)).join('')}</g>`;
const pair=(ys,w=7,n=20)=>ys.map(y=>l(58,y,n,w,-50)+l(58,y,n,w,50,C.g2)).join('');
const root=()=>'<path d="M57 99q-5 7-12 9m14-9 1 13m1-13q6 8 12 8" stroke="#b99b77" stroke-width="3" fill="none"/>';
const basal=()=>[-55,-25,10,40,65].map(a=>l(58,101,35,7,a)).join('');
const branch=()=>s(42,99,53,37,3,C.w)+s(47,72,78,45,2,C.w)+s(51,53,32,37,2,C.w);
const umbel=(x,y,r=17)=>Array.from({length:9},(_,i)=>{let t=i*Math.PI/8;let a=x+Math.cos(t)*r,b=y-Math.sin(t)*r;return s(x,y+5,a,b,.8)+flower(a,b,2.8);}).join('');
const artwork={
85:()=>s(58,100,58,42)+comp(58,94,-55)+comp(58,79,48)+comp(58,65,-45)+umbel(58,39)+umbel(39,49,10),
86:()=>'<path d="M20 99Q47 89 65 97T100 91" stroke="#82957c" fill="none" stroke-width="2"/>'+[27,43,61,79,94].map(x=>s(x,97,x,70)+[78,88].map(y=>l(x,y,8,4,-55)+l(x,y,8,4,55)).join('')+flower(x,68,4,C.p)).join(''),
87:()=>basal()+s(58,100,58,46)+Array.from({length:7},(_,i)=>l(58,42,22,6,i*360/7,C.white)).join('')+[[51,38],[61,37],[55,47],[65,45]].map(([x,y])=>e(x,y,3,4,C.y)).join(''),
88:()=>s(58,100,58,23,2)+[87,68].map(y=>[-65,-30,0,30,65].map(a=>l(58,y,24,3.5,a)).join('')).join('')+[26,38,50,61].map((y,i)=>s(58,y,70,y-3)+`<path d="M64 ${y+3}Q61 ${y-12} 72 ${y-14}Q82 ${y-12} 80 ${y-1}L69 ${y-1} 64 ${y+3}Z" fill="#969eb9"/>`).join('')+root(),
89:()=>s(58,100,58,39,3)+[-52,48].map(a=>comp(58,85,a,5)).join('')+comp(58,64,-50,5)+umbel(58,36,22)+e(58,29,19,10,'#d5ddba')+Array.from({length:15},(_,i)=>flower(42+i%5*8,25+Math.floor(i/5)*6,2,'#e1e5cb')).join('')+root(),
90:()=>s(58,101,58,18)+[90,77,64,51].map((y,i)=>l(58,y,24,4,i%2?58:-58)).join('')+[24,34,44,54].map((y,i)=>flower(58+(i%2?6:-6),y,5,'#bf9cbb',4)).join(''),
91:()=>Array.from({length:14},(_,i)=>{let x=22+i*5,y=63+i%4*6;return `<path d="M${x} 102l3-${102-y}m-2 12-9-10m11 3 8-13m-8 28 10-8m-11-7-7-10" fill="none" stroke="${i%2?'#bcc4b1':'#cbd1c0'}" stroke-width="2" stroke-linecap="round"/>`;}).join(''),
92:()=>branch()+[41,62,81].map((y,i)=>l(48,y,24,10,i%2?55:-45,C.g2)).join('')+flower(77,42,11,C.white)+flower(31,34,9,C.white),
93:()=>branch()+[39,53,67,81,94].map(y=>l(48,y,17,2,-52)+l(48,y,17,2,52,C.g2)).join('')+[39,52,65].map(y=>flower(57,y,3,'#b5b7cd')).join(''),
94:()=>branch()+l(49,80,27,10,-50)+l(59,67,27,10,48)+l(43,55,23,9,-30)+flower(78,43,10,C.white)+e(32,36,5,7,'#d4d9bd'),
95:()=>s(58,100,58,24)+pair([88,72,57],10,23)+[24,35,46].map(y=>[-8,8].map(dx=>flower(58+dx,y,4,C.p)).join('')).join(''),
96:()=>basal()+e(58,99,12,9,'#c2af8c')+s(81,101,81,20,2)+Array.from({length:15},(_,i)=>flower(81+(i%2?4:-4),25+i*4,2.6,C.white)).join(''),
97:()=>branch()+[43,58,76].map((y,i)=>l(48,y,17,9,i%2?50:-50)).join('')+[[74,49],[63,70],[35,50]].map(([x,y])=>s(x,y-9,x,y)+e(x,y,6,7,'#c8ad78')).join('')+s(51,61,58,54,1,C.w),
98:()=>s(58,101,58,39)+[86,69,54].map(y=>[-50,-15,20,55].map(a=>l(58,y,23,2,a)).join('')).join('')+flower(58,35,9,C.white)+e(79,77,7,7,'#bca87e')+s(79,82,79,72,.8,C.w),
99:()=>branch()+[40,59,78].map(y=>l(49,y,10,5,-50)+s(49,y+7,58,y,1,C.w)).join('')+'<path d="M49 82q-5 8-1 12q6 0 5-5Z" fill="#d5be92"/>',
100:()=>'<path d="M27 99Q48 87 69 96T98 83" fill="none" stroke="#82957b" stroke-width="2"/>'+[34,54,76].map((x,i)=>s(x,97,x+4,66)+l(x+4,77,24,11,i%2?35:-30)).join('')+'<path d="M78 65 67 43Q78 30 89 43L83 65Z" fill="#eee9de"/>'+root(),
101:()=>s(53,101,53,35,8,C.w)+s(53,65,79,41,4,C.w)+[31,49,70].map((x,i)=>l(x,53+i%2*12,26,9,i%2?45:-35)).join('')+s(50,89,50,60,.8,'#bca485')+s(56,87,56,59,.8,'#bca485'),
102:()=>s(58,101,58,30)+pair([88,70,52],9,23)+[45,64].map(y=>s(58,y,77,y-4)+flower(78,y-5,4,C.white)).join(''),
103:()=>[-68,-42,-15,15,42,68].map(a=>l(58,102,53-Math.abs(a)*.15,7,a,C.g2)).join('')+s(58,98,75,25)+Array.from({length:12},(_,i)=>e(79,27+i*3,2,4,'#c58f79',30)).join(''),
104:()=>branch()+comp(52,76,-45,6)+comp(65,60,40,6)+[[51,60],[57,80]].map(([x,y])=>e(x,y,4,4,C.w)+s(x,y,x-11,y-13,1,C.w)+s(x,y,x+11,y-14,1,C.w)).join('')+flower(77,40,6,C.y,15),
105:()=>s(58,101,58,29)+[87,72,57].map((y,i)=>l(58,y,27,5,i%2?52:-52)+e(57,y+1,3,2,'#b99f8b')).join('')+s(58,39,78,30)+[0,1,2,3,4,5].map(i=>e(78,28+i*3,3,2,'#c2a2bb')).join(''),
106:()=>[37,52,66,79].map((x,i)=>s(x,101,x,30+i%2*13,2)+[57,78].map(y=>s(x-2,y,x+2,y,1,'#b6bd9e')).join('')+umbel(x,29+i%2*13,7)).join('')+root(),
107:()=>[-46,-20,15,43].map(a=>l(58,102,66,12,a,C.g2)).join('')+s(58,101,58,49)+[51,58,65,72].map(y=>l(58,y,14,8,-55,'#d7cfad')+l(58,y,14,8,55,'#d7cfad')).join('')+e(58,103,12,5,'#c5a26d'),
108:()=>'<path d="M20 97Q14 75 38 74Q60 75 58 93L39 86 45 101Q27 108 20 97Z" fill="#9eaf8b"/>'+e(83,98,21,9,C.g2)+s(64,100,64,73)+Array.from({length:15},(_,i)=>l(64,75,23,4,i*24,C.white)).join('')+e(64,75,7,5,C.y)
};
// 仅陈皮等加工后轮廓发生显著变化的材料，采用鲜品主体＋更小的加工品。
export function processedCitrus(){return branch()+l(49,78,26,10,-50)+l(63,62,26,10,48)+l(42,51,22,9,-40)+e(73,62,13,13,'#d4ac69')+e(40,78,12,12,'#d9b273')+e(73,50,3,2,C.g)+'<path d="M89 95q8-7 16-1l-3 9-11-1Z" fill="#b98c5f"/><path d="m91 96 5 4 6-3" fill="none" stroke="#d1a477" stroke-width="1.3"/>';}
export const REGIONAL_ART_IDS=Object.keys(artwork).map(Number);
export function regionalHerbArt(id){return artwork[id]?.();}
// 轮廓发生明显变化的加工药材：鲜品占主体，加工品仅作小比例辨识辅助。
export const PROCESSED_ART={
23:()=>branch()+l(49,76,29,11,-50)+l(58,65,30,11,40)+l(43,50,26,9,-30)+'<path d="M91 91h7v15h-7Z" fill="#b58e67"/><ellipse cx="94.5" cy="91" rx="3.5" ry="2" fill="#cbb08b"/>',
36:()=>branch()+l(49,79,31,13,-48)+l(61,65,31,13,48)+l(44,51,28,12,-35)+'<path d="M90 92q4-3 8 0v14q-4 3-8 0Z" fill="#a88d75"/><path d="M93 94v10" stroke="#796956" stroke-width="1"/>',
34:()=>branch()+l(48,77,19,8,-50)+l(61,62,18,8,50)+[[36,51],[73,51],[57,82]].map(([x,y])=>e(x,y,7,8,'#b89777')).join('')+e(94,101,4,2.5,'#ac8d6f'),
32:()=>[39,53,68].map((x,i)=>s(x,102,x,40)+l(x,82,40,4,-45)+l(x,68,37,4,50)+e(x+3,42+i*7,5,7,'#c7bd94')).join('')+e(95,101,3.5,4,'#e4ddbf')+e(102,103,3,3.5,'#ded6b5')
};
