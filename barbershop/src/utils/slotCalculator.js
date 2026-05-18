import { SLOT_INTERVAL_MINUTES } from '../constants';
import {
  combineDateAndTime,
  timeToMinutes,
  minutesToTime,
  rangesOverlap,
  isSlotInPast,
  toDate,
} from './dateUtils';

/**
 * Calcula horários disponíveis para um barbeiro em uma data.
 * Considera: horário de funcionamento, almoço, agendamentos, bloqueios e duração do serviço.
 */
export function calculateAvailableSlots({
  dateStr,
  serviceDurationMinutes,
  workingHours,
  lunchBreak,
  appointments = [],
  blockedSlots = [],
  isDayOff = false,
}) {
  if (isDayOff || !workingHours) return [];

  const busyPeriods = buildBusyPeriods({
    dateStr,
    lunchBreak,
    appointments,
    blockedSlots,
  });

  const workStart = timeToMinutes(workingHours.start);
  const workEnd = timeToMinutes(workingHours.end);
  const slots = [];

  for (let cursor = workStart; cursor + serviceDurationMinutes <= workEnd; cursor += SLOT_INTERVAL_MINUTES) {
    const slotStartTime = minutesToTime(cursor);
    const slotEndTime = minutesToTime(cursor + serviceDurationMinutes);
    const slotStart = combineDateAndTime(dateStr, slotStartTime);
    const slotEnd = combineDateAndTime(dateStr, slotEndTime);

    if (isSlotInPast(slotStart)) continue;

    const hasConflict = busyPeriods.some((period) =>
      rangesOverlap(slotStart, slotEnd, period.start, period.end)
    );

    if (!hasConflict) {
      slots.push({
        start: slotStart,
        end: slotEnd,
        label: slotStartTime,
        endLabel: slotEndTime,
      });
    }
  }

  return slots;
}

function buildBusyPeriods({ dateStr, lunchBreak, appointments, blockedSlots }) {
  const periods = [];

  if (lunchBreak?.start && lunchBreak?.end) {
    periods.push({
      start: combineDateAndTime(dateStr, lunchBreak.start),
      end: combineDateAndTime(dateStr, lunchBreak.end),
    });
  }

  appointments
    .filter((a) => a.status !== 'cancelado')
    .forEach((a) => {
      periods.push({
        start: toDate(a.startAt),
        end: toDate(a.endAt),
      });
    });

  blockedSlots.forEach((b) => {
    periods.push({
      start: combineDateAndTime(dateStr, b.start),
      end: combineDateAndTime(dateStr, b.end),
    });
  });

  return periods;
}

export function canFitSlot({ dateStr, startTime, durationMinutes, busyPeriods, workingHours }) {
  const slotStart = combineDateAndTime(dateStr, startTime);
  const slotEnd = combineDateAndTime(dateStr, minutesToTime(timeToMinutes(startTime) + durationMinutes));

  if (timeToMinutes(startTime) + durationMinutes > timeToMinutes(workingHours.end)) {
    return false;
  }

  return !busyPeriods.some((p) => rangesOverlap(slotStart, slotEnd, p.start, p.end));
}
