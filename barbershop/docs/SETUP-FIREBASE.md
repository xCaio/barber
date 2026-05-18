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

### Opção A — Pelo Console (mais fácil, sem CLI)

1. Firebase Console → **Firestore Database** → aba **Regras**
2. Copie o conteúdo do arquivo `firestore.rules` deste projeto
3. Cole no editor e clique em **Publicar**

### Opção B — Pelo terminal (Firebase CLI)

Se aparecer *"Invalid project selection"* ou *"Failed to list Firebase projects"*:

```bash
firebase logout
firebase login --reauth
firebase projects:list
```

O comando `projects:list` mostra o **Project ID real** (pode ser diferente do nome exibido).

Depois:

```bash
firebase use SEU_PROJECT_ID_REAL
npm run firebase:rules
```

> **Importante:** `firebase login` dizendo "Already logged in" **não garante** que o token está válido. Se `projects:list` falhar, faça `logout` + `login --reauth`.

Sem regras publicadas, o cadastro falha com: *"Permissão negada no Firestore"*.

### Como achar o Project ID correto

Console → ⚙️ **Configurações do projeto** → campo **ID do projeto** (ex: `barbershop-c9294`).

Deve ser **igual** ao `VITE_FIREBASE_PROJECT_ID` no `.env`.

## 4. Reiniciar o app

```bash
npm run dev
```

## 5. Tornar-se admin (opcional)

Após criar sua conta, no Firestore Console:

- Collection `users` → documento com seu UID
- Campo `role`: altere de `client` para `admin`
