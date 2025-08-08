import { useMedia } from 'use-media';

const useMobile = () => {
    return useMedia({ maxWidth: '744px' });
}

export default useMobile