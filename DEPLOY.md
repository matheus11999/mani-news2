# Deploy no EasyPanel - Mani News

## 🚨 IMPORTANTE: Configuração Correta

Seu EasyPanel está tentando usar configurações de MongoDB, mas o **Mani News usa PostgreSQL**. Siga estas instruções:

## 1. 📋 Configurações do EasyPanel

### Variáveis de Ambiente (SUBSTITUA TODAS)
```
DATABASE_URL=postgres://mani:260520jm@evoapi_maninews-postgres:5432/mani?sslmode=disable
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=production
PORT=3000
NPM_CONFIG_PRODUCTION=false
```

### ❌ REMOVER estas variáveis MongoDB:
```
MONGODB_URI=mongodb://... (REMOVER)
MONGODB_TEST_URI=mongodb://... (REMOVER)
SESSION_SECRET=... (REMOVER)
SMTP_HOST=... (REMOVER - opcional)
SMTP_PORT=... (REMOVER - opcional)
SMTP_USER=... (REMOVER - opcional)
SMTP_PASS=... (REMOVER - opcional)
UPLOAD_PATH=... (REMOVER)
MAX_FILE_SIZE=... (REMOVER)
```

## 2. 🔧 Configuração de Build

### Builder: `heroku/builder:24`
### Build Command: `npm install && npm run build`
### Start Command: `npm start`

## 3. 🗄️ Banco de Dados

Certifique-se que o PostgreSQL está rodando:
- **Container**: `evoapi_maninews-postgres`
- **Porta**: `5432`
- **Database**: `mani`
- **User**: `mani`
- **Password**: `260520jm`

## 4. 🚀 Processo de Deploy

1. **Configure as variáveis** conforme acima
2. **Faça o deploy** do código do GitHub
3. **Aguarde o build** (pode demorar alguns minutos)
4. **Acesse a aplicação**
5. **Vá para `/admin/register`** para criar o primeiro admin

## 5. 🔍 Troubleshooting

### ❌ Erro "ENOSPC: no space left on device"
Este erro indica falta de espaço em disco no container de build:

**Soluções:**
1. **Limpar Docker cache:**
```bash
docker system prune -a
docker volume prune
```

2. **Usar Docker build mais eficiente:**
```bash
# Se disponível, use o Dockerfile customizado
docker build -t mani-news .
```

3. **Configurar EasyPanel com mais espaço:**
   - Aumente o limite de espaço do container
   - Ou use um nó com mais espaço disponível

### Se o build falhar:
- Verifique se as variáveis PostgreSQL estão corretas
- Remova TODAS as variáveis MongoDB
- Certifique-se que `NODE_ENV=production`
- Verifique espaço em disco disponível

### Se não conectar no banco:
```bash
# Teste a conexão PostgreSQL
psql "postgres://mani:260520jm@evoapi_maninews-postgres:5432/mani?sslmode=disable"
```

### Logs para verificar:
```bash
# Ver logs da aplicação
docker logs [container-name]

# Ver espaço em disco
df -h
```

## 6. 📱 Pós-Deploy

1. **Acesse**: `http://seu-dominio:3000`
2. **Registro Admin**: `/admin/register`
3. **Login**: `/admin/login`
4. **Configurações**: `/admin/settings`

## 7. ✅ Checklist Final

- [ ] PostgreSQL container rodando
- [ ] Variáveis DATABASE_URL configurada
- [ ] Variáveis MongoDB removidas
- [ ] Build realizado com sucesso
- [ ] Aplicação iniciando na porta 3000
- [ ] Admin criado em `/admin/register`

---

**⚠️ IMPORTANTE**: O EasyPanel precisa usar **PostgreSQL**, não MongoDB!