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

1. No Firestore, abra `users/{seu-uid}` e altere **`role`** para `admin`
2. Acesse **`/admin`** no site
3. Clique em **"Configurar barbearia agora"**

Isso cadastra o barbeiro **Thiago Garcia** e os 6 serviços. Sem isso, `/agendar` não mostra barbeiros.

## 6. Tornar-se admin (resumo)

Após criar sua conta, no Firestore Console:

- Collection `users` → documento com seu UID
- Campo `role`: altere de `client` para `admin`
