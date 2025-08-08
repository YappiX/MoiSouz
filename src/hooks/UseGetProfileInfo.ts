import { IExpandedSession } from '@/models/CustomSession';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

export function useGetProfileInfo(): { profileInfo: User | null } {
  const { data } = useSession();
  const session = data as IExpandedSession;

  return session && session.user
    ? { profileInfo: session.user }
    : { profileInfo: null };
}
