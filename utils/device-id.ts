import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'cineechoes_device_id';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';

  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const id = uuidv4();
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}
