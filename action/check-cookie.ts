'use server';

import { cookies } from 'next/headers';

const checkCookie = async (cookName: string) => {
  const cookieStore = await cookies();
  return cookieStore.has(cookName);
};
const checkInvalid = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('invalid')?.value == '1';
};

export { checkCookie, checkInvalid };
