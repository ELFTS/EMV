import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ignoreEvents } from 'utils/react';
import Layout from 'components/layout/Layout';
import Modals from 'components/window/Modals';
import Preload from 'components/window/Preload';
import StatusBar from 'components/window/StatusBar';
import TitleBar from 'components/window/TitleBar';
import ControlDock from 'components/panels/ControlDock';
import ReactorPanel from 'components/panels/ReactorPanel';
import Player from 'components/player/Player';
import Stage from 'components/stage/Stage';
import { initApp } from 'actions/app';
import configStore from 'actions/config';
import { api } from 'view/global';
import i18n from '../../i18n';

function App() {
  const { i18n: i18nInstance } = useTranslation();

  async function init() {
    await initApp();

    // Load saved language preference
    const config = configStore.getState();
    if (config && config.language) {
      await i18nInstance.changeLanguage(config.language);
      await api.invoke('change-language', config.language);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout direction="column" onDrop={ignoreEvents} onDragOver={ignoreEvents} full>
      <Preload />
      <TitleBar />
      <Layout direction="row">
        <Layout id="viewport" direction="column">
          <Stage />
          <Player />
          <ReactorPanel />
        </Layout>
        <ControlDock />
      </Layout>
      <StatusBar />
      <Modals />
    </Layout>
  );
}

export default App;
