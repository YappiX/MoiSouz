import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveFormTULogo = async (file: any) => {
  if (typeof file != 'object') {
    return null;
  }

  const formData = new FormData();
  formData.append('logo', file);

  return axios.post(`${getBackendUrl}/api/private/tradeunion-logo`, formData, {
    headers: {
      ...(await getHeaders()),
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveFormTUScan = async (file: any) => {
  if (typeof file != 'object') {
    return null;
  }

  const formData = new FormData();
  formData.append('scan', file);

  return axios.post(`${getBackendUrl}/api/private/tradeunion-scan`, formData, {
    headers: {
      ...(await getHeaders()),
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveFormTU2Scan = async (file: any, guid: string) => {
  const formData = new FormData();
  if (file) formData.append('upload', file);
  formData.append('guid', guid);

  return axios.post(`${getBackendUrl}/api/private/document-upload`, formData, {
    headers: {
      ...(await getHeaders()),
    },
  });
};

export const postDoc = async (
  data: { step: string },
  guid: string | undefined,
) => {
  if (guid) {
    const response = await axios.post(
      `${getBackendUrl}/api/private/document/${guid}`,
      { step: data.step },
      {
        headers: { ...(await getHeaders()) },
      },
    );
    return response;
  } else return null;
};
