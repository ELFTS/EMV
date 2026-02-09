import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from 'global';
import Button from 'components/interface/Button';
import ButtonRow from 'components/layout/ButtonRow';
import Layout from 'components/layout/Layout';
import { Settings, Setting } from 'components/controls';
import useConfig, { saveConfig } from 'actions/config';

const languageOptions = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en' },
];

export default function AppSettings({ onClose }) {
  const { t, i18n } = useTranslation();
  const appConfig = useConfig(state => state);
  const [state, setState] = useState(appConfig);
  const { checkForUpdates, autoUpdate, autoPlayAudio, language = i18n.language } = state;

  function handleChange(props) {
    setState(state => ({ ...state, ...props }));
  }

  async function handleSave() {
    if (state.language && state.language !== i18n.language) {
      await i18n.changeLanguage(state.language);
      await api.invoke('change-language', state.language);
    }
    await saveConfig(state);
    onClose();
  }

  return (
    <Layout width={500}>
      <Settings label={t('modal.settings.general')} columns={['60%', '40%']} onChange={handleChange}>
        <Setting
          label={t('modal.settings.language')}
          type="select"
          name="language"
          items={languageOptions}
          value={language}
        />
        <Setting
          label={t('modal.settings.checkUpdatesOnStartup')}
          type="checkbox"
          name="checkForUpdates"
          value={checkForUpdates}
        />
        <Setting
          label={t('modal.settings.autoDownloadUpdates')}
          type="checkbox"
          name="autoUpdate"
          value={autoUpdate}
        />
      </Settings>
      <Settings label={t('modal.settings.audio')} columns={['60%', '40%']} onChange={handleChange}>
        <Setting
          label={t('modal.settings.playAudioOnLoad')}
          type="checkbox"
          name="autoPlayAudio"
          value={autoPlayAudio}
        />
      </Settings>
      <ButtonRow>
        <Button text={t('modal.settings.save')} onClick={handleSave} />
        <Button text={t('modal.settings.cancel')} onClick={onClose} />
      </ButtonRow>
    </Layout>
  );
}
