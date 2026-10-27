export const BAG_SPECIES_LIMIT=30;
export const bagSpeciesCount=counts=>Object.values(counts).filter(n=>n>0).length;
export const canStoreSpecies=(counts,id)=>!!id&&(counts[id]>0||bagSpeciesCount(counts)<BAG_SPECIES_LIMIT);
export function mergeExpedition(additions,counts){const next={...additions};for(const[id,n]of Object.entries(counts))if(Number.isSafeInteger(n)&&n>0)next[id]=(next[id]||0)+n;return next;}
