import { Menu } from 'electron';
import { sendMessage } from 'main/window';
import { t } from './i18n';

function getMenuConfig() {
  return [
    {
      label: t('menu.file'),
      submenu: [
        {
          label: t('menu.newProject'),
          action: 'new-project',
        },
        {
          label: t('menu.openProject'),
          action: 'open-project',
        },
        {
          label: t('menu.saveProject'),
          action: 'save-project',
        },
        {
          label: t('menu.saveProjectAs'),
          action: 'save-project-as',
        },
        {
          type: 'separator',
        },
        {
          label: t('menu.loadAudio'),
          action: 'load-audio',
        },
        {
          label: t('menu.saveImage'),
          action: 'save-image',
        },
        {
          label: t('menu.saveVideo'),
          action: 'save-video',
        },
        {
          type: 'separator',
        },
        {
          label: t('menu.exit'),
          role: 'quit',
          action: 'exit',
        },
      ],
    },
    {
      label: t('menu.edit'),
      submenu: [
        {
          label: t('menu.canvas'),
          action: 'edit-canvas',
        },
        {
          label: t('menu.settings'),
          action: 'edit-settings',
        },
      ],
    },
    {
      label: t('menu.view'),
      submenu: [
        {
          label: t('menu.zoomIn'),
          action: 'zoom-in',
        },
        {
          label: t('menu.zoomOut'),
          action: 'zoom-out',
        },
        {
          label: t('menu.actualSize'),
          action: 'zoom-reset',
        },
        {
          label: t('menu.fitToScreen'),
          action: 'zoom-fit',
        },
        {
          type: 'separator',
        },
        {
          label: t('menu.controlDock'),
          type: 'checkbox',
          checked: true,
          action: 'view-control-dock',
        },
        {
          label: t('menu.player'),
          type: 'checkbox',
          checked: true,
          action: 'view-player',
        },
      ],
    },
    {
      label: 'Developer',
      hidden: true,
      submenu: [
        {
          label: 'Reload',
          role: 'reload',
          accelerator: 'CmdOrCtrl+R',
        },
      ],
    },
    {
      label: t('menu.help'),
      submenu: [
        {
          label: t('menu.checkForUpdates'),
          action: 'check-for-updates',
        },
        {
          label: t('menu.developerTools'),
          action: 'open-dev-tools',
          role: 'toggledevtools',
          accelerator: 'CmdOrCtrl+Shift+I',
        },
        {
          label: t('menu.about'),
          action: 'about',
        },
      ],
    },
  ];
}

export default function init() {
  const { setApplicationMenu, buildFromTemplate } = Menu;
  let menu = getMenuConfig();

  if (process.env.NODE_ENV === 'production') {
    menu = menu.filter(item => !item.hidden);
  }

  function executeAction({ action }) {
    sendMessage('menu-action', action);
  }

  menu.forEach(menuItem => {
    if (menuItem.submenu) {
      menuItem.submenu.forEach(item => {
        if (item.action && !item.role) {
          item.click = executeAction;
        }
      });
    }
  });

  setApplicationMenu(buildFromTemplate(menu));
}

export function rebuildMenu() {
  init();
}
