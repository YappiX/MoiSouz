'use client';

import { FC, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

import styles from './index.module.scss';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export const InputHTML: FC<Props> = ({
  value,
  onChange,
  placeholder,
  disabled,
  error,
}) => {
  const editor = useRef(null);

  useEffect(() => {
    // fix dialog uploader (set accept for images)
    const interval = setInterval(() => {
      const elements = document.getElementsByClassName(
        'jodit-drag-and-drop__file-box',
      );
      if (elements.length == 0) return;
      const element = elements.item(0) as HTMLDivElement;
      if (element == null) return;
      if (element.style.padding == '20px') return;
      element.style.padding = '20px';

      // set text
      const childText = element.childNodes.item(1) as HTMLSpanElement;
      childText.style.whiteSpace = 'break-spaces';
      childText.innerHTML = '\r\nили нажмите\r\n<i>png, jpg, jpeg</i>';

      // set accept
      const childFile = element.childNodes.item(2) as HTMLInputElement;
      childFile.accept = 'image/png, image/jpeg, image/jpg';
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`html ${styles.editor} ${error && styles.error}`}>
      <JoditEditor
        ref={editor}
        value={value}
        config={{
          readonly: disabled,
          placeholder: placeholder || '',
          height: 600,
          allowResizeX: false,
          allowResizeY: false,
          dialog: {
            draggable: false,
          },
          enableDragAndDropFileToEditor: false,
          uploader: {
            insertImageAsBase64URI: true,
            imagesExtensions: ['png', 'jpg', 'jpeg'],
          },
          events: {},
          toolbarAdaptive: false,
        }}
        tabIndex={1}
        onBlur={(value) => onChange && onChange(value)}
        //onChange={onChange}
      />
    </div>
  );
};
