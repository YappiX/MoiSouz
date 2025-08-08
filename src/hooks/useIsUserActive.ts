import { useMemo } from 'react';
import { useFetchProfile } from './useFetchProfile';

export function useIsUserActive(): boolean {
  const { info } = useFetchProfile();
  const isActive = useMemo(() => {
    if (!!info?.ROLES?.includes('ROLE_TRADEUNION') && info?.hasTradeunionOwner)
      return true;
    if (!info?.ROLES?.includes('ROLE_TRADEUNION') && info?.hasTradeunionMember)
      return true;
    return false;
  }, [info?.ROLES, info?.hasTradeunionOwner, info?.hasTradeunionMember]);

  return isActive;
}
