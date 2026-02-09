import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel, Tab } from 'components/layout/TabPanel';
import { library } from 'view/global';
import styles from './ControlPicker.less';

const types = ['displays', 'effects'];

export default function ControlPicker({ type, onSelect, onClose }) {
  const { t } = useTranslation();

  function handleClick(item) {
    onSelect(item);
    onClose();
  }

  function hideImage(e) {
    e.target.style.display = 'none';
  }

  const getTranslatedLabel = (item) => {
    const { config } = item;
    const { name, label } = config;

    if (name.includes('Display')) {
      const key = name.replace('Display', '').toLowerCase();
      return t(`display.${key}`);
    }
    if (name.includes('Effect')) {
      const key = name.replace('Effect', '').toLowerCase();
      return t(`effect.${key}`);
    }
    return label;
  };

  const Catalog = ({ items }) => {
    return Object.keys(items).map((key, index) => {
      const item = items[key];
      const {
        config: { icon },
      } = item;
      const label = getTranslatedLabel(item);

      return (
        <div key={index} className={styles.item}>
          <div className={styles.image} onClick={() => handleClick(item)}>
            <img
              src={icon || 'images/controls/Plugin.png'}
              alt={label}
              onError={hideImage}
            />
          </div>
          <div className={styles.name}>{label}</div>
        </div>
      );
    });
  };

  return (
    <TabPanel className={styles.panel} tabPosition="left" activeIndex={types.indexOf(type)}>
      <Tab name={t('panel.layers')} contentClassName={styles.picker}>
        <Catalog items={library.get('displays')} />
      </Tab>
      <Tab name={t('panel.controls')} contentClassName={styles.picker}>
        <Catalog items={library.get('effects')} />
      </Tab>
    </TabPanel>
  );
}
