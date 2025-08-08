'use client';

import React, { ChangeEvent, FC, useEffect, useRef } from 'react';

interface IProps {
  open: boolean;
  onPick: (file: File) => void;
  onClose: () => void;
  accept?: string;
}

const FilePickerDialog: FC<IProps> = ({ open, onPick, onClose, accept }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open == true) fileInputRef.current?.click();
    else {
      // clear files
      if (fileInputRef.current) {
        fileInputRef.current.type = 'text';
        fileInputRef.current.type = 'file';
      }
    }
  }, [open]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) onPick(selectedFile);
    else onClose();
  };

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept={accept}
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
  );
};

export default FilePickerDialog;
