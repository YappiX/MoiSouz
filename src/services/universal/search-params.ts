'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any;

interface PropsUseSearchParamsCustom {
  fields: string[];
}
export const useSearchParamsCustom = ({
  fields = [],
}: PropsUseSearchParamsCustom) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const load = () => {
    const _params = new URLSearchParams(searchParams.toString());

    const result: { [key: string]: Value } = {};
    fields
      .filter((el) => _params.has(el))
      .forEach((el) => (result[el] = _params.get(el) || ''));

    return result;
  };

  const [inited, setInited] = useState<boolean>(false);
  const [params, setParams] = useState<{ [key: string]: Value }>(load());

  useEffect(() => {
    setParams(load());
    setInited(true);
  }, []);

  const update = (params: { [key: string]: Value }) => {
    const from = searchParams.toString();
    const _params = new URLSearchParams(searchParams.toString());

    fields.forEach((el) => {
      if (params[el]) _params.set(el, String(params[el]));
      else _params.delete(el);
    });

    const to = _params.toString();
    if (from == to) return;
    router.push(`?${to}`, { scroll: false });
  };

  const set = (name: string, value: Value) => {
    setParams((prev) => {
      const result = { ...prev, [name]: value };
      update(result);
      return result;
    });
  };

  const remove = (name: string) => {
    setParams((prev) => {
      const result = { ...prev };
      delete result[name];
      update(result);
      return result;
    });
  };

  return {
    inited,
    data: params,
    actions: { set, remove },
  };
};
