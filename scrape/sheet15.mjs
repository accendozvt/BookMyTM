import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { POSTS } from './legacy-blog-image-plan.mjs';
const PUB='D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next/public/images/blog';
const CW=400,CH=210,COLS=3;
const rows=Math.ceil(POSTS.length/COLS);
const comp=[];
for(let i=0;i<POSTS.length;i++){
  const b=await sharp(readFileSync(join(PUB,POSTS[i].file+'.webp'))).resize(CW,CH,{fit:'cover'}).png().toBuffer();
  comp.push({input:b,left:(i%COLS)*CW,top:Math.floor(i/COLS)*CH});
}
const out=await sharp({create:{width:CW*COLS,height:CH*rows,channels:3,background:'#fff'}}).composite(comp).png().toBuffer();
writeFileSync('C:/Users/vivek/AppData/Local/Temp/claude/D--Google-Drive-Work-Accendoz-Projects-BookMyTM/00f5bf26-fd8c-4811-b776-521fbcb9d0b1/scratchpad/blog15.png',out);
console.log('ok '+CW*COLS+'x'+CH*rows);
