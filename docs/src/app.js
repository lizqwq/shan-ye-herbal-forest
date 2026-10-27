import {collectionTotals} from './collection-progress.js';
import {worldRegionMap} from './world-region.js';
import {RESEARCH_HTML} from './research-content.js';
import {FistNavigation} from './fist-navigation.js';
import {AccountProgress} from './account-progress.js';
import {ExplorationRoute} from './exploration.js';
import {WorkshopCameraBridge} from './workshop-camera.js';
import {EnvironmentAudio,soundscapeFor} from './environment-audio.js';
import {bagSpeciesCount,canStoreSpecies,mergeExpedition} from './expedition-bag.js';
import {STUDY_SCENES} from './regional-study.js';
import {floraFor} from './habitat-flora.js';
import {HABITAT_SCENES,wildlifeFor} from './habitats.js';
import {createApp,ref,computed,onMounted,onBeforeUnmount,h,nextTick,watch} from '../vendor/vue.js';
import {Forest} from './forest.js';
import {HandCamera} from './camera.js';
import {GestureController,drawHand,drawHands,classifyHand} from './gestures.js';
import {HERBS,herbImage} from './herbs.js';
import {PageGestures,StrafeGesture,DirectionalScroll} from './page-gestures.js';
import {DualGestures,MapHandGestures} from './dual-gestures.js';
import {InteractionHand} from './interaction-hand.js';
import {MAPS,RARITY_GROUPS,wheelSlots,wrapMap} from './maps.js';
import {TutorialConfirmation} from './onboarding.js';
import {HandCountRunning} from './presence-speed.js';
import {MapWheelGesture} from './map-interaction.js';
import {CODEX_FILTERS,codexArt} from './02-草药绘制器.js';
import {CATEGORIES,HERB_CODEX_IDS,readProfile,profileRecords,saveProfile,addToProfile,removeFromProfile,renderStat,renderTabs,renderDex} from './03-渲染与交互.js';

const iconPaths={
  leaf:'M20 4C10 2 3 7 5 14c2 7 12 7 15-10ZM5 20 15 10M9 16l-1-5m5 1 5-1',
  arrow:'M5 12h14m-6-6 6 6-6 6',
  sound:'M4 9h4l5-4v14l-5-4H4Zm13-1c3 2 3 6 0 8m3-11c5 4 5 10 0 14',
  mute:'M4 9h4l5-4v14l-5-4H4Zm13 0 5 6m0-6-5 6',
  expand:'M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5',
  bag:'M8 7V5a4 4 0 0 1 8 0v2M5 7h14l2 14H3Zm3 5v2m8-2v2M9 17h6',
  camera:'M8 6 10 3h4l2 3h4v14H4V6Zm8 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  hand:'M7 12V5a1.5 1.5 0 0 1 3 0v6-8a1.5 1.5 0 0 1 3 0v8-7a1.5 1.5 0 0 1 3 0v8-5a1.5 1.5 0 0 1 3 0v9c0 8-10 9-13 4L2 14c-1-2 1-4 3-2l2 2',
  point:'M9 12V3a2 2 0 0 1 4 0v8l3-1 5 3v4c0 7-10 8-13 4l-5-6c-1-2 1-4 3-2l3 2',
  fist:'M5 12V8c0-3 4-3 4 0V6c0-3 4-3 4 0v1c0-3 4-3 4 0v2c0-3 4-3 4 0v8c0 6-13 7-15 1l-3-5c-1-2 1-4 3-2l4 3',
  close:'m6 6 12 12M6 18 18 6',
  check:'m5 12 4 4L19 6',
  info:'M12 11v6m0-10v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  keyboard:'M3 5h18v14H3Zm3 4h.1m3 0h.1m3 0h.1m3 0h.1m3 0h.1M6 12h.1m3 0h.1m3 0h.1m3 0h.1m3 0h.1M7 16h10',
  sun:'M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
  reset:'M3 10a9 9 0 1 1 2 8M3 4v6h6'
};
const Icon={props:['name'],setup:props=>()=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':1.35,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'},[h('path',{d:iconPaths[props.name]||iconPaths.leaf})])};

createApp({
  components:{Icon},
  setup() {
    const studyKey=new URLSearchParams(location.search).get('artStudy');
    const artStudy=STUDY_SCENES[studyKey]?studyKey:false;
    const studyTitle=STUDY_SCENES[studyKey]?.title||'阿尔卑斯 · 冰湖缓行';
    const sceneEl=ref(null),handCanvas=ref(null),video=ref(null),workshopFrame=ref(null),worldFrame=ref(null);
    const worldCamera=new WorkshopCameraBridge(()=>worldFrame.value,()=>video.value,'herbalWorldHost',()=>({tutorialComplete:!!achievements.value.worldTutorial,world:worldProgress.value}));
    const navArming=ref(false),navProgress=ref(0);
    const globalNavigation=new FistNavigation(direction=>{if(movementGuide.value&&tutorialStep.value===0)advanceTutorial();else navigatePage(direction);});
    const workshopCamera=new WorkshopCameraBridge(()=>workshopFrame.value,()=>video.value);
    function onWorkshopReady(event){if(event.origin!==location.origin)return;if(event.source===worldFrame.value?.contentWindow&&event.data?.type==='herbal-world-selected'&&activePage.value==='world')enterWorldRegion(event.data.boardId);if(event.source===workshopFrame.value?.contentWindow&&event.data?.type==='herbal-workshop-ready')workshopCamera.connect();if(event.source===worldFrame.value?.contentWindow&&event.data?.type==='herbal-world-ready')worldCamera.connect();if(event.source===worldFrame.value?.contentWindow&&event.data?.type==='herbal-camera-request')connectCamera();if(event.source===worldFrame.value?.contentWindow&&event.data?.type==='herbal-world-progress'){achievements.value.worldTutorial=true;accountStore?.save();}if(event.source===workshopFrame.value?.contentWindow&&event.data?.type==='herbal-progress'){achievements.value.workshop=event.data.progress;accountStore?.save();}}
    function onWorkshopLoad(){workshopCamera.connect();}
    function onWorldLoad(){worldCamera.connect();}
    const activePage=ref(artStudy?'forest':'about'),profileScroll=ref(null),aboutScroll=ref(null),workshopActive=ref(false);
    const pages=['about','forest','potion','world','profile'];
    function updateWorkshop(page){workshopCamera.reset();worldCamera.reset();workshopActive.value=page==='potion';}
    const region=ref('全部地区'),handCardHover=ref(null),handOverStart=ref(false);
    const category=ref('全部'),search=ref(''),record=ref(null),additions=ref({});
    const inventoryOpen=ref(false),inventoryHeld=ref(null),inventoryView=ref(null),handCount=ref(0);
    const hoveredExploreMode=ref(null),exploreChoices=[{key:'fixed',label:'固定地图探索',description:'留在当前大地图 · 小地图随机轮换',length:'每段 300—600 米'},{key:'random',label:'随机探索',description:'走完全部小地图 · 随机前往下一张大地图',length:'每段 200—350 米'}];
    const explorationMode=ref('random'),submapId=ref(0),submapImages=ref([]);const submaps=computed(()=>HABITAT_SCENES[mapIndex.value]);
    const mapMode=ref(''),mapIndex=ref(0),mapPoint=ref(0),mapZoom=ref(1),mapBounce=ref(false);
    const selectedMap=computed(()=>MAPS[mapIndex.value]),selectedPoint=computed(()=>selectedMap.value.nodes[mapPoint.value]);
    const activeMapIndex=ref(0),confirmedMapIndex=ref(0),previewEl=ref(null),wheelDirection=ref(1);
    const wheelIndex=ref(0),wheelOffset=ref(0),wheelDragging=ref(false),hoveredDigit=ref(null),grabbedDigit=ref(null);
    const slots=computed(()=>wheelSlots(wheelIndex.value));
    const currentRegion=computed(()=>artStudy?studyTitle:MAPS[activeMapIndex.value].name+' · '+HABITAT_SCENES[activeMapIndex.value][submapId.value].name);
    const sessionBagCounts=ref({}),collectedCounts=ref({});
    const bagSpecies=computed(()=>bagSpeciesCount(sessionBagCounts.value));
    const animalInfo=ref(null);
    const bagRecords=computed(()=>profileRecords({}).map(h=>({...h,own:sessionBagCounts.value[h.id]||0})).filter(h=>h.own>0));
    const displayRecords=computed(()=>inventoryOpen.value?bagRecords.value:records.value);
    const records=computed(()=>profileRecords(additions.value).map(h=>({...h,collected:collectedCounts.value[h.id]||0})));
    const filteredRecords=computed(()=>renderDex(displayRecords.value,{category:category.value,search:search.value}).filter(h=>region.value==='全部地区'||h.regions.includes(region.value)));
    const profileStats=computed(()=>renderStat(inventoryOpen.value?bagRecords.value:profileRecords(collectedCounts.value)));
    const A_IMAGES={1:'zihuadiding',2:'pugongying',3:'machixian',4:'cheqiancao',9:'aicao',16:'jiegeng',37:'shenjincao'};
    const recordArt=h=>`<img src="${herbImage(HERBS.find(v=>v.codexId===h.id))}" alt="" loading="lazy">`;
    const immersed=ref(false),modal=ref(null),sound=ref(false),bag=ref(0),flash=ref(false);
    const cameraStatus=ref('requesting'),cameraMessage=ref('正在连接摄像头'),handPresent=ref(false),gesture=ref('等待手部入镜');
    const tutorialStep=ref(0);
    const tutorialSteps=[
      {art:'navigation',title:'握拳横扫，翻开下一页。',text:'仅在屏幕上方8%—32%的导航操作区。单手握拳后连续向左或向右横扫约三分之一屏幕，无需在两端停稳；左到右进入右页，右到左进入左页。五个页面互通，持物、采集与弹窗操作时不切页。'},
      {art:'scroll',title:'指向上下，慢慢翻阅。',text:'在可滚动的页面或中央面板中，食指向上指向上滚、向下指向下滚，保持至少0.25秒。收回或横指即停；静态页面不会滚动，滚动和横扫互斥。'},
      {art:'move',title:'让脚步，跟随双手。',text:'单手微微虚握向前伸出，步行2米/秒；双手同时虚握前伸，平滑加速至4米/秒。松开一手，经过防抖延时平滑回到步行。'},
      {art:'grab',title:'摊掌停步，再握拳相逢。',text:'手掌完全张开，立即停止前进。手心进入植物判定范围后，植株放大高亮并保持；再握拳完成采集。抓取优先，一只手抓取时另一只手可以保持张开。'},
      {art:'bag',title:'把相遇，收进行囊。',text:'双手张掌合拢，再向两侧张开，打开背包；双掌从两侧向中间合拢关闭。握住药材向下轻移即可存入。切换主页面或进入下一个大地图时，背包自动存入个人仓库。'},
      {art:'map',title:'下一程，交给双拳。',text:'双拳合拢后向两侧分开，打开地图；双拳从两侧向中间合拢关闭。张掌后握拳拖动数字，松手停靠；右上圆窗固定探索，右下圆窗随机探索。食指上下指向可翻阅地图详情。'}
    ];
    const currentTutorial=computed(()=>tutorialSteps[tutorialStep.value]);
    const movementGuide=ref(false),travelSpeed=ref(0);let movementGuideSeen=false;
    const tutorialState=ref({complete:false,step:0}),accountUser=ref(null),accountMessage=ref('游客 · 本机保存'),accountMode=ref('login'),accountName=ref(''),accountPassword=ref(''),accountBusy=ref(false),accountError=ref(''),achievements=ref({}),worldProgress=ref(null);
    let accountStore,progressTimer,accountReady=false;
    try{const guest=JSON.parse(localStorage.getItem('shan-ye-guest-v1')||'null');if(guest?.tutorial)tutorialState.value=guest.tutorial;else if(localStorage.getItem('shan-ye-movement-guide-v3')||localStorage.getItem('shan-ye-movement-guide-v5'))tutorialState.value.complete=true;}catch{}
    function progressSnapshot(){const route=forest?.route;const world=worldFrame.value?.contentWindow?.getEarthStatus?.();if(world)worldProgress.value=world;return {version:1,profile:{...additions.value},bag:{...sessionBagCounts.value},collection:{...collectedCounts.value},tutorial:{...tutorialState.value},achievements:achievements.value,exploration:forest?{distance:forest.distance,stageStart:forest.stageStart,map:forest.biomeId,submap:forest.submapId,route:route?{mode:route.mode,map:route.map,round:route.round,remaining:[...route.remaining],visited:route.visited,submap:route.submap,length:route.length,progress:route.progress}:null}:null,world:worldProgress.value};}
    function applyProgress(saved){additions.value=saved.profile||{};sessionBagCounts.value=saved.bag||{};collectedCounts.value=collectionTotals(additions.value,sessionBagCounts.value,saved.collection);bag.value=Object.values(sessionBagCounts.value).reduce((a,b)=>a+b,0);tutorialState.value={complete:!!saved.tutorial?.complete,step:Math.min(tutorialSteps.length-1,saved.tutorial?.step||0)};achievements.value=saved.achievements||{};worldProgress.value=saved.world||null;worldCamera.reset();saveProfile(localStorage,additions.value);const e=saved.exploration;if(forest&&e&&Number.isFinite(e.distance)&&e.distance>=0&&e.distance<1e8&&Number.isInteger(e.map)&&e.map>=0&&e.map<5&&Number.isInteger(e.submap)&&e.submap>=0&&e.submap<3){const route=new ExplorationRoute(e.map,e.route?.mode);if(e.route&&Array.isArray(e.route.remaining)&&e.route.remaining.every(n=>Number.isInteger(n)&&n>=0&&n<3)){route.mode=e.route.mode==='fixed'?'fixed':'random';route.remaining=[...new Set(e.route.remaining)];route.round=Math.max(1,Math.floor(Number(e.route.round)||1));route.visited=Math.max(1,Math.min(3,Number(e.route.visited)||1));route.map=e.map;route.submap=e.submap;route.length=Math.max(200,Math.min(600,Number(e.route.length)||300));route.progress=0;}const progressed=Math.max(0,Math.min(route.length-1,e.route?.progress||0));forest.travelTo(e.distance-progressed,MAPS[e.map],{route,submap:e.submap,length:route.length});forest.speed=2;if(progressed)forest.advance(progressed/2);activeMapIndex.value=e.map;mapIndex.value=e.map;submapId.value=e.submap;} }
    async function submitAccount(){if(accountBusy.value)return;if(held.value||forest?.picking){accountError.value='请先将药材收入背包或放回';return;}accountBusy.value=true;accountError.value='';try{await accountStore.authenticate(accountMode.value,accountName.value,accountPassword.value);accountPassword.value='';closeModal();notify(accountMessage.value);}catch(error){accountError.value=error.message;}finally{accountBusy.value=false;}}
    async function logoutAccount(){accountBusy.value=true;try{await accountStore.logout();notify('已返回游客身份');}catch(error){accountError.value=error.message;}finally{accountBusy.value=false;}}
    watch([additions,sessionBagCounts,collectedCounts,tutorialState,achievements],()=>{if(accountReady)accountStore?.save();},{deep:true});
    function openTutorial(){setMove(false);tutorialStep.value=0;tutorialConfirmation.reset();globalNavigation.reset();modal.value=null;movementGuide.value=true;}
    function scrollTarget(){return modal.value?document.querySelector('.dialog'):mapMode.value?document.querySelector('.map-panel'):inventoryOpen.value||activePage.value==='profile'?profileScroll.value:activePage.value==='about'?aboutScroll.value:null;}
    function canGestureScroll(){const el=scrollTarget();return !!el&&el.scrollHeight>el.clientHeight+2;}
    function scrollToAbout(){aboutScroll.value?.querySelector('.declaration-copy')?.scrollIntoView({behavior:'smooth',block:'start'});}

    const runGesture=new HandCountRunning();
    const interactionHand=new InteractionHand();
    const tutorialConfirmation=new TutorialConfirmation(()=>advanceTutorial());
    const moving=ref(false),distance=ref(0),nearest=ref(null),held=ref(null),holdingExit=ref(false),keyboard=ref(false),ready=ref(false);
    const handCenter=ref({x:0.5,y:0.55}),toast=ref(''),ended=ref(false),worldError=ref('');
    let previewForest,mapWheel,wheelAnimation=0,wheelLastTime=0,dragX=null,previewGeneration=0;
    let forest,camera,controller,archiveController,inventoryController,pageController,dualController,mapController,strafeController,fingerScroll,lastUpdate=0,lastHand=0,points=null,toastTimer,exitTimer,flashTimer,bounceTimer,activeSingleId=null,lastSingleCenter=null,scrollAnimation=0,scrollState=null;
    let audio,previousFocus,watchdog,keyWalking=false,unloaded=false;
    const statusText=computed(()=>cameraStatus.value==='ready'?(handPresent.value?'已识别手部 · '+gesture.value:'伸出手，与山林打个招呼'):cameraMessage.value);
    const holdStyle=computed(()=>({ '--hand-x':`${(handCenter.value.x-.5)*110}px`, '--hand-y':`${(handCenter.value.y-.5)*75}px` }));
    const targetStyle=computed(()=>nearest.value?{left:`${nearest.value.x*100}%`,top:`${nearest.value.y*100}%`}:{});
    const notify=message=>{toast.value=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.value='',3200);};
    function showMovementGuide(){if(artStudy||movementGuideSeen||tutorialState.value.complete)return;movementGuideSeen=true;tutorialStep.value=tutorialState.value.step||0;movementGuide.value=true;tutorialConfirmation.reset();setMove(false);}
    function advanceTutorial(){if(tutorialStep.value<tutorialSteps.length-1){tutorialStep.value++;if(!tutorialState.value.complete)tutorialState.value.step=tutorialStep.value;tutorialConfirmation.reset();globalNavigation.reset();}else dismissMovementGuide();}
    function dismissMovementGuide(){movementGuide.value=false;tutorialState.value={complete:true,step:0};accountStore?.save();controller?.reset();dualController?.reset();runGesture.reset();globalNavigation.reset();}
    watch(immersed,value=>{if(value&&activePage.value==='forest')showMovementGuide();});
    function enter(){if(!ready.value){notify(worldError.value||'森林正在载入，请稍候');return;}switchPage('forest');immersed.value=true;}
    function switchPage(page){
      if(mapMode.value)closeMap();
      if(!pages.includes(page))return;if(page==='profile'){category.value='全部';search.value='';region.value='全部地区';}
      if(held.value||forest?.picking){notify('请先将草药存入或放回，再切换页面');return;}
      if(page!==activePage.value){if(!depositBag())return;closeInventory();}
      keyWalking=false;setMove(false);controller?.reset();pageController?.reset();strafeController?.reset();fingerScroll?.reset();mapMode.value='';cancelAnimationFrame(scrollAnimation);scrollState=null;
      const previous=activePage.value;
      record.value=null;modal.value=null;activePage.value=page;
      if(previous!==page){void updateWorkshop(page,previous);accountStore?.save();void accountStore?.flush();}
      if(forest)forest.suspended=page!=='forest'||inventoryOpen.value;
      if(handCanvas.value)drawHand(handCanvas.value,null);
    }
    function depositBag(){
      if(!bag.value)return true;
      const next=mergeExpedition(additions.value,sessionBagCounts.value);
      let storage;try{storage=window.localStorage;}catch{}
      if(!storage||!saveProfile(storage,next)){notify('仓库保存失败，请保留当前背包后重试');return false;}
      additions.value=next;sessionBagCounts.value={};bag.value=0;if(accountReady)accountStore?.save();notify('本次背包已存入仓库，个人档案已更新');return true;
    }
    function navigatePage(direction){const index=pages.indexOf(activePage.value),next=(index+direction+pages.length)%pages.length;switchPage(pages[next]);if(pages[next]==='forest'){immersed.value=true;showMovementGuide();}}
    function scrollPage(delta){
      const el=scrollTarget();
      if(!el||el.scrollHeight<=el.clientHeight)return;const now=performance.now();if(!scrollState||scrollState.el!==el||now-scrollState.updated>180)scrollState={el,target:el.scrollTop,updated:now};
      scrollState.target=Math.max(0,Math.min(el.scrollHeight-el.clientHeight,scrollState.target+delta*el.clientHeight*2.8));scrollState.updated=now;
      if(!scrollAnimation){const animate=()=>{const s=scrollState;if(!s){scrollAnimation=0;return;}const gap=s.target-s.el.scrollTop;s.el.scrollTop+=gap*.27;if(Math.abs(gap)>.6)scrollAnimation=requestAnimationFrame(animate);else{scrollAnimation=0;s.el.scrollTop=s.target;}};scrollAnimation=requestAnimationFrame(animate);}
    }
    function openInventory(){
      if(held.value||forest?.picking)return notify('请先存入或放回手中的草药');
      category.value='全部';search.value='';region.value='全部地区';setMove(false);controller?.reset();pageController?.reset();strafeController?.reset();mapMode.value='';modal.value=null;
      inventoryView.value={stats:renderStat(bagRecords.value),tabs:renderTabs(bagRecords.value),dex:renderDex(bagRecords.value,{category:category.value,search:search.value})};
      inventoryOpen.value=true;inventoryController?.reset();if(forest)forest.suspended=true;
    }
    function closeInventory(){inventoryOpen.value=false;inventoryHeld.value=null;inventoryController?.reset();controller?.reset();if(forest)forest.suspended=activePage.value!=='forest';}
    function archiveGrab(center){if(activePage.value!=='profile'||inventoryOpen.value||modal.value||!handCardHover.value)return;const item=records.value.find(h=>h.id===handCardHover.value);if(item)showRecord(item);}
    function updateCardHover(center){handCardHover.value=null;if(modal.value||mapMode.value||inventoryHeld.value||!(inventoryOpen.value||activePage.value==='profile'))return;for(const el of document.querySelectorAll('.codex-card')){const r=el.getBoundingClientRect(),x=center.x*innerWidth,y=center.y*innerHeight;if(r.width&&r.height&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom){handCardHover.value=Number(el.dataset.herbId);break;}}}
    function inventoryGrab(center){
      if(!inventoryOpen.value||inventoryHeld.value)return;
      const x=center.x*innerWidth,y=center.y*innerHeight,viewport=profileScroll.value.getBoundingClientRect();if(y<viewport.top||y>viewport.bottom)return;
      for(const el of profileScroll.value.querySelectorAll('.codex-card')){const r=el.getBoundingClientRect();if(x<r.left-16||x>r.right+16||y<r.top-16||y>r.bottom+16)continue;const item=bagRecords.value.find(h=>h.id===Number(el.dataset.herbId));if(!item?.own)return notify('这株草药还未收录');inventoryHeld.value=item;notify('已拿起一株'+item.n+'，张掌即可丢弃');return;}
    }
    function inventoryDrop(){
      if(!inventoryHeld.value)return;const item=inventoryHeld.value;
      if(sessionBagCounts.value[item.id]>0){sessionBagCounts.value[item.id]--;bag.value--;notify('已从本次背包丢弃一株'+item.n);}inventoryHeld.value=null;
    }
    function takeInventoryRecord(item){if(!inventoryOpen.value||!item?.own)return;closeModal();inventoryHeld.value=item;inventoryController?.reset();notify('已拿起一株'+item.n+'，张掌或点击放回按钮可丢弃');}
    function openMap(mode='mini'){
      if(inventoryOpen.value||held.value||forest?.picking)return;
      setMove(false);controller?.reset();pageController?.reset();strafeController?.reset();modal.value=null;mapMode.value=mode;
      mapIndex.value=confirmedMapIndex.value;wheelIndex.value=mapIndex.value;mapPoint.value=0;mapZoom.value=1;mapWheel?.reset();if(forest)forest.suspended=true;nextTick(updatePreview);startWheelAnimation();
      if(mode==='picker'){mapBounce.value=true;clearTimeout(bounceTimer);bounceTimer=setTimeout(()=>mapBounce.value=false,650);}
    }
    function closeMap(){mapMode.value='';previewGeneration++;previewForest?.dispose();previewForest=null;cancelAnimationFrame(wheelAnimation);wheelAnimation=0;mapWheel?.reset();controller?.reset();if(forest)forest.suspended=activePage.value!=='forest'||inventoryOpen.value;}
    function shiftWheel(direction){wheelDirection.value=Math.sign(direction);wheelIndex.value=wrapMap(wheelIndex.value+direction);}
    function turnMap(direction){mapWheel?.reset();shiftWheel(direction);mapIndex.value=wheelIndex.value;confirmedMapIndex.value=mapIndex.value;}
    function confirmMap(){confirmedMapIndex.value=mapIndex.value;notify('已选择 · '+selectedMap.value.name+'，在右侧圆窗选择探索方式');}
    function enterWorldRegion(boardId){const index=worldRegionMap(boardId);if(index===null||held.value||forest?.picking)return;const previous=mapIndex.value;mapIndex.value=index;if(!travelToPoint(explorationMode.value)){mapIndex.value=previous;return;}wheelIndex.value=index;showMovementGuide();accountStore?.save();}
    function travelToPoint(mode){if(mode==='fixed'||mode==='random')explorationMode.value=mode;if(!forest||held.value||forest.picking)return;const theme=selectedMap.value;if(theme.index!==activeMapIndex.value&&!depositBag())return;closeMap();switchPage('forest');if(activePage.value!=='forest')return false;forest.startExploration(theme,explorationMode.value);activeMapIndex.value=theme.index;confirmedMapIndex.value=theme.index;distance.value=0;nearest.value=null;immersed.value=true;notify((explorationMode.value==='fixed'?'固定大地图 · ':'随机串联 · ')+HABITAT_SCENES[theme.index][forest.submapId].name);return true;}
    async function updatePreview(){
      // 已生成的本地展示图固定不变；滚轮浏览不创建随机场景或额外 WebGL 上下文。
      const generation=++previewGeneration,index=mapIndex.value;
      if(new URLSearchParams(location.search).has('capturePreviews')){
        submapImages.value=[];await nextTick();const host=previewEl.value;if(!host)return;
        previewForest??=new Forest(host,{preview:true,onUpdate:()=>{},onCollect:()=>{},onError:()=>{}});const preview=previewForest;await preview.assetsReady;
        if(generation!==previewGeneration||preview.disposed)return;
        const images=[];for(let i=0;i<3;i++){preview.travelTo(0,MAPS[index],{submap:i,length:300});images.push(preview.capturePreview());}submapImages.value=images;return;
      }
      submapImages.value=HABITAT_SCENES[mapIndex.value].map((_,i)=>'./previews/'+mapIndex.value+'-'+i+'.jpg');
      nextTick(()=>document.querySelector('.map-panel')?.scrollTo({top:0}));
    }
    watch(mapIndex,()=>{if(mapMode.value)updatePreview();});
    function startWheelAnimation(){cancelAnimationFrame(wheelAnimation);wheelLastTime=performance.now();const tick=now=>{if(!mapMode.value)return;mapWheel?.tick(Math.min(.06,(now-wheelLastTime)/1000));wheelLastTime=now;wheelAnimation=requestAnimationFrame(tick);};wheelAnimation=requestAnimationFrame(tick);}
    function wheelPointerDown(event){if(event.target.closest('.wheel-arrow'))return;hoveredDigit.value=Number(event.target.closest('.wheel-slot')?.dataset.number)||null;if(!hoveredDigit.value)return;dragX=event.clientX;mapWheel.grab({x:event.clientX/innerWidth},performance.now(),hoveredDigit.value);}
    function wheelPointerMove(event){if(dragX===null)return;if(Math.abs(event.clientX-dragX)>4)event.currentTarget.setPointerCapture(event.pointerId);mapWheel.drag({x:event.clientX/innerWidth},performance.now());}
    function wheelPointerUp(){dragX=null;mapWheel.release(true);}
    function hitElement(selector,center){const el=document.querySelector(selector);if(!el)return false;const r=el.getBoundingClientRect(),x=center.x*innerWidth,y=center.y*innerHeight;return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;}
    function processMapHand(hand,center,now){hoveredExploreMode.value=mapMode.value?exploreChoices.find(c=>hitElement('.explore-orb[data-mode="'+c.key+'"]',center))?.key??null:null;handOverStart.value=!!hoveredExploreMode.value;hoveredDigit.value=null;if(mapMode.value)for(const el of document.querySelectorAll('.wheel-slot')){const bounds=el.getBoundingClientRect(),r={left:bounds.left+bounds.width*.12,right:bounds.right-bounds.width*.12,top:bounds.top,bottom:bounds.bottom},x=center.x*innerWidth,y=center.y*innerHeight;if(x>=r.left-12&&x<=r.right+12&&y>=r.top-12&&y<=r.bottom+12){hoveredDigit.value=Number(el.dataset.number);break;}}const tip=points?.[8],pointer=tip?{x:1-tip.x,y:tip.y}:center;mapWheel.process(hand,center,{pointer,overWheel:!!hoveredDigit.value,number:hoveredDigit.value,overNumber:false,overStart:mapMode.value?hoveredExploreMode.value:false},now);}

    function showRecord(h){previousFocus=document.activeElement;record.value=h;modal.value='record';setMove(false);requestAnimationFrame(()=>document.querySelector('.dialog-close')?.focus());}
    function goCollect(h){
      closeModal();enter();
      const mapped=Object.values(HERB_CODEX_IDS).includes(h.id);
      if(!mapped)notify('当前开放森林秘境，其他生境将在后续开放');
    }
    function setMove(value){
      if(!forest)return;
      const canMove=value&&!movementGuide.value&&activePage.value==='forest'&&!inventoryOpen.value&&!mapMode.value&&!held.value&&!holdingExit.value&&!modal.value&&!document.hidden;
      if(canMove)immersed.value=true;
      forest.moving=canMove;if(!canMove)forest.setRunning(false);
    }
    function grab(center){
      if(!forest||activePage.value!=='forest'||inventoryOpen.value||mapMode.value||held.value||holdingExit.value||modal.value)return false;
      immersed.value=true;
      const result=forest.pick(center);
      if(!result)notify('靠近草药，将手心对准植株后张手、握拳');
      return result;
    }
    function store(){
      if(!held.value||holdingExit.value)return;
      if(!accountReady){notify('正在恢复采集记录，请稍候再收入背包');return;}
      const codexId=HERB_CODEX_IDS[held.value.id];
      if(!canStoreSpecies(sessionBagCounts.value,codexId)){notify('背包已满：最多携带30种植物');return;}
      sessionBagCounts.value[codexId]=(sessionBagCounts.value[codexId]||0)+1;
      collectedCounts.value[codexId]=(collectedCounts.value[codexId]||0)+1;
      let storage;try{storage=window.localStorage;}catch{}
      bag.value++;held.value=null;holdingExit.value=false;
      accountStore?.save();
      flash.value=true;clearTimeout(flashTimer);flashTimer=setTimeout(()=>flash.value=false,850);
      controller?.reset();notify('已收入本次背包 · 切换页面时存入仓库');
      if(points)drawHand(handCanvas.value,points);
    }
    function discard(){
      if(!held.value||holdingExit.value)return;
      holdingExit.value=true;
      exitTimer=setTimeout(()=>{held.value=null;holdingExit.value=false;controller?.reset();if(points)drawHand(handCanvas.value,points);notify('让这次相逢，留在山野');},350);
    }
    function collectNearest(){
      if(!nearest.value)return notify('沿着小路前进，寻找路边的草药');
      if(!grab({x:nearest.value.x,y:nearest.value.y}))return;
    }
    async function connectCamera(){
      if(cameraStatus.value==='ready')return;
      keyboard.value=false;controller?.lost();await camera.start();
    }
    async function stopCamera(){setMove(false);controller?.lost();await camera?.stop();cameraStatus.value='off';cameraMessage.value='摄像头已手动关闭';workshopCamera.connect();worldCamera.connect();}
    async function keyboardMode(){
      keyboard.value=true;controller?.lost();
      notify('按住 W / ↑ 前进 · E 采集 · B 存入 · X 放回');
    }
    function openModal(type){previousFocus=document.activeElement;modal.value=type;setMove(false);controller?.reset();requestAnimationFrame(()=>document.querySelector('.dialog-close')?.focus());}
    function closeModal(){modal.value=null;previousFocus?.focus();}
    async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('当前浏览器暂不支持全屏');}}
    const soundLabel=computed(()=>soundscapeFor(activeMapIndex.value,submapId.value).label);
    watch([activeMapIndex,submapId],()=>audio?.setScene(activeMapIndex.value,submapId.value));
    async function toggleSound(){
      try{audio??=new EnvironmentAudio();audio.setScene(activeMapIndex.value,submapId.value);sound.value=!sound.value;if(sound.value)await audio.resume();else await audio.suspend();}catch{sound.value=false;notify('环境声暂不可用');}
    }
    function keydown(event){
      if(modal.value){
        if(event.key==='Escape'){event.preventDefault();closeModal();}
        if(event.key==='Tab'){
          const focusables=[...document.querySelectorAll('.dialog button, .dialog a')];
          const first=focusables[0],last=focusables.at(-1);
          if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
          else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
        }return;
      }
      if(event.target.closest('input,textarea,select,[contenteditable="true"]')&&event.key!=='Escape')return;
      if(inventoryOpen.value){if(event.key==='Escape'||event.key.toLowerCase()==='b')closeInventory();if(event.key.toLowerCase()==='x')inventoryDrop();return;}
      if(mapMode.value){if(event.key==='Escape')closeMap();else if(event.key==='ArrowLeft')turnMap(-1);else if(event.key==='ArrowRight')turnMap(1);else if(event.key==='Enter')travelToPoint();return;}
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();navigatePage(event.key==='ArrowRight'?1:-1);return;}
      if(activePage.value!=='forest')return;
      if(['w','W','ArrowUp'].includes(event.key)){event.preventDefault();keyWalking=true;setMove(true);}
      if(event.repeat)return;
      if(event.key.toLowerCase()==='e'&&immersed.value)collectNearest();
      if(event.key.toLowerCase()==='b'){if(held.value)store();else openInventory();}
      if(event.key.toLowerCase()==='m')openMap('mini');
      if(event.key.toLowerCase()==='x')discard();
      if(event.key==='Escape'){setMove(false);immersed.value=false;}
    }
    function keyup(event){if(['w','W','ArrowUp'].includes(event.key)){keyWalking=false;setMove(false);}}
    function stopWalking(){runGesture.reset();keyWalking=false;setMove(false);controller?.lost();inventoryController?.lost();pageController?.reset();dualController?.reset();strafeController?.reset();fingerScroll?.reset();}
    function visibility(){stopWalking();if(document.hidden)audio?.suspend();else if(sound.value)audio?.resume();}
    function look(event){if(immersed.value&&!held.value&&!modal.value&&event.buttons===1)forest.targetLook=Math.max(-.7,Math.min(.7,(event.clientX/innerWidth-.5)*1.4));}
    function centerLook(){if(forest)forest.targetLook=0;}
    function beginWalk(event){event.currentTarget.setPointerCapture(event.pointerId);keyWalking=true;setMove(true);}
    function endWalk(){keyWalking=false;setMove(false);}
    onMounted(async()=>{
      let storage;try{storage=window.localStorage;}catch{}additions.value=readProfile(storage);collectedCounts.value=collectionTotals(additions.value);
      pageController=new PageGestures({onNavigate:navigatePage,onScroll:scrollPage});
      strafeController=new StrafeGesture();fingerScroll=new DirectionalScroll(scrollPage,()=>{cancelAnimationFrame(scrollAnimation);scrollAnimation=0;scrollState=null;});
      mapWheel=new MapWheelGesture(shiftWheel,mode=>travelToPoint(mode==='start'?explorationMode.value:mode),{onSelect:number=>{let delta=number-1-wheelIndex.value;if(delta>2)delta-=5;if(delta< -2)delta+=5;turnMap(delta);},getStride:()=>{const el=document.querySelector('.wheel-slots');return el?el.clientWidth/5/innerWidth:.18;},onOffset:(offset,grabbing)=>{wheelOffset.value=offset;wheelDragging.value=grabbing;if(grabbing&&grabbedDigit.value===null)grabbedDigit.value=mapWheel?.grabbedNumber??hoveredDigit.value;if(!grabbing)grabbedDigit.value=null;},onSettle:()=>{mapIndex.value=wheelIndex.value;confirmedMapIndex.value=mapIndex.value;}});
      dualController=new DualGestures({onInventory:openInventory,onCloseInventory:closeInventory,onMiniMap:()=>openMap('mini'),onMapPicker:()=>openMap('picker'),onCloseMap:closeMap,onMapTurn:turnMap});
      archiveController=new GestureController({onMove:()=>{},onGrab:archiveGrab,onStore:null,onDiscard:()=>{},isHolding:()=>false,onHand:()=>{}});
      inventoryController=new GestureController({onMove:()=>{},onGrab:inventoryGrab,onStore:null,onDiscard:inventoryDrop,isHolding:()=>!!inventoryHeld.value,onHand:(landmarks,hand,center)=>{points=landmarks;if(center)handCenter.value=center;gesture.value=hand?.kind||'等待手部入镜';}});
      controller=new GestureController({
        onMove:value=>{if(!keyboard.value&&!keyWalking)setMove(value);},
        onGrab:grab,onStore:store,onDiscard:discard,isHolding:()=>!!held.value,
        onHand:(landmarks,hand,center)=>{
          points=landmarks;handPresent.value=!!landmarks;
          if(center)handCenter.value={x:handCenter.value.x*.55+center.x*.45,y:handCenter.value.y*.55+center.y*.45};
          gesture.value=hand?.kind||'等待手部入镜';
          if(handCanvas.value)drawHand(handCanvas.value,held.value||holdingExit.value?null:landmarks);
        }
      });
      try {
        forest=new Forest(sceneEl.value,{artStudy,
          onUpdate:state=>{const now=performance.now();if(now-lastUpdate<70)return;lastUpdate=now;if(activeMapIndex.value!==(state.biomeId??0)){if(!depositBag()){setMove(false);return;}activeMapIndex.value=state.biomeId??0;confirmedMapIndex.value=activeMapIndex.value;if(!mapMode.value)mapIndex.value=activeMapIndex.value;notify('小径相连，步入 '+MAPS[activeMapIndex.value].name);}submapId.value=state.submapId??0;distance.value=state.distance;moving.value=state.moving;travelSpeed.value=state.speed||0;nearest.value=held.value?null:state.nearest;animalInfo.value=state.animalInfo||null;ended.value=state.ended;},
          onCollect:herb=>{held.value=herb;drawHand(handCanvas.value,null);setMove(false);notify('保持握拳向下移动，即可存入背包');},
          onError:message=>{worldError.value=message;notify(message);}
        });ready.value=true;if(artStudy){const studyMap=['sahara','rift','delta'].includes(artStudy)?4:3;const studyPhase={alpine:0,fjord:1,aegean:2,sahara:0,rift:1,delta:2}[artStudy];forest.travelTo(0,MAPS[studyMap],{submap:studyPhase,length:450});forest.enableArtStudy();const studyDistance=Number(new URLSearchParams(location.search).get('studyDistance'));if(Number.isFinite(studyDistance)&&studyDistance>0&&studyDistance<=150)forest.advance(studyDistance/2);activeMapIndex.value=studyMap;confirmedMapIndex.value=studyMap;mapIndex.value=studyMap;immersed.value=true;}
      }catch(error){worldError.value='当前设备无法启动 3D 森林，请使用支持 WebGL 的浏览器。';notify(worldError.value);console.error(error);}
      camera=new HandCamera(video.value,{
        onResults:results=>{
          if(unloaded||document.hidden)return;
          const hands=[results.handLeft,results.handRight].filter(Boolean),now=results.timestamp||performance.now();handCount.value=hands.length;
          if(movementGuide.value&&!mapMode.value&&!inventoryOpen.value){setMove(false);if(tutorialStep.value===0)globalNavigation.process(results.handLeft,results.handRight,{},now);tutorialConfirmation.process(results.handLeft,results.handRight,now);drawHands(handCanvas.value,hands);handPresent.value=!!hands.length;gesture.value='教程 · 双手张掌，再握拳确认';return;}
          const navigationBlocked=!!modal.value||!!mapMode.value||inventoryOpen.value||!!held.value||!!inventoryHeld.value||!!forest?.picking||!!mapWheel?.grabbed||(activePage.value==='potion'&&workshopFrame.value?.contentWindow?.herbalWorkshopHost?.canNavigate?.()===false);
          const navigating=globalNavigation.process(results.handLeft,results.handRight,{blocked:navigationBlocked},now);navArming.value=navigating;navProgress.value=globalNavigation.progress;
          if(navigating){lastHand=now;handPresent.value=!!hands.length;gesture.value='导航 · 保持握拳左右横扫';forest?.setHandPointer(null);setMove(false);fingerScroll.reset();controller.reset();pageController.reset();workshopCamera.process({landmarks:[],handedness:[]});worldCamera.process({landmarks:[],handedness:[]});return;}
          if(activePage.value==='potion'||activePage.value==='world'){lastHand=now;setMove(false);(activePage.value==='potion'?workshopCamera:worldCamera).process(results.raw);drawHands(handCanvas.value,[]);return;}
          if(!hands.length){interactionHand.reset();handCardHover.value=null;handOverStart.value=false;hoveredDigit.value=null;hoveredExploreMode.value=null;forest?.setHandPointer(null);archiveController?.reset();runGesture.reset();mapWheel?.process(null,null);pageController.lost(now);controller.lost();inventoryController.lost();dualController.process(null,null,{},now);fingerScroll.reset();strafeController.reset();activeSingleId=null;lastSingleCenter=null;handPresent.value=false;return;}
          lastHand=now;handPresent.value=true;
          const runningHands=runGesture.process(results.handLeft,results.handRight,now,activePage.value==='forest'&&!mapMode.value&&!inventoryOpen.value&&!modal.value&&!held.value&&!forest?.picking);
          const dual=dualController.process(results.handLeft,results.handRight,{mapsOpen:!!mapMode.value,inventoryOpen:inventoryOpen.value,blocked:!!modal.value||!!held.value||!!forest?.picking},now);
          const selected=interactionHand.process(results.handLeft,results.handRight,now,{holding:!!held.value||!!inventoryHeld.value||!!mapWheel?.grabbed,scrollable:!!mapMode.value||inventoryOpen.value||activePage.value==='about'||activePage.value==='profile'||!!modal.value});
          const chosen=selected.points;
          const label=chosen===results.handRight?'right':'left',landmarks=chosen,hand=classifyHand(landmarks);
          if(!hand.valid)return;const center={x:1-hand.palm.x,y:hand.palm.y};points=landmarks;handCenter.value=center;updateCardHover(center);if(activePage.value==='forest'&&!inventoryOpen.value&&!mapMode.value&&!modal.value)forest?.setHandPointer(center);else forest?.setHandPointer(null);
          if(label!==activeSingleId&&(hands.length>1||!lastSingleCenter||Math.hypot(center.x-lastSingleCenter.x,center.y-lastSingleCenter.y)>.28)){controller.reset();inventoryController.reset();archiveController.reset();pageController.reset();strafeController.reset();fingerScroll.reset();if(mapMode.value)mapWheel.reset();for(const sample of selected.prime){if(mapMode.value){const pose=classifyHand(sample.points);processMapHand(pose,{x:1-pose.palm.x,y:pose.palm.y},sample.now);}if(!mapMode.value&&!inventoryOpen.value&&activePage.value==='forest')controller.process(sample.points,sample.now);if(inventoryOpen.value)inventoryController.process(sample.points,sample.now);if(activePage.value==='profile')archiveController.process(sample.points,sample.now);}}
          activeSingleId=label;lastSingleCenter=center;
          if(dual){setMove(false);controller.reset();pageController.reset();strafeController.reset();fingerScroll.reset();gesture.value='双手互动';}
          else if(runningHands&&hand.relaxed){controller.reset();pageController.reset();strafeController.reset();fingerScroll.reset();setMove(true);forest?.setRunning(true);gesture.value='双手虚握 · 平滑奔跑';}
          else if(inventoryOpen.value){setMove(false);controller.reset();const crossing=false;if(!modal.value&&!crossing)inventoryController.process(landmarks,now);fingerScroll.process(landmarks,{enabled:canGestureScroll()&&!inventoryHeld.value&&!crossing},now);}
          else if(mapMode.value){setMove(false);controller.reset();pageController.reset();processMapHand(hand,center,now);gesture.value='地图 · '+hand.kind;fingerScroll.process(landmarks,{enabled:canGestureScroll()&&!mapWheel.grabbed&&!hitElement('.map-wheel',center)},now);}
          else {
            const crossing=false; // Page navigation is exclusively the bounded fist gesture above.
            if(activePage.value==='forest'&&!modal.value&&!crossing){
              processMapHand(hand,center,now);
              if(hitElement('.explore-orb',center)){setMove(false);controller.reset();return;}
              forest?.setRunning(false);
              const lateral=!held.value&&!forest?.picking&&strafeController.process(hand,center,amount=>{immersed.value=true;forest?.strafe(amount);},now);
              if(forest?.picking){setMove(false);gesture.value='正在拾取';}else if(lateral){setMove(false);controller.reset();gesture.value='缓慢平移';}else controller.process(landmarks,now);
            }else {setMove(false);controller.reset();gesture.value=hand.kind;}
            if(activePage.value==='profile'&&!inventoryOpen.value&&!modal.value&&!crossing)archiveController.process(landmarks,now);
            fingerScroll.process(landmarks,{enabled:canGestureScroll()&&!crossing&&(!!modal.value||activePage.value==='profile'||activePage.value==='about')});
          }
          drawHands(handCanvas.value,held.value||inventoryHeld.value?[]:hands);
        },
        onStatus:(status,message)=>{cameraStatus.value=status;cameraMessage.value=message;workshopCamera.connect();worldCamera.connect();if(status==='error'){controller.lost();pageController.reset();}}
      });
      accountStore=new AccountProgress(localStorage,progressSnapshot,applyProgress,state=>{accountUser.value=state.user;accountMessage.value=state.message;});
      await accountStore.init();accountReady=true;progressTimer=setInterval(()=>{if(!held.value&&!forest?.picking)accountStore.save();},5000);
      if(!artStudy)camera.start();else{cameraStatus.value='off';cameraMessage.value='美术试样';} // 首屏自动申请权限；失败不阻止森林与备用操作。
      watchdog=setInterval(()=>{if(!keyWalking&&performance.now()-lastHand>250&&forest?.moving)controller.lost();},100);
      window.addEventListener('message',onWorkshopReady);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',stopWalking);
      document.addEventListener('visibilitychange',visibility);
    });
    onBeforeUnmount(()=>{
      unloaded=true;clearInterval(progressTimer);accountStore?.save();void accountStore?.flush();previewForest?.dispose();cancelAnimationFrame(wheelAnimation);clearTimeout(toastTimer);clearTimeout(exitTimer);clearTimeout(flashTimer);clearTimeout(bounceTimer);clearInterval(watchdog);cancelAnimationFrame(scrollAnimation);
      window.removeEventListener('message',onWorkshopReady);workshopCamera.reset();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',stopWalking);document.removeEventListener('visibilitychange',visibility);
      camera?.stop();forest?.dispose();audio?.close();
    });
    return {RESEARCH_HTML,scrollToAbout,navArming,navProgress,openTutorial,worldFrame,onWorldLoad,accountUser,accountMessage,accountMode,accountName,accountPassword,accountBusy,accountError,submitAccount,logoutAccount,workshopFrame,onWorkshopLoad,workshopActive,soundLabel,wildlifeFor,animalInfo,bagSpecies,stopCamera,studyTitle,artStudy,floraFor,hoveredExploreMode,exploreChoices,explorationMode,submaps,submapImages,tutorialStep,tutorialSteps,currentTutorial,advanceTutorial,region,handCardHover,handOverStart,hoveredDigit,movementGuide,travelSpeed,dismissMovementGuide,sceneEl,handCanvas,video,immersed,modal,sound,bag,flash,cameraStatus,cameraMessage,handPresent,gesture,moving,distance,nearest,held,holdingExit,keyboard,ready,statusText,holdStyle,targetStyle,toast,ended,worldError,herbImage,enter,store,discard,connectCamera,keyboardMode,openModal,closeModal,toggleFullscreen,toggleSound,collectNearest,look,centerLook,beginWalk,endWalk,activePage,switchPage,profileScroll,aboutScroll,category,search,record,records,displayRecords,filteredRecords,profileStats,CATEGORIES,CODEX_FILTERS,recordArt,showRecord,goCollect,inventoryOpen,inventoryHeld,openInventory,closeInventory,inventoryDrop,takeInventoryRecord,handCount,mapMode,mapIndex,mapPoint,mapZoom,mapBounce,selectedMap,selectedPoint,MAPS,RARITY_GROUPS,slots,wheelOffset,wheelDragging,grabbedDigit,previewEl,wheelDirection,confirmedMapIndex,confirmMap,wheelPointerDown,wheelPointerMove,wheelPointerUp,openMap,closeMap,turnMap,travelToPoint,currentRegion};
  }
}).mount('#app');



