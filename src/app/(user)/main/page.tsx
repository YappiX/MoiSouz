import React, { Suspense } from 'react';
import Main from '@/components/pages/Main/MainPage';

const MainPage = () => {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
};

export default MainPage;
