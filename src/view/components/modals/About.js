import React from 'react';
import { useTranslation } from 'react-i18next';
import { env } from 'global';
import Button from 'components/interface/Button';
import styles from './About.less';

const { APP_NAME, APP_VERSION } = env;

export default function About({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className={styles.about}>
      <div className={styles.name}>{APP_NAME}</div>
      <div className={styles.version}>{`${t('modal.about.version')} ${APP_VERSION}`}</div>
      <div className={styles.copyright}>{`${t('modal.about.copyright')} \u00A9 Mike Cao`}</div>
      <div className={styles.buttons}>
        <Button text={t('modal.about.close')} onClick={onClose} />
      </div>
    </div>
  );
}
