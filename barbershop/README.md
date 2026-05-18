# Barbearia — Sistema de Agendamento Online

Sistema completo de agendamento para barbearia com React, Firebase e interface premium.

## Funcionalidades

**Cliente:** escolher barbeiro, serviço, data/hora em tempo real, agendar, cancelar, reagendar, histórico.

**Admin/Barbeiro:** dashboard, calendário semanal, gestão de agendamentos, serviços, folgas, almoço e bloqueios.

## Início rápido

```bash
npm install
cp .env.example .env
# Preencha as variáveis Firebase no .env
npm run dev
```

## Firebase

1. Crie projeto no Firebase Console
2. Ative Authentication (e-mail/senha)
3. Crie Firestore
4. Configure `.env` com as credenciais do app web
5. Deploy das regras: `npm run firebase:rules`
6. Cadastre barbeiros e serviços no Firestore (veja `docs/ARQUITETURA.md`)
7. Após criar sua conta, altere `role` para `admin` no documento `users/{seu-uid}`

## Deploy

```bash
npm run firebase:deploy
```

## Documentação

Arquitetura completa, modelagem Firestore e fluxos: [docs/ARQUITETURA.md](docs/ARQUITETURA.md)

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Site institucional |
| `/agendar` | Fluxo de agendamento |
| `/meus-agendamentos` | Histórico do cliente |
| `/login` `/register` | Autenticação |
| `/admin` | Painel administrativo |
