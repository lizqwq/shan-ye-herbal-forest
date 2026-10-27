import {mergeExpedition} from './expedition-bag.js';
// Historical collection totals stay independent of current warehouse/bag quantities.
export function collectionTotals(profile={},bag={},saved={}){const result=mergeExpedition(profile,bag);for(const[id,n]of Object.entries(saved||{}))if(/^\d+$/.test(id)&&Number.isSafeInteger(n)&&n>=0)result[id]=Math.max(result[id]||0,n);return result;}
