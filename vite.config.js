import { defineConfig } from 'vite';
import cmsPlugin from './scripts/cms-plugin.js';

// GitHub Pages proje deposu alt-dizininde (kullanici.github.io/repo/) sorunsuz
// calismasi icin goreli temel yol. Ozel domain/kok-site'a tasinirsa '/' yapilabilir.
export default defineConfig({
  base: './',
  plugins: [cmsPlugin()],
});
