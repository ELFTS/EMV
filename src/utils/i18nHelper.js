import i18n from '../i18n';

export function getDisplayLabel(key) {
  return i18n.t(`display.${key}`);
}

export function getEffectLabel(key) {
  return i18n.t(`effect.${key}`);
}

export function getControlLabel(key) {
  return i18n.t(`control.${key}`);
}

export function translateConfig(config, type) {
  const translated = { ...config };

  if (type === 'display' && config.label) {
    const key = config.name.replace('Display', '').toLowerCase();
    translated.label = i18n.t(`display.${key}`);
  }

  if (type === 'effect' && config.label) {
    const key = config.name.replace('Effect', '').toLowerCase();
    translated.label = i18n.t(`effect.${key}`);
  }

  if (config.controls) {
    translated.controls = {};
    Object.keys(config.controls).forEach(controlKey => {
      const control = { ...config.controls[controlKey] };
      if (control.label) {
        const i18nKey = controlKey
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, '');
        control.label = i18n.t(`control.${i18nKey}`) || control.label;
      }
      translated.controls[controlKey] = control;
    });
  }

  return translated;
}
