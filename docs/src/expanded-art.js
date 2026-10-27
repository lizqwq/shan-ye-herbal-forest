// 作为网页 B 绘制器的扩展，复用相同块面、叶形和柔和配色。
export function expandedArt(h){
 const shape=h.shape||'leaf',id=h.id,green=['#91a38b','#9cad93','#849c83'][id%3],pale='#b9c5a5';
 const leaf=(x,y,deg=0,w=8,l=24)=>`<path d="M0 0Q${w} ${-l/2} 0 ${-l}Q${-w} ${-l/2} 0 0" transform="translate(${x} ${y}) rotate(${deg})" fill="${green}"/>`;
 const stem=(x,y)=>`<path d="M60 105Q${x-5} 70 ${x} ${y}" stroke="${green}" stroke-width="2.4" fill="none"/>`;
 const flower=(x,y,c,r=7)=>`<g fill="${c}">${Array.from({length:shape==='white'||shape==='yellow'?10:5},(_,i)=>`<ellipse cx="${x}" cy="${y-r*.65}" rx="${r*.38}" ry="${r*.68}" transform="rotate(${i*(shape==='white'||shape==='yellow'?36:72)} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="${r*.25}" fill="#d7be83"/></g>`;
 let body='';
 if(['aloe','blade','succulent'].includes(shape)){body=Array.from({length:shape==='aloe'?9:7},(_,i)=>leaf(60,103,(i-4)*15,shape==='blade'?3:9,65-Math.abs(i-4)*5)).join('');}
 else if(shape==='whorl'){body=stem(60,28)+Array.from({length:8},(_,i)=>leaf(60,70,i*45,9,32)).join('')+flower(60,26,'#a1af89',10);}
 else if(shape==='resin'){body='<path d="M57 105 61 42 67 105M61 68 37 46 35 41 64 62 85 36 89 38 66 73" fill="#a49176"/>'+[[-27,-8],[21,-18],[-10,-30]].map(([x,y])=>leaf(61+x,70+y,x,8,18)).join('')+'<path d="M64 75q-12 17 0 20q12-3 0-20" fill="'+(h.n==='乳香'?'#d5c18c':'#b08a6c')+'"/>';}
 else {for(const [i,x] of [35,52,68,85].entries()){const y=25+(i%2)*10;body+=stem(x,y);for(let j=0;j<3;j++){body+=leaf(x+(60-x)*.25,65+j*11,-48,shape==='needle'?3:7,shape==='broad'?40:21)+leaf(x+(60-x)*.3,64+j*11,48,shape==='needle'?3:7,23);}
 if(['white','orange','blue','pink','yellow','blossom','bell','spike','bud','berry'].includes(shape)){const c={white:'#eee9d6',orange:'#d4ac75',blue:'#9daac4',pink:'#c7aaba',yellow:'#ded09a',blossom:'#f0ecdf',bell:'#b6a6c5',spike:'#b6a6c5',bud:pale,berry:'#be8e7d'}[shape];body+=shape==='spike'?Array.from({length:5},(_,j)=>flower(x,y+j*5,c,4)).join(''):flower(x,y,c,shape==='orange'?11:7);}}}
 return `<svg class="pot" viewBox="0 0 120 120"><g filter="url(#wp)">${body}<ellipse cx="60" cy="107" rx="21" ry="2" fill="${pale}" opacity=".7"/></g></svg>`;
}
