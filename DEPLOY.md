# 🚀 Deploy para Vercel - RESTGEST

## 📋 **Plano de Deploy Seguro**

### **PASSO 1: Preparação ✅**
- [x] Configurar `vercel.json` para backend e frontend
- [x] Adicionar scripts de build
- [x] Configurar estrutura de pastas

### **PASSO 2: Deploy do Backend**
1. **Criar projeto no Vercel** para o backend
2. **Configurar variáveis de ambiente**
3. **Fazer deploy e testar API**
4. **Confirmar conexão MongoDB**

### **PASSO 3: Deploy do Frontend**
1. **Criar projeto no Vercel** para o frontend
2. **Configurar variáveis de ambiente**
3. **Fazer deploy e testar**
4. **Confirmar comunicação com backend**

## 🔧 **Configurações Necessárias**

### **Backend (Vercel)**
```env
MONGODB_URI=mongodb+srv://admin:SUA_PASSWORD@gestorrestauracao.cb8bhkk.mongodb.net/?retryWrites=true&w=majority&appName=GestorRestauracao
JWT_SECRET=restgest_jwt_secret_2024_secure_key
UPLOAD_PATH=uploads
NODE_ENV=production
```

### **Frontend (Vercel)**
```env
REACT_APP_API_URL=https://seu-backend.vercel.app
```

## 📁 **Estrutura de Deploy**

```
restgest/
├── backend/          # Deploy separado no Vercel
│   ├── src/
│   ├── vercel.json
│   └── package.json
├── frontend/         # Deploy separado no Vercel
│   ├── src/
│   ├── vercel.json
│   └── package.json
└── vercel.json       # Configuração geral (se necessário)
```

## ⚠️ **Importante**
- **NÃO alterar** funcionamento local
- **Testar cada passo** antes de avançar
- **Confirmar dados** em cada etapa
- **Manter backup** do repositório local
