# Configuração Firebase — Checklist

## 1. Ativar login por e-mail/senha

1. [Firebase Console](https://console.firebase.google.com) → seu projeto **barbershop-c9294**
2. **Authentication** → **Sign-in method**
3. Ative **E-mail/senha** (primeira opção)
4. Salve

Sem isso o cadastro retorna: *"Login por e-mail não está ativado no Firebase Console."*

## 2. Criar banco Firestore

1. **Firestore Database** → **Criar banco**
2. Escolha local (ex: `southamerica-east1`)
3. Em produção, use modo **produção** (não deixe em teste aberto por muito tempo)

## 3. Publicar regras de segurança

**Importante:** rode os comandos na pasta `barbershop` (onde está o `firebase.json`), não na pasta pai `barber`.

O projeto já está vinculado em `.firebaserc` com ID **`barbershop-c9294`**.

```bash
cd d:\barber\barbershop
firebase login
firebase use barbershop-c9294
npm run firebase:rules
```

### Erro "Invalid project selection"?

| Causa | Solução |
|-------|---------|
| ID errado (`barbearia-c9294`) | Use **`barbershop-c9294`** (com "shop", não "bearia") |
| Pasta errada | Entre em `d:\barber\barbershop` antes do comando |
| Conta Google diferente | `firebase logout` → `firebase login` com a conta do Console |
| Projeto não vinculado | `firebase use --add` e escolha **barbershop** na lista |

Liste seus projetos: `firebase projects:list`

Sem publicar as regras, o cadastro falha com: *"Permissão negada no Firestore"*.

## 4. Reiniciar o app

```bash
npm run dev
```

## 5. Cadastrar Thiago Garcia e serviços

1. Promova seu usuário a **admin** (veja seção 6)
2. Acesse **`/admin`** no site
3. Clique em **"Configurar barbearia agora"**

Isso cadastra o barbeiro **Thiago Garcia** e os 6 serviços. Sem isso, `/agendar` não mostra barbeiros.

## 6. Promover usuário a admin

1. Faça **cadastro ou login** no site com o e-mail que será administrador
2. Firebase Console → **Firestore** → coleção **`users`**
3. Abra o documento cujo ID é o **UID** do usuário (mesmo valor do campo `uid`)
4. Edite o campo **`role`**: altere de `client` para **`admin`**
5. Recarregue o site e acesse **`/admin`**

| Campo | Valor |
|-------|--------|
| `role` | `admin` |
| `uid` | UID do Firebase Auth (não altere) |
| `email` | e-mail do admin |

Para barbeiros com acesso ao painel, use `role: "barber"` (também liberado nas regras).

## 7. Publicar regras após atualizações

Sempre que `firestore.rules` ou `firestore.indexes.json` mudarem:

```bash
cd d:\barber\barbershop
firebase use barbershop-c9294
npm run firebase:rules
npm run firebase:indexes
```

### Agendamento: "Missing or insufficient permissions"

Clientes precisam ler **agendamentos ativos** (`status: agendado`) de outros clientes para calcular horários livres. As regras atuais permitem isso apenas para usuários autenticados. Se o erro persistir, confirme que as regras e índices foram publicados (comando acima).

## 8. Login com "Tempo esgotado"

Se o login trava mesmo com internet ok:

### A) Limpar cache do navegador
1. Abra o site (`localhost:5173`)
2. **F12** → Application → **Clear site data** (Limpar dados do site)
3. Recarregue e tente de novo

### B) Liberar API Key para localhost
1. [Google Cloud Console](https://console.cloud.google.com) → APIs → **Credentials**
2. Abra a API Key do Firebase (`AIzaSy...`)
3. Em **Application restrictions** → **HTTP referrers**
4. Adicione:
   - `http://localhost:*/*`
   - `http://127.0.0.1:*/*`
5. Salve e aguarde 1–2 minutos

### C) Domínios autorizados no Firebase
Firebase Console → **Authentication** → **Settings** → **Authorized domains**  
Confirme que existem: `localhost`, `127.0.0.1` e **`barbearia-garcia.vercel.app`** (produção)

### D) API Key em produção (Vercel)
Google Cloud → **Credentials** → API Key do Firebase → **HTTP referrers**:
- `https://barbearia-garcia.vercel.app/*`
- `https://*.vercel.app/*`

