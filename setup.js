const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando RESTGEST com MongoDB Atlas...\n');

// Verificar se o ficheiro .env já existe
const envPath = path.join(__dirname, 'backend', '.env');
const configEnvPath = path.join(__dirname, 'backend', 'config.env');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(configEnvPath)) {
    // Copiar config.env para .env
    fs.copyFileSync(configEnvPath, envPath);
    console.log('✅ Ficheiro .env criado a partir de config.env');
  } else {
    console.log('❌ Ficheiro config.env não encontrado');
    process.exit(1);
  }
} else {
  console.log('✅ Ficheiro .env já existe');
}

console.log('\n📋 Próximos passos:');
console.log('1. Editar backend/.env e substituir <db_password> pela password real');
console.log('2. Executar: npm install');
console.log('3. Executar: cd backend && npm install');
console.log('4. Executar: cd frontend && npm install');
console.log('5. Executar: npm run dev');
console.log('\n🔑 String de conexão MongoDB Atlas:');
console.log('mongodb+srv://admin:<db_password>@gestorrestauracao.cb8bhkk.mongodb.net/?retryWrites=true&w=majority&appName=GestorRestauracao');
console.log('\n⚠️  IMPORTANTE: Substituir <db_password> pela password real do utilizador admin!');
