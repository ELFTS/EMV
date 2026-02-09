import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from 'components/window/Dialog';
import useProject, { newProject, openProjectFile, saveProjectFile } from 'actions/project';

export default function UnsavedChangesDialog({ action, onClose }) {
  const { t } = useTranslation();
  const project = useProject(state => state);

  async function handleAction(action) {
    if (action === 'new-project') {
      await newProject();
    } else if (action === 'open-project') {
      await openProjectFile();
    }
  }

  async function handleConfirm(button) {
    if (button === t('dialog.yes')) {
      const saved = await saveProjectFile(project.file);

      if (saved) {
        await handleAction(action);
      }
    } else if (button === t('dialog.no')) {
      await handleAction(action);
    }
    onClose();
  }

  return (
    <Dialog
      message={t('dialog.unsavedChanges')}
      buttons={[t('dialog.yes'), t('dialog.no'), t('modal.settings.cancel')]}
      onConfirm={handleConfirm}
    />
  );
}
