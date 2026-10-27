import {ASIAN_FLORA} from './asian-habitats.js';
export const HABITAT_FLORA={
  "3": [
    {
      "common": [
        "高山蓍草",
        "欧百里香"
      ],
      "scarce": [
        "高山火绒草"
      ],
      "legend": [
        "欧乌头"
      ]
    },
    {
      "common": [
        "欧当归",
        "柳兰"
      ],
      "scarce": [
        "驯鹿地衣"
      ],
      "legend": [
        "海岩岩蔷薇"
      ]
    },
    {
      "common": [
        "迷迭香",
        "苦橙"
      ],
      "scarce": [
        "希腊鼠尾草"
      ],
      "legend": [
        "海葱"
      ]
    }
  ],
  "4": [
    {
      "common": [
        "沙漠枣",
        "骆驼蓬"
      ],
      "scarce": [
        "沙漠没药"
      ],
      "legend": [
        "沙漠夜牵牛"
      ]
    },
    {
      "common": [
        "锡兰榄仁",
        "非洲马鞭草"
      ],
      "scarce": [
        "裂谷芦荟"
      ],
      "legend": [
        "幽灵刺槐"
      ]
    },
    {
      "common": [
        "水蓼",
        "非洲莎草"
      ],
      "scarce": [
        "沼泽黄姜"
      ],
      "legend": [
        "睡莲"
      ]
    }
  ]
};
Object.assign(HABITAT_FLORA,ASIAN_FLORA);
export const floraFor=(zone,phase,fallback)=>HABITAT_FLORA[zone]?.[phase]||fallback;
