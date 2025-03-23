const path = require('path');
const fs = require('fs');





// Gera um BUILD_ID fixo durante o build
const buildId = Date.now().toString();
fs.writeFileSync(path.join(__dirname, '.next/BUILD_ID'), buildId);

module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Desativa a otimização de imagens (útil para builds estáticos)
  },
   // Usa o diretório temporário para o build do Next.js
  generateBuildId: () => buildId, // Define um BUILD_ID fixo
};
  