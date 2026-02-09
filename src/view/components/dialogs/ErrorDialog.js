import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from 'components/window/Dialog';
import { Warning } from 'view/icons';
import useError, { clearError } from 'actions/error';

export default function ErrorDialog({ onClose }) {
  const { t } = useTranslation();
  const message = useError(state => state.message);

  function handleConfirm() {
    clearError();
    onClose();
  }

  return <Dialog icon={Warning} message={message} buttons={[t('modal.canvas.ok')]} onConfirm={handleConfirm} />;
}
