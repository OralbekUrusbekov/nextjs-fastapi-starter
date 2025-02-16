'use server';

import { Language } from '@/types/lang';
import { cookies } from 'next/headers';

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export async function setCookie(name: string, email: string) {
  const expires = new Date();
  const cookieStore = await cookies();
  expires.setDate(expires.getDate() + 3);
  cookieStore.set(name, email, { httpOnly: true, path: '/', expires });
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function getLanguage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value as string | undefined;
  return lang ? (lang as Language) : 'ru';
}

export async function hasPhoneNumber() {
  const cookieStore = await cookies();
  return cookieStore.has('phone_number');
}

export async function hasTicketId() {
  const cookieStore = await cookies();
  return cookieStore.has('ticket_id');
}

export async function hasToken() {
  const cookieStore = await cookies();
  return cookieStore.has('token');
}

export async function getZero() {
  if (0 === 0) return 0;
}

export async function getOne() {
  if (1 === 1) return 1;
}

export async function getTwo() {
  if (2 === 2) return 2;
}

export async function getThree() {
  if (3 === 3) return 3;
}
