import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wedding } from './src/config/wedding.ts';
const escape=(text:string)=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export default defineConfig({
  plugins:[react(),{name:'wedding-metadata',transformIndexHtml(html){
    return html.replace(/<title>.*?<\/title>/,`<title>${escape(`${wedding.groom} & ${wedding.bride} — Под одной луной`)}</title>`)
      .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(wedding.description)}">`);
  }}],
  base:'./',
  build:{target:'es2022',rollupOptions:{output:{manualChunks:(id:string)=>id.includes('/node_modules/three/')?'three':undefined}}},
});
