import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { env } from 'view/global';
import MenuBar from 'components/nav/MenuBar';
import Icon from 'components/interface/Icon';
import WindowButtons from 'components/window/WindowButtons';
import useWindowState from 'hooks/useWindowState';
import { handleMenuAction } from 'actions/app';
import appIcon from 'view/assets/logo.svg';
import menuConfig from 'config/menu.json';
import styles from './TitleBar.less';

const menuKeyMap = {
  'File': 'menu.file',
  'New project': 'menu.newProject',
  'Open project...': 'menu.openProject',
  'Save project': 'menu.saveProject',
  'Save project as...': 'menu.saveProjectAs',
  'Load audio...': 'menu.loadAudio',
  'Save image...': 'menu.saveImage',
  'Save video...': 'menu.saveVideo',
  'Exit': 'menu.exit',
  'Edit': 'menu.edit',
  'Canvas': 'menu.canvas',
  'Settings': 'menu.settings',
  'View': 'menu.view',
  'Zoom in': 'menu.zoomIn',
  'Zoom out': 'menu.zoomOut',
  'Actual size': 'menu.actualSize',
  'Fit to screen': 'menu.fitToScreen',
  'Control dock': 'menu.controlDock',
  'Player': 'menu.player',
  'Help': 'menu.help',
  'Check for updates...': 'menu.checkForUpdates',
  'Developer tools': 'menu.developerTools',
  'About': 'menu.about',
};

function translateMenu(menu, t) {
  return menu.map(item => {
    const translated = { ...item };
    if (item.label && menuKeyMap[item.label]) {
      translated.label = t(menuKeyMap[item.label]);
    }
    if (item.submenu) {
      translated.submenu = translateMenu(item.submenu, t);
    }
    return translated;
  });
}

export default function TitleBar() {
  const { t, i18n } = useTranslation();
  const { focused, maximized } = useWindowState();

  const translatedMenu = useMemo(() => translateMenu(menuConfig, t), [t, i18n.language]);

  return (
    <div
      className={classNames(styles.titlebar, {
        [styles.focused]: focused,
      })}
    >
      <div className={styles.title}>{env.APP_NAME}</div>
      {!env.IS_MACOS && (
        <>
          <Icon className={styles.icon} glyph={appIcon} />
          <MenuBar items={translatedMenu} onMenuAction={handleMenuAction} focused={focused} />
          <WindowButtons focused={focused} maximized={maximized} />
        </>
      )}
    </div>
  );
}
