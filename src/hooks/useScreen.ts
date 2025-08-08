import { useMedia } from 'use-media';

type ScreenType = 'mobile' | 'tablet' | 'desktop';

const useScreen = (): ScreenType => {
  const mobile = useMedia({ maxWidth: '744px' });
  const pad = useMedia({ maxWidth: '1080px' });

  if (mobile) return 'mobile';
  if (pad) return 'tablet';
  return 'desktop';
};

export default useScreen;
