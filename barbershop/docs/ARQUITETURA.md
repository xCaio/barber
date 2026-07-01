# Arquitetura — Sistema de Agendamento Barbearia

## Visão geral

SPA em **React + Vite** com backend **Firebase** (Auth + Firestore + Hosting). Estado global de autenticação via **Zustand**. Rotas com **React Router v7**.

```
src/
├── config/          # Firebase init
├── constants/       # Roles, status, defaults
├── services/        # Camada de dados (Firestore)
├── utils/           # slotCalculator, dateUtils
├── store/           # authStore (Zustand)
├── components/
│   ├── ui/          # Button, Input, Modal, Loading...
│   └── layout/      # Header, AdminLayout, ProtectedRoute
├── pages/
│   ├── auth/        # Login, Register, ForgotPassword
│   ├── client/      # Booking, MyAppointments
│   ├── admin/       # Dashboard, Agenda, Appointments...
│   └── Landing.jsx  # Site institucional
└── routes/          # AppRouter
```

## Collections Firestore

### `users`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| uid | string | ID do Auth |
| email | string | E-mail |
| displayName | string | Nome |
| phone | string | WhatsApp |
| role | string | `client` \| `barber` \| `admin` |

### `services`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| name | string | Nome do serviço |
| description | string | Descrição |
| price | number | Valor em R$ |
| durationMinutes | number | Duração |
| active | boolean | Visível ao cliente |
| order | number | Ordenação |

### `barbers`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| name | string | Nome |
| bio | string | Bio curta |
| active | boolean | Ativo |
| workingHours | object | `{ start, end }` padrão |
| lunchBreak | object | `{ start, end }` padrão |
| weeklySchedule | map | Horários por dia (0-6) |

### `availability` (documento: `{barberId}_{yyyy-MM-dd}`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| barberId | string | ID do barbeiro |
| date | string | Data |
| isDayOff | boolean | Folga |
| lunchBreak | object | Almoço do dia |
| blockedSlots | array | `[{ start, end, reason }]` |

### `appointments`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| clientId | string | UID ou `manual` |
| clientName | string | Nome |
| barberId | string | Barbeiro |
| serviceId | string | Serviço |
| durationMinutes | number | Duração |
| price | number | Valor |
| startAt | timestamp | Início |
| endAt | timestamp | Fim |
| status | string | `agendado` \| `concluido` \| `cancelado` |
| whatsappNotified | boolean | Preparado para integração futura |

## Fluxo de agendamento (cliente)

1. Escolhe **barbeiro** → `barbers` (active)
2. Escolhe **serviço** → `services` (active)
3. Escolhe **data** → consulta `availability` + `weeklySchedule`
4. Sistema calcula slots via `slotCalculator.js`:
   - Horário de trabalho
   - Almoço
   - Agendamentos existentes (não cancelados)
   - Bloqueios manuais
   - Duração do serviço (intervalos de 15 min)
5. Cliente confirma → `createAppointment` no Firestore
6. Pagamento **apenas presencial** (sem gateway online)

## Painel admin

- **Dashboard**: resumo do dia e próximos clientes
- **Agenda**: calendário semanal visual
- **Agendamentos**: lista por dia, criar manual, reagendar, cancelar, concluir
- **Serviços**: CRUD de preços e durações
- **Disponibilidade**: folgas, almoço, bloqueios

## Escalabilidade

- Múltiplos barbeiros: collection `barbers` independente
- WhatsApp: campo `whatsappNotified` + helper `buildWhatsAppMessage`
- Regras Firestore separam permissões cliente/admin
- Lógica de slots isolada em `utils/slotCalculator.js`

## Setup Firebase

1. Crie projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative **Authentication** (E-mail/senha)
3. Crie **Firestore** em modo produção
4. Copie credenciais para `.env` (veja `.env.example`)
5. Deploy regras: `npm run firebase:rules`
6. Popule dados iniciais (Console ou script abaixo)
7. Defina role `admin` no documento `users/{seu-uid}`

### Dados iniciais (exemplo no Console)

**barbers** (auto-id):
```json
{
  "name": "João Silva",
  "bio": "Especialista em degradê",
  "active": true,
  "workingHours": { "start": "09:00", "end": "19:00" },
  "lunchBreak": { "start": "12:00", "end": "13:00" }
}
```

**services** (auto-id):
```json
{
  "name": "Corte Masculino",
  "description": "Corte personalizado",
  "price": 25,
  "durationMinutes": 45,
  "active": true,
  "order": 1
}
```

## Deploy

```bash
npm run build
firebase deploy
```
