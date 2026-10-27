import {regionalHerbArt,processedCitrus,PROCESSED_ART,REGIONAL_ART_IDS} from './current-regional-art.js';
// 全部药材共用网页B的块面语汇；每个编号拥有独立的器官组合与叶序。
const C={g:'#87a17e',g2:'#9db28f',light:'#b3c2a0',dark:'#6f8a6a',stem:'#7c957a',wood:'#9b886b',purple:'#b9a4cf',pale:'#c9b6da',yellow:'#e8cf83',white:'#f2eddf',red:'#bd8c78'};
const el=(x,y,rx,ry,c,deg=0)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" transform="rotate(${deg} ${x} ${y})"/>`;
const line=(x,y,a,b,w=1.6,c=C.stem)=>`<path d="M${x} ${y}Q${(x+a)/2} ${(y+b)/2-2} ${a} ${b}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const leaf=(x,y,l=19,w=7,deg=0,c=C.g)=>`<path d="M0 0Q${w} ${-l*.48} 0 ${-l}Q${-w} ${-l*.5} 0 0Z" transform="translate(${x} ${y}) rotate(${deg})" fill="${c}"/>`;
const heart=(x,y,s=1,c=C.g,angle=0)=>`<path d="M0 0C-17-8-14-23-5-21Q0-22 0-17Q5-25 12-20C21-12 11-5 0 0Z" fill="${c}" transform="translate(${x} ${y}) rotate(${angle}) scale(${s})"/>`;
const fan=(x,y,s=1,c=C.g,angle=0)=>`<path d="M0 0Q-9-7-15-21Q-17-26-12-26L-5-28 0-23 5-28 13-26Q18-26 15-21Q10-8 0 0Z" fill="${c}" transform="translate(${x} ${y}) rotate(${angle}) scale(${s})"/>`;
const lobed=(x,y,s=1,c=C.g,angle=0)=>`<path d="M0 0Q-9-4-12-11L-5-11-17-19-7-18-12-29-2-24 0-35 4-25 14-31 11-20 21-19 11-12 15-8 6-7Z" fill="${c}" transform="translate(${x} ${y}) rotate(${angle}) scale(${s})"/>`;
const palmate=(x,y,n=5,s=1,c=C.g)=>Array.from({length:n},(_,i)=>leaf(x,y,24*s,7*s,(i-(n-1)/2)*34,c)).join('');
const petals=(x,y,r=7,c=C.purple,n=5,center=C.yellow)=>`<g>${Array.from({length:n},(_,i)=>el(x,y-r*.62,r*.43,r*.72,c,i*360/n)).join('')}${el(x,y,r*.27,r*.27,center)}</g>`;
const daisy=(x,y,r=9,c=C.white,n=14)=>petals(x,y,r,c,n,C.yellow);
const bell=(x,y,s=1,c=C.light,spotted=false)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-5 0Q-10 7-11 17Q-7 21-3 18Q0 23 4 19Q8 22 11 17Q10 7 5 0Z" fill="${c}"/>${spotted?[-5,0,5].map((a,i)=>el(a,7+i%2*4,1.2,2,'#b59c9a')).join(''):''}<path d="M-4 1Q0 4 4 1" fill="none" stroke="${C.g2}" stroke-width="1"/></g>`;
const trumpet=(x,y,s=1,c=C.white)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4 17-10-7-5-4 0-10 5-4 10-7 4 17Z" fill="${c}"/>${[-4,0,4].map(a=>line(a,13,a*1.4,-2,.7,'#b7a9bc')).join('')}</g>`;
const spike=(x,y,len=24,color=C.purple,width=3)=>line(x,y+len,x,y,1)+Array.from({length:Math.floor(len/3)},(_,i)=>el(x+(i%2?width*.4:-width*.4),y+i*3,width,1.8,color,i%2?25:-25)).join('');
const umbel=(x,y,r=15,color=C.white)=>Array.from({length:7},(_,i)=>{const a=(i/6*.85+.075)*Math.PI,xx=x-Math.cos(a)*r,yy=y-Math.sin(a)*r;return line(x,y+4,xx,yy,1)+petals(xx,yy,2.8,color,5);}).join('');
const compound=(x,y,l=27,n=5,deg=0,c=C.g,w=4)=>`<g transform="translate(${x} ${y}) rotate(${deg})">${line(0,0,0,-l,1)}${Array.from({length:n},(_,i)=>{const yy=-4-i*(l-7)/n;return leaf(0,yy,10,w,-55,c)+leaf(0,yy-1,10,w,55,c);}).join('')}${leaf(0,-l+4,9,w,0,c)}</g>`;
const opposite=(ys=[83,69,54],l=16,w=6,c=C.g)=>ys.map(y=>leaf(60,y,l,w,-54,c)+leaf(60,y-1,l,w,54,c)).join('');
const alternate=(ys=[84,71,58,45],l=18,w=6,c=C.g)=>ys.map((y,i)=>leaf(60,y,l,w,i%2?52:-52,c)).join('');
const roots=(x=60,y=99,c='#c2a276')=>`<path d="M${x} ${y}q-3 5-8 12m8-12q0 7 2 13m-2-13q6 3 9 11" fill="none" stroke="${c}" stroke-width="3.8" stroke-linecap="round"/>`;
const patch=()=>el(60,103,40,8,'#c9cfae')+el(44,100,22,7,'#b6c09b')+el(78,102,23,7,'#bac59f');
const stem=(top=28)=>line(60,101,60,top,2);
const branches=(nodes)=>nodes.map(([x,y])=>line(60,100,x,y,1.6)).join('');
const blade=(x,y,angle,l=67,w=3,c=C.g)=>leaf(x,y,l,w,angle,c);
const bladeFan=(n=7,l=66,w=3)=>Array.from({length:n},(_,i)=>blade(60,102,(i-(n-1)/2)*13,l-Math.abs(i-(n-1)/2)*4,w,i%2?C.g:C.g2)).join('');
const creeping=(color=C.stem)=>`<path d="M24 101Q44 88 62 99T97 93" stroke="${color}" stroke-width="2" fill="none"/>`;
const berry=(x,y,c=C.red)=>el(x,y,2.9,4,c,-10);
const A={
 1:()=>[[-32,-2],[-14,0],[13,1],[31,-2]].map(([a,b],i)=>line(60,99,60+a*.6,85+b)+heart(60+a*.6,85+b,.7,i%2?C.g:C.g2,a)).join('')+branches([[47,43],[69,35]])+petals(47,42,7)+petals(69,34,8),
 2:()=>[-55,-27,23,53].map(a=>lobed(60,102,.9,C.g,a)).join('')+line(60,101,62,28,2)+daisy(62,27,10,C.yellow,19),
 3:()=>creeping('#bd927d')+[30,44,61,77,90].map((x,i)=>line(x,98,x+(i%2?8:-6),77,1.7,'#bd927d')+el(x-3,85,6,9,C.g2,-45)+el(x+8,81,6,8,C.g,42)).join('')+petals(78,74,3.5,C.yellow),
 4:()=>[-65,-35,-8,24,60].map(a=>leaf(60,102,30,14,a,a<0?C.g2:C.g)).join('')+[[43,31],[61,23],[78,39]].map(([x,y])=>line(60,99,x,y,1.3)+spike(x,y,17,'#a7b085',2)).join(''),
 5:()=>stem(27)+heart(60,83,.8,C.g,-43)+heart(60,67,.85,C.g2,43)+heart(60,50,.7,C.g,-48)+petals(60,27,11,C.white,4)+spike(60,21,12,C.yellow,2),
 6:()=>stem(23)+opposite([87,72,57],20,9)+spike(60,23,21,C.pale,2.5)+[53,70].map(y=>petals(62,y,3,C.pale)).join(''),
 7:()=>stem(22)+[86,68,49].map(y=>lobed(60,y,.62,C.g,-42)+lobed(60,y,.62,C.g2,42)+el(60,y-9,5,2.8,C.purple)).join('')+spike(60,22,17,C.purple,2),
 8:()=>stem(22)+compound(60,87,27,4,-51)+compound(60,73,27,4,54,C.g2)+spike(60,23,28,C.yellow,2.7),
 9:()=>stem(24)+[85,69,53].map((y,i)=>lobed(60,y,.61,i%2?C.light:C.g,i%2?45:-45)).join('')+lobed(60,40,.48,C.g2,0),
 10:()=>line(60,101,57,27,2.2,C.wood)+opposite([87,69,52],18,9)+line(57,32,44,30)+line(57,32,72,30)+`<path d="M44 30q-15-14-12-25q10 2 15 23M72 30q14-13 10-24q-11 5-13 21" fill="${C.white}"/><path d="M45 29q-2-18 6-23q7 14-3 26M71 30q4-17-3-23q-8 10 0 24" fill="${C.yellow}"/>`,
 11:()=>stem(26)+lobed(60,84,.75,C.g,-50)+lobed(60,65,.67,C.g2,45)+daisy(60,27,12,C.yellow,22),
 12:()=>line(60,101,58,28,3,C.wood)+line(60,64,79,40,2,C.wood)+line(58,52,42,33,2,C.wood)+el(58,26,7,15,'#c7adbc',-7)+el(79,37,6,12,'#cdb8c5',25)+el(42,31,6,11,'#d9c4cd',-30),
 13:()=>line(60,101,60,34,2.3,C.wood)+heart(60,81,1.2,C.g2,-43)+heart(60,60,1.05,C.g,44)+heart(60,44,.9,C.g2,-25)+spike(75,52,10,'#a18891',3),
 14:()=>line(60,101,60,28,2.7,C.wood)+[[-38,82],[42,65],[-28,48]].map(([a,y])=>leaf(60,y,34,12,a,a<0?C.g:C.g2)+line(60,y,60+Math.sin(a*Math.PI/180)*23,y-24,.7,'#c3cfad')).join(''),
 15:()=>line(60,101,61,51,2.2,C.wood)+line(60,64,44,43,1.3,C.wood)+line(61,56,77,36,1.3,C.wood)+fan(44,43,1.03,C.g2,-30)+fan(77,36,1.03,C.yellow,20)+fan(61,53,1.1,C.g,0),
 16:()=>stem(26)+opposite([86,73],19,5)+alternate([59,47],17,4)+petals(60,26,12,'#aab0ce',5,'#e0dcd1')+line(60,42,79,27)+el(79,23,4,7,'#b8bbd7'),
 17:()=>stem(27)+alternate([87,74,61,48],21,3.4)+branches([[45,38],[76,43]])+umbel(60,26,14,C.yellow)+umbel(45,38,8,C.yellow)+umbel(76,42,8,C.yellow),
 18:()=>stem(35)+compound(60,83,27,3,-49)+compound(60,65,27,3,50)+branches([[43,45],[78,43]])+umbel(60,34,13)+umbel(43,45,9)+umbel(78,43,9)+roots(),
 19:()=>`<path d="M44 101Q41 42 80 27M53 100Q69 64 94 66" fill="none" stroke="${C.wood}" stroke-width="2"/>`+[[51,59,-45],[62,40,48],[75,31,-25],[76,75,45]].map(([x,y,a])=>leaf(x,y,18,5,a)).join('')+[[52,68],[65,51],[79,39],[82,77],[92,70]].map(([x,y])=>line(x,y-9,x,y-3,1)+berry(x,y)).join(''),
 20:()=>line(60,101,61,43,2,C.wood)+line(61,69,39,43,1.7,C.wood)+lobed(39,46,.75,C.g,-35)+lobed(61,55,.75,C.g2,38)+[[55,77],[62,74],[69,80],[58,84],[65,88]].map(([x,y])=>el(x,y,3.8,4,C.red)).join(''),
 21:()=>el(51,85,24,20,'#a38c6f')+el(75,90,16,15,'#b7a082')+el(43,85,18,17,'#ded5ba')+el(43,85,13,13,'#ede6d2'),
 22:()=>stem(28)+compound(60,83,26,3,-48)+compound(60,65,26,3,51)+petals(60,28,7,C.yellow)+`<path d="M75 63Q101 78 83 90M47 67Q25 88 43 94" fill="none" stroke="#a4ab7a" stroke-width="3"/>`,
 23:()=>line(45,101,46,40,2.5,C.wood)+leaf(46,80,22,10,-45)+leaf(46,61,24,10,45)+`<path d="M68 101V60q5-5 10 0v41m9 0V68q5-5 10 0v33" fill="#bd9d77"/>`+el(73,60,5,2.4,'#d2b78f')+el(92,68,5,2.4,'#d2b78f'),
 24:()=>stem(26)+opposite([87,70,53],21,12,'#a4a790')+leaf(60,70,21,12,54,'#a694b1')+spike(60,23,22,C.pale,2),
 25:()=>[-50,-26,0,27,51].map(a=>leaf(60,102,38,11,a,'#9bad98')).join('')+branches([[50,38],[66,30],[80,45]])+umbel(50,37,8,C.yellow)+umbel(66,29,9,C.yellow)+umbel(80,45,6,C.yellow),
 26:()=>stem(29)+compound(60,88,30,6,-45)+compound(60,65,31,6,45)+line(60,54,44,27)+spike(44,25,18,'#e5d8a2',3)+roots(),
 27:()=>stem(27)+compound(60,83,27,4,-49)+compound(60,63,27,4,48)+spike(60,25,22,'#baa9c8',3)+roots(),
 28:()=>stem(30)+lobed(60,86,.85,C.g,-50)+lobed(60,66,.75,C.light,46)+el(60,34,6,7,C.g2)+Array.from({length:9},(_,i)=>line(55+i*1.3,30,53+i*1.7,18,1.8,C.purple)).join('')+el(60,104,10,7,'#c2ab85'),
 29:()=>stem(27)+opposite([85,68],25,4)+leaf(60,51,25,3,-40)+line(60,28,76,25)+bell(76,25,.8,'#cbd4ab',true)+el(58,103,6,7,'#e2d5b5')+el(65,103,5,6,'#d5c6a4'),
 30:()=>stem(30)+compound(60,85,27,3,-52)+compound(60,65,27,3,52)+umbel(60,29,17)+roots(),
 31:()=>line(53,101,40,62,1.7)+el(40,58,22,12,C.g2,-12)+Array.from({length:6},(_,i)=>line(40,58,25+i*6,51+i%2*13,.6,'#b6c6a2')).join('')+line(65,101,74,50,2)+`<path d="M61 52 70 75Q75 81 82 74L88 49Z" fill="${C.g2}"/>`+el(75,50,15,6,C.light)+[67,75,82].map(x=>el(x,50,2,1.6,C.dark)).join(''),
 32:()=>stem(24)+[85,69,52].map((y,i)=>leaf(60,y,38,7,i%2?51:-51)).join('')+[[44,45],[78,56],[43,73],[77,80]].map(([x,y])=>line(60,y-13,x,y)+el(x,y+4,3.4,5,'#d8d2b5')).join(''),
 33:()=>line(59,101,61,29,2,C.wood)+leaf(60,72,25,12,-46)+leaf(60,50,24,12,48)+line(61,54,78,58)+Array.from({length:9},(_,i)=>el(78+(i%2)*5,62+i*3,3,3,C.red)).join(''),
 34:()=>line(57,101,59,36,2,C.wood)+alternate([84,68,51],18,9)+[[43,64],[77,80]].map(([x,y])=>line(60,y-14,x,y)+el(x,y+3,4,5,'#b59a7e')).join('')+el(80,102,7,4,'#b49b7b'),
 35:()=>line(51,101,54,35,2.2,C.wood)+leaf(54,70,24,10,-45)+leaf(54,50,23,10,48)+el(75,69,10,10,'#d8b17d')+`<path d="M70 101q17-19 24-7q5 10-7 12q-13 0-10-9" fill="none" stroke="#c6a071" stroke-width="5"/>`,
 36:()=>line(55,101,55,47,2.6,C.wood)+[-56,-27,18,52].map(a=>leaf(55,58,32,12,a,C.g2)).join('')+`<path d="M78 103V74q7-7 14 0v29" fill="#b29b7d"/>`+el(85,75,7,3,'#c8b18b'),
 37:()=>creeping()+[[31,92],[47,85],[68,88],[88,79]].map(([x,y])=>line(x,99,x,y-29)+Array.from({length:9},(_,i)=>leaf(x,y-i*2.7,7,2,i%2?65:-65)).join('')+spike(x,y-34,8,'#c6bd8e',1.9)).join(''),
 38:()=>branches([[42,29],[60,21],[78,31]])+[[42,29],[60,21],[78,31]].map(([x,y])=>Array.from({length:9},(_,i)=>leaf(x+(60-x)*i/12,y+9+i*6,10,1.8,-58,'#8faaa0')+leaf(x+(60-x)*i/12,y+10+i*6,10,1.8,58,'#9daf9b')).join('')+petals(x+4,y+12,2.8,'#bdc5d8')).join(''),
 39:()=>creeping(C.wood)+[[32,71],[49,62],[67,64],[86,75]].map(([x,y])=>line(x,99,x,y)+[0,7,14,21].map(a=>leaf(x,y+a,7,3,-55)+leaf(x,y+a,7,3,55)).join('')+petals(x,y,3,C.pale)).join(''),
 40:()=>branches([[44,35],[67,27],[80,47]])+[[-36,83],[42,69],[-20,58]].map(([a,y])=>compound(60,y,26,7,a,C.g2,1.3)).join('')+[[44,35],[67,27],[80,47]].map(([x,y])=>daisy(x,y,9,C.white,13)+el(x,y,3.1,4,C.yellow)).join(''),
 41:()=>stem(28)+alternate([86,70,53],23,9)+daisy(60,28,13,'#d6b27e',21),
 42:()=>stem(25)+opposite([87,72,56],20,10,'#9dab9b')+spike(60,23,23,'#b9afcb',3.5),
 43:()=>stem(25)+alternate([88,72,57,43],23,3.5,'#9fac9b')+el(60,31,6,6,C.g2)+Array.from({length:12},(_,i)=>{const a=i*30;return `<path d="M0 0-3-10 0-8 2-14 4-8 5-9 3 0Z" fill="#a4aecb" transform="translate(60 26) rotate(${a})"/>`;}).join(''),
 44:()=>creeping(C.wood)+branches([[38,69],[67,52],[87,77]])+[[36,83,-45],[55,83,40],[64,65,-35],[84,87,50]].map(([x,y,a])=>leaf(x,y,17,12,a)).join('')+petals(67,50,11,C.white,4)+Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2;return line(67,50,67+Math.cos(a)*14,50+Math.sin(a)*12,.5,'#b6a4be');}).join('')+el(39,67,4,5,C.g2),
 45:()=>branches([[43,28],[60,19],[77,30]])+[[43,28],[60,19],[77,30]].map(([x,y])=>line(x,99,x,y)+[75,84,92].map(a=>leaf(x,a,19,2.8,-48,'#a0b09e')+leaf(x,a,19,2.8,48,'#9aaa98')).join('')+spike(x,y,24,'#b5a4c4',3.3)).join(''),
 46:()=>line(60,101,60,29,2.4,C.wood)+alternate([88,74,59,43],25,10,'#8ea286')+[60,76].map(y=>petals(63,y,2.8,'#d9cf9c')).join(''),
 47:()=>line(58,101,59,32,2.2,C.wood)+alternate([88,71,52],22,11,'#8eaa89')+line(59,56,80,39)+petals(80,38,9,C.white,5)+petals(58,29,9,C.white,5),
 48:()=>Array.from({length:9},(_,i)=>blade(60,102,(i-4)*15,47-Math.abs(i-4)*3,9,'#9aafa0')).join('')+line(60,97,60,20,2.3)+spike(60,17,30,'#c4a47c',4),
 49:()=>line(60,101,60,62,2.6,C.wood)+line(60,74,43,49,1.5,C.wood)+line(60,68,79,39,1.5,C.wood)+palmate(43,49,5,.83,C.g2)+palmate(79,39,7,.82,C.g),
 50:()=>stem(27)+compound(60,86,28,6,-48,C.g,3.3)+compound(60,66,27,6,49,C.g2,3.3)+daisy(60,27,12,'#d5ad77',22)+daisy(60,27,7,'#e3c48c',17),
 51:()=>stem(22)+opposite([87,70,54],23,11)+spike(60,20,21,'#dddcc0',2.1)+branches([[41,45],[80,48]])+spike(41,43,12,C.white,1.7)+spike(80,46,12,C.white,1.7),
 52:()=>stem(26)+alternate([87,70,53,39],23,11,'#a2b29a')+[[43,75],[77,60]].map(([x,y])=>line(60,y-12,x,y)+bell(x,y,.55,C.light)+el(x,y+10,3.4,4,'#c7a27a')).join(''),
 53:()=>branches([[42,39],[60,29],[78,39]])+[[42,39],[60,29],[78,39]].map(([x,y])=>[0,10,20,30,40].map(a=>leaf(x,y+a,8,4,-53)+leaf(x,y+a,8,4,53)).join('')+petals(x,y-2,4,'#dfd6df')).join(''),
 54:()=>stem(27)+[[-45,89],[45,69],[-30,49]].map(([a,y])=>fan(60,y,1,C.g,a)).join('')+[50,70,88].map(y=>petals(64,y,3.7,'#d6bed0')).join(''),
 55:()=>`<path d="M58 102 62 61 48 37 51 34 65 54 78 34 81 37 68 65 66 102Z" fill="${C.wood}"/>`+[-1,1].map(side=>line(64,65,64+side*25,56,1.8,C.wood)+line(64+side*16,59,64+side*19,48,1.1,C.wood)+[0,1,2].map(i=>leaf(64+side*(12+i*5),57-i*4,10,4,side*45)).join('')).join('')+`<path d="M64 76q-6 9 0 12q6-2 0-12" fill="#b18c70"/>`,
 56:()=>[-38,-17,15,36].map(a=>leaf(60,101,68,15,a,'#8eaa8a')).join('')+line(60,99,65,57)+Array.from({length:5},(_,i)=>el(65,66-i*5,7-i*.5,4,i>2?'#c6b5c7':C.light)).join('')+el(57,105,12,5,'#d2a476',-13)+el(72,102,8,4,'#dab68a',25),
 57:()=>`<path d="M58 102 55 66 47 42 52 38 62 60 76 38 80 41 66 69 67 102Z" fill="#aa9c82"/>`+compound(56,69,27,4,-52,C.g2,4.5)+compound(65,59,26,4,53,C.g,4.5)+umbel(76,33,7,C.white)+`<path d="M63 79q-6 9 0 12q6-3 0-12" fill="#d6c18c"/>`,
 58:()=>bladeFan(7,76,4.6)+line(60,94,79,59,1.5)+spike(79,52,17,'#b9b48c',2.7),
 59:()=>creeping()+[[30,70],[48,57],[68,67],[87,77]].map(([x,y])=>line(x,99,x,y,1.2)+fan(x,y,0.8,C.g2,0)).join(''),
 60:()=>creeping()+[[33,89],[49,96],[66,92],[84,97]].map(([x,y])=>leaf(x,y,16,10,-62)+leaf(x,y,16,10,62)).join('')+line(63,95,64,63)+petals(64,62,7,C.yellow),
 61:()=>bladeFan(11,75,1.8),
 62:()=>stem(23)+Array.from({length:7},(_,i)=>leaf(60,71,30,10,i*360/7,C.g2)).join('')+Array.from({length:7},(_,i)=>leaf(60,24,14,2,i*360/7,C.g)).join('')+el(60,24,3,5,'#b5aa77'),
 63:()=>stem(21)+leaf(60,99,32,8,-52)+leaf(60,99,29,8,38)+leaf(60,77,20,5,-44)+leaf(60,58,16,4,37)+spike(60,19,20,C.white,3.1)+spike(60,40,16,'#b49b85',2.1),
 64:()=>compound(60,99,35,6,-50,C.g,3.2)+compound(60,99,33,6,45,C.g2,3.2)+branches([[46,39],[69,27],[79,50]])+petals(46,38,6,C.yellow)+petals(69,26,7,C.yellow)+petals(79,49,5,C.yellow),
 65:()=>bladeFan(7,38,4)+line(60,99,57,56,1.7)+leaf(57,79,19,4,-48)+leaf(57,79,19,4,48)+trumpet(57,40,1.15,'#e8e4cb')+line(60,95,77,65)+trumpet(77,56,.83,'#eee8d4'),
 66:()=>stem(31)+[[-48,88],[49,70],[-34,52]].map(([a,y])=>compound(60,y,28,8,a,C.g,1.5)).join('')+umbel(60,31,16,C.white)+umbel(45,36,7,C.white)+umbel(77,35,7,C.white),
 67:()=>stem(28)+opposite([85,67],28,3.8)+leaf(60,51,30,2.6,-43)+line(60,29,77,26)+bell(77,26,.9,'#c8cea5',true)+`<path d="M52 39q-15-19-8-24m15 20q9-13 14-8" fill="none" stroke="${C.g}" stroke-width=".8"/>`+el(58,104,6,7,'#dfd2b2')+el(65,104,5,6,'#d0bf9c'),
 68:()=>[[43,46],[60,34],[77,48]].map(([x,y])=>line(x,102,x,y,2,'#a7a48c')+Array.from({length:6},(_,i)=>leaf(x,y+10+i*8,11,6,i%2?50:-50,'#a0b093')).join('')+Array.from({length:6},(_,i)=>petals(x+(i%3-1)*4,y-Math.floor(i/3)*4,3,'#ba8f8a',4)).join('')).join('')
};
Object.assign(A,{
69:()=>branches([[43,41],[61,26],[79,42]])+[[43,41],[61,26],[79,42]].map(([x,y])=>[18,34,49].map(d=>leaf(x,y+d,11,5,-55)+leaf(x,y+d,11,5,55)).join('')+Array.from({length:5},(_,i)=>petals(x+(i%3-1)*4,y-Math.floor(i/3)*4,3,C.white)).join('')).join(''),
70:()=>stem(30)+[-48,44,-39].map((d,i)=>compound(60,91-i*20,30,8,d,C.g,1.4)).join('')+umbel(60,29,19,C.white)+umbel(42,36,10,C.white)+umbel(80,35,10,C.white),
71:()=>branches([[42,40],[61,25],[80,42]])+opposite([88,73,59],13,5)+[[42,40],[61,25],[80,42]].map(([x,y])=>petals(x,y,8,C.yellow)+Array.from({length:9},(_,i)=>{const t=i*Math.PI*2/9;return line(x,y,x+Math.cos(t)*4,y+Math.sin(t)*4,.5,C.wood);}).join('')).join('')+[58,62].map(x=>el(x,70,1,1,C.light)).join(''),
72:()=>[-62,-27,27,62].map(d=>leaf(60,101,34,10,d,C.g2)).join('')+stem(27)+opposite([67],16,5)+line(60,60,80,43)+daisy(60,26,13,'#dbb76b',18)+daisy(80,42,9,'#d6ad63',16),
73:()=>stem(22)+[89,71,52].map(y=>leaf(60,y,26,11,-53,C.g2)+leaf(60,y,26,11,53,C.g)).join('')+[46,64,80].map(y=>[-12,-6,6,12].map(dx=>petals(60+dx,y,4,C.yellow)).join('')).join(''),
74:()=>bladeFan(7,32,4)+line(60,99,60,48,2)+[0,58,116,174,232,290].map(d=>leaf(60,43,20,5,d,C.white)).join('')+[[55,39],[64,39],[60,47],[51,47],[68,47]].map(([x,y])=>el(x,y,3,4,'#d4c797')).join(''),
75:()=>creeping()+[[35,98],[57,96],[83,97]].map(([x,y],i)=>line(x,y,x,y-20)+lobed(x,y-15,.7,C.g2,i%2?50:-35)).join('')+line(55,96,67,60)+trumpet(67,49,1.1,'#b9a0be')+el(40,103,8,4,'#b49978')+[-40,0,40].map(d=>line(40,100,40+Math.sin(d)*7,92,1,C.wood)).join(''),
76:()=>[[43,102,58],[59,103,74],[76,102,49]].map(([x,y,l])=>'<path d="M'+(x-6)+' '+y+'V'+(y-l+8)+'Q'+x+' '+(y-l-8)+' '+(x+6)+' '+(y-l+8)+'V'+y+'Z" fill="'+C.g2+'"/>'+line(x,y,x,y-l,1,C.g)+Array.from({length:6},(_,i)=>line(x-5,y-i*8,x-8,y-i*8-2,.8,C.wood)+line(x+5,y-i*8,x+8,y-i*8-2,.8,C.wood)).join('')).join('')+petals(73,62,12,'#c7aa98',5,'#a78d7e'),
77:()=>[-66,-44,-22,0,22,44,66].map(d=>leaf(60,102,48-Math.abs(d)*.2,7,d,'#a2b3a0')).join('')+line(60,98,63,30)+branches([[48,39],[78,40]])+[[48,39],[63,29],[78,40]].map(([x,y])=>Array.from({length:6},(_,i)=>el(x+(i%2?3:-3),y+i*3,2,4,'#c7a28b',i%2?20:-20)).join('')).join('')+[[42,83],[48,90],[73,88]].map(([x,y])=>el(x,y,.9,1.5,C.white)).join(''),
78:()=>[-68,-45,-22,0,22,45,68].map(d=>leaf(60,102,54-Math.abs(d)*.15,6,d,C.g)).join('')+branches([[43,30],[62,21],[81,32]])+[[43,30],[62,21],[81,32]].map(([x,y])=>Array.from({length:8},(_,i)=>el(x+(i%2?3:-3),y+i*3,2,4,'#c28e7c',i%2?18:-18)).join('')).join(''),
79:()=>line(60,103,60,40,4,C.wood)+branches([[38,35],[78,30]])+[[41,49],[61,39],[80,45]].map(([x,y])=>leaf(x,y,15,6,0,C.g2)+leaf(x,y,12,5,-55)+leaf(x,y,12,5,55)).join('')+line(48,65,43,58,1,C.wood)+el(64,85,3,5,'#b89774'),
80:()=>line(59,103,59,45,4,C.wood)+branches([[35,39],[77,29]])+compound(40,67,31,4,-30,C.g2,5)+compound(66,58,30,4,28,C.g,5)+el(62,83,3,5,'#c3ad80')+el(78,103,9,5,'#d6be93'),
81:()=>[[40,101,39],[60,103,23],[79,101,43]].map(([x,y,top])=>line(x,y,x,top,2,C.g)+Array.from({length:15},(_,i)=>{const t=i*Math.PI*2/15;return line(x,top,x+Math.cos(t)*18,top+Math.sin(t)*12,.75,C.g2);}).join('')).join(''),
82:()=>[[43,101,37],[61,103,21],[80,102,45]].map(([x,y,top])=>line(x,y,x,top,1.7)+[18,35,49].map((d,i)=>leaf(x,top+d,24,4,i%2?65:-65)).join('')+Array.from({length:8},(_,i)=>line(x,top+13,x+(i%2?1:-1)*(9-i*.6),top+i*2,1.5,'#b5a797')).join('')).join(''),
83:()=>stem(35)+[85,67,50].map(y=>leaf(60,y,18,8,-54,C.g2)+leaf(60,y,18,8,54,C.g)).join('')+Array.from({length:14},(_,i)=>{const t=i*2.4,r=Math.sqrt(i)*2;return petals(60+Math.cos(t)*r,30+Math.sin(t)*r,2.5,'#b9a9c9');}).join(''),
84:()=>'<path d="M24 98Q17 76 43 72Q64 72 62 91L43 84 48 99Q31 106 24 98Z" fill="'+C.g2+'"/>'+el(78,97,21,9,C.g)+line(63,99,63,72)+Array.from({length:16},(_,i)=>leaf(63,74,23,4,i*22.5,'#a6b2cf')).join('')+el(63,73,7,5,C.yellow)
});
Object.assign(A,PROCESSED_ART);A[35]=processedCitrus;
export const BOTANICAL_IDS=[...Object.keys(A).map(Number),...REGIONAL_ART_IDS];
export function botanicalArt(h){const draw=REGIONAL_ART_IDS.includes(h.id)?()=>regionalHerbArt(h.id):A[h.id];if(!draw)throw new Error('Missing botanical illustration '+h.id);return `<svg class="pot" viewBox="0 0 120 120"><g filter="url(#wp)"><g filter="url(#wsoft)">${patch()}${draw()}</g></g></svg>`;}
