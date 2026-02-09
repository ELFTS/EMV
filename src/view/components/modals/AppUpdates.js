import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Spinner, Checkmark } from 'components/interface';
import { Warning } from 'view/icons';
import useUpdates, {
  checkForUpdates,
  downloadUpdate,
  quitAndInstall,
  resetUpdates,
} from 'actions/updates';
import styles from './AppUpdates.less';

export default function AppUpdates({ onClose }) {
  const { t } = useTranslation();
  const { status, checked, hasUpdate, downloadComplete, downloadProgress, updateInfo } = useUpdates(
    state => state,
  );

  function handleInstall() {
    quitAndInstall();
  }

  function handleDownload() {
    downloadUpdate();
  }

  function getMessage() {
    if (status === 'error') {
      return t('error.checkUpdateError');
    }
    if (status === 'downloading') {
      return `${t('error.downloadingUpdate')} ${~~downloadProgress}%`;
    }
    if (downloadComplete) {
      return t('error.updateReady', { version: updateInfo.version });
    }
    if (hasUpdate) {
      return t('error.updateAvailable', { version: updateInfo.version });
    }
    if (checked) {
      return t('error.latestVersion');
    }
    return t('modal.updates.checking');
  }

  function getIcon() {
    if (status === 'error') {
      return <Icon className={styles.icon} glyph={Warning} />;
    }
    if (checked && status === null) {
      return <Checkmark className={styles.icon} size={30} />;
    }

    return <Spinner className={styles.icon} size={30} />;
  }

  useEffect(() => {
    if (!checked) {
      setTimeout(() => checkForUpdates(), 1000);
    }

    return () => {
      resetUpdates();
    };
  }, []);

  return (
    <>
      <div className={styles.message}>
        {getIcon()}
        {getMessage()}
      </div>
      <div className={styles.buttons}>
        {hasUpdate && !downloadComplete && status !== 'downloading' && (
          <Button text={t('modal.updates.download')} onClick={handleDownload} />
        )}
        {downloadComplete && <Button text={t('modal.updates.restartAndInstall')} onClick={handleInstall} />}
        <Button
          className={styles.button}
          text={downloadComplete ? t('modal.updates.restartLater') : t('modal.updates.close')}
          onClick={onClose}
        />
      </div>
    </>
  );
}
