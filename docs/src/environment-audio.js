// 用 Web Audio 合成不同生境的风、水与动物声，不加载外部录音，也不占用摄像头。
export const SOUNDSCAPES={
forest:{label:'林叶鸟鸣',wind:.024,rustle:.023,bird:'forest',birdChance:.65},
pine:{label:'松风山鸟',wind:.042,rustle:.011,bird:'forest',birdChance:.35},
oldgrove:{label:'古栎林声',wind:.016,rustle:.021,bird:'forest',birdChance:.45},
creek:{label:'溪水林鸟',wind:.012,water:.065,waterHz:850,bird:'forest',birdChance:.45},
bamboo:{label:'竹风涧水',wind:.022,rustle:.028,water:.075,waterHz:1300,bird:'forest',birdChance:.3},
shaded:{label:'苔溪轻流',wind:.009,water:.05,waterHz:620,bird:'forest',birdChance:.25,frog:true},
meadow:{label:'草甸风声',wind:.038,rustle:.008,bird:'mountain',birdChance:.18},
scree:{label:'岩坡山风',wind:.052,rustle:.003,bird:'mountain',birdChance:.1},
juniper:{label:'圆柏风声',wind:.046,rustle:.016,bird:'mountain',birdChance:.18},
alpine:{label:'冰湖山风',wind:.045,water:.016,waterHz:420,bird:'mountain',birdChance:.1},
fjord:{label:'峡湾潮声',wind:.03,surf:.05,surfRate:.065,bird:'coast',birdChance:.18},
aegean:{label:'海浪轻拍',wind:.022,surf:.085,surfRate:.12,bird:'coast',birdChance:.23},
sahara:{label:'沙谷风声',wind:.055,rustle:.003,birdChance:0},
rift:{label:'旷野草风',wind:.038,rustle:.019,bird:'savanna',birdChance:.22},
delta:{label:'湿地水鸣',wind:.012,water:.055,waterHz:500,rustle:.017,bird:'wetland',birdChance:.35,frog:true}
};
const ZONE_SOUNDS=[['forest','pine','oldgrove'],['creek','bamboo','shaded'],['meadow','scree','juniper'],['alpine','fjord','aegean'],['sahara','rift','delta']];
export const soundscapeKey=(zone,phase=0)=>ZONE_SOUNDS[zone]?.[phase]||'forest';
export const soundscapeFor=(zone,phase=0)=>SOUNDSCAPES[soundscapeKey(zone,phase)];
export class EnvironmentAudio{
 constructor(Context=globalThis.AudioContext||globalThis.webkitAudioContext){this.context=new Context();this.enabled=false;this.retiring=new Set();this.timeouts=new Set();this.buffers={};this.timer=setInterval(()=>this.wildlife(),3700);}
 noise(brown=false){const key=brown?'brown':'white';if(this.buffers[key])return this.buffers[key];const ctx=this.context,buffer=ctx.createBuffer(1,ctx.sampleRate*6,ctx.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){const white=Math.random()*2-1;last=(last+white*.02)/1.02;data[i]=brown?last*4:white*.35;}return this.buffers[key]=buffer;}
 layer(mix,{gain,hz,type='lowpass',brown=false,pulse=0}){if(!gain)return;const ctx=this.context,source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),level=ctx.createGain();source.buffer=this.noise(brown);source.loop=true;filter.type=type;filter.frequency.value=hz;filter.Q.value=.45;level.gain.value=gain;source.connect(filter).connect(level).connect(mix.output);source.start();mix.nodes.push(source,filter,level);if(pulse){const lfo=ctx.createOscillator(),amount=ctx.createGain();lfo.frequency.value=pulse;amount.gain.value=gain*.65;lfo.connect(amount).connect(level.gain);lfo.start();mix.nodes.push(lfo,amount);}}
 setScene(zone,phase){const key=soundscapeKey(zone,phase);if(this.key===key)return;this.key=key;this.profile=SOUNDSCAPES[key];const ctx=this.context,p=this.profile,now=ctx.currentTime,output=ctx.createGain(),mix={output,nodes:[]};output.gain.setValueAtTime(0,now);output.gain.linearRampToValueAtTime(.7,now+1.8);output.connect(ctx.destination);this.layer(mix,{gain:p.wind,hz:430,brown:true,pulse:.075});this.layer(mix,{gain:p.rustle,hz:2100,type:'bandpass',pulse:.17});this.layer(mix,{gain:p.water,hz:p.waterHz||800,type:'bandpass',pulse:.9});this.layer(mix,{gain:p.surf,hz:650,type:'lowpass',pulse:p.surfRate});if(p.surf)this.layer(mix,{gain:p.surf*.16,hz:2900,type:'bandpass',pulse:p.surfRate});const old=this.mix;this.mix=mix;if(old){old.output.gain.cancelScheduledValues(now);old.output.gain.setValueAtTime(old.output.gain.value,now);old.output.gain.linearRampToValueAtTime(0,now+1.8);this.retiring.add(old);const timer=setTimeout(()=>{this.destroy(old);this.retiring.delete(old);this.timeouts.delete(timer);},2200);this.timeouts.add(timer);}}
 chirp(kind){const ctx=this.context,now=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();const presets={forest:[2200,3000,1600,.22,.012],mountain:[1300,1750,1100,.34,.009],coast:[660,1000,560,.7,.011],savanna:[950,1400,820,.18,.009],wetland:[1200,1800,900,.28,.011],frog:[280,370,260,.18,.009]};const[a,b,c,d,v]=presets[kind]||presets.forest;osc.type='sine';osc.frequency.setValueAtTime(a,now);osc.frequency.exponentialRampToValueAtTime(b,now+d*.35);osc.frequency.exponentialRampToValueAtTime(c,now+d);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(v,now+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+d);osc.connect(gain).connect(this.mix.output);osc.start(now);osc.stop(now+d+.04);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
 wildlife(){if(!this.enabled||globalThis.document?.hidden||!this.profile||!this.mix)return;const p=this.profile;if(p.bird&&Math.random()<(p.birdChance||0))this.chirp(p.bird);if(p.frog&&Math.random()<.22)this.chirp('frog');}
 async resume(){this.enabled=true;await this.context.resume();}
 async suspend(){this.enabled=false;await this.context.suspend();}
 destroy(mix){for(const node of mix.nodes){try{node.stop?.();}catch{}node.disconnect();}mix.output.disconnect();}
 async close(){clearInterval(this.timer);for(const t of this.timeouts)clearTimeout(t);for(const m of this.retiring)this.destroy(m);if(this.mix)this.destroy(this.mix);this.enabled=false;await this.context.close();}
}
