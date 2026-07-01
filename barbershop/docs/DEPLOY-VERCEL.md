# Deploy na Vercel (produção)

Repositório: `https://github.com/xCaio/barber`  
Pasta do app: **`barbershop`** (importante configurar como Root Directory)

---

## Opção A — Vercel + GitHub (recomendado)

### 1. Conectar o repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repo **xCaio/barber**
3. Em **Root Directory**, clique em **Edit** e selecione **`barbershop`**
4. Framework: **Vite** (detectado automaticamente)
5. Build Command: `npm run build`
6. Output Directory: `dist`

### 2. Variáveis de ambiente (Production)

Em **Settings → Environment Variables**, adicione (copie do seu `.env` local):

| Nome | Exemplo |
|------|---------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `barbershop-c9294.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `barbershop-c9294` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `barbershop-c9294.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `739568920246` |
| `VITE_FIREBASE_APP_ID` | `1:739568920246:web:...` |

Marque **Production**, **Preview** e **Development**.

### 3. Deploy

- Clique **Deploy**
- Ou faça push na branch conectada (ex.: `implementation` ou `main`)

### 4. Firebase pós-deploy

1. **Authentication → Settings → Authorized domains**  
   Adicione: `seu-projeto.vercel.app` (e domínio customizado se tiver)

2. **Google Cloud → API Key → HTTP referrers**  
   Adicione:
   - `https://*.vercel.app/*`
   - `https://seu-dominio.com/*`

3. Publique regras Firestore (local):
   ```bash
   cd barbershop
   npm run firebase:rules
   ```

---

## Opção B — CLI (terminal)

```bash
cd barbershop
npm i -g vercel
vercel login
vercel link
vercel env pull .env.vercel.local   # opcional
vercel --prod
```

Configure as mesmas variáveis `VITE_*` no painel ou via:

```bash
vercel env add VITE_FIREBASE_API_KEY production
```

---

## Branch atual

O código está na branch **`implementation`**. No Vercel:

- **Settings → Git → Production Branch** → defina `implementation`  
  **ou** faça merge para `main` e use `main` como produção.

---

## Checklist pós-deploy

- [ ] Site abre sem tela branca
- [ ] Login funciona
- [ ] `/agendar` carrega barbeiros e serviços
- [ ] `/admin` acessível com usuário `role: admin`
- [ ] Domínio Vercel na lista de authorized domains do Firebase
