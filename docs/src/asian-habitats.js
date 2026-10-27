export const ASIAN_PLANT_TYPES=[
{name:'asian_oak',capacity:360,size:[6.5,10.5]},
{name:'asian_masson',capacity:300,size:[6.0,10.8]},
{name:'asian_camphor',capacity:300,size:[6.8,9.5]},
{name:'asian_bamboo',capacity:400,size:[3.0,9.5]},
{name:'asian_wingnut',capacity:300,size:[7.0,9.8]},
{name:'asian_fern',capacity:700,size:[1.5,1.0]}
];
export const ASIAN_ANIMAL_INFO=[
{id:'giant_panda',name:'大熊猫',latin:'Ailuropoda melanoleuca',zones:[1],size:[2.0,2.1],offset:[4,9],kind:'large',desc:'这片竹影石涧以四川山地的箭竹林为原型。大熊猫主要取食竹子，常在林下和沟谷间活动；现实观察应保持距离。'},
{id:'chinese_hare',name:'华南兔',latin:'Lepus sinensis',zones:[0],size:[1.0,1.0],offset:[3.5,9],kind:'small',desc:'中国东部、南方林缘与草坡上的兔类，耳长、后肢发达，多在较安静的时段到开阔草地觅食。'},
{id:'kingfisher',name:'普通翠鸟',latin:'Alcedo atthis',zones:[1],size:[.65,.75],offset:[3.1,3.9],kind:'bird',desc:'常停在溪岸枝条或石上观察水面，背部蓝绿色、腹部暖棕色，细长尖嘴有助于捕食小鱼。'},
{id:'plateau_pika',name:'高原鼠兔',latin:'Ochotona curzoniae',zones:[2],size:[.65,.55],offset:[3,10],kind:'small',desc:'青藏高原草甸中的小型兔形目动物，耳朵短圆、几乎看不到尾巴，常在洞口与低草之间活动。'},
{id:'snowfinch',name:'褐翅雪雀',latin:'Montifringilla adamsi',zones:[2],size:[.55,.55],offset:[3,11],kind:'bird',desc:'生活在喜马拉雅和横断山高原开阔地带，翅上的浅色斑块醒目，会在地面寻找种子与小型无脊椎动物。'}
];
export const ASIAN_ANIMAL_POOLS={0:[['squirrel','tit'],['chinese_hare','tit'],['squirrel','chinese_hare']],1:[['egret','kingfisher'],['giant_panda','kingfisher'],['egret','frog']],2:[['marmot','plateau_pika'],['bharal','snowfinch'],['bharal','plateau_pika']]};
export const ASIAN_FLORA={
0:[{common:['紫花地丁','仙鹤草','车前草'],scarce:['金银花'],legend:['五味子']},{common:['蒲公英','艾草','益母草','紫苏'],scarce:['桔梗'],legend:['五味子']},{common:['仙鹤草','紫花地丁','车前草'],scarce:['桔梗','金银花'],legend:['五味子']}],
1:[{common:['鱼腥草','薄荷','菖蒲','车前草'],scarce:['石菖蒲'],legend:['重楼']},{common:['鱼腥草','金钱草','积雪草'],scarce:['伸筋草','石菖蒲'],legend:['重楼']},{common:['薄荷','积雪草','紫苏','金钱草'],scarce:['伸筋草'],legend:['重楼']}],
2:[{common:['蒲公英','珠芽蓼','高山龙胆','亚洲蓍草'],scarce:['当归'],legend:['红景天']},{common:['柴胡','黄芪','委陵菜','蒲公英'],scarce:['当归','川贝母'],legend:['红景天']},{common:['珠芽蓼','亚洲蓍草','高山龙胆'],scarce:['川贝母'],legend:['红景天']}]
};
