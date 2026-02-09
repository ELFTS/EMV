import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Option from 'components/controls/Option';
import useEntity from 'hooks/useEntity';
import { inputValueToProps } from 'utils/react';
import { resolve } from 'utils/object';
import styles from './Control.less';

const displayKeyMap = {
  'BarSpectrumDisplay': 'barSpectrum',
  'TextDisplay': 'text',
  'ImageDisplay': 'image',
  'ShapeDisplay': 'shape',
  'SoundWaveDisplay': 'soundWave',
  'WaveSpectrumDisplay': 'waveSpectrum',
  'GeometryDisplay': 'geometry',
};

const effectKeyMap = {
  'BloomEffect': 'bloom',
  'BlurEffect': 'blur',
  'GlowEffect': 'glow',
  'GlitchEffect': 'glitch',
  'MirrorEffect': 'mirror',
  'PixelateEffect': 'pixelate',
  'RGBShiftEffect': 'rgbShift',
  'ColorHalftoneEffect': 'colorHalftone',
  'DistortionEffect': 'distortion',
  'DotScreenEffect': 'dotScreen',
  'KaleidoscopeEffect': 'kaleidoscope',
  'LEDEffect': 'led',
};

const controlKeyMap = {
  'maxDecibels': 'maxDb',
  'minFrequency': 'minFrequency',
  'maxFrequency': 'maxFrequency',
  'barWidthAutoSize': 'barWidth',
  'barSpacingAutoSize': 'barSpacing',
  'color': 'barColor',
  'shadowColor': 'shadowColor',
  'shadowHeight': 'shadowHeight',
  'width': 'width',
  'height': 'height',
  'x': 'positionX',
  'y': 'positionY',
  'rotation': 'rotation',
  'opacity': 'opacity',
  'smoothingTimeConstant': 'smoothing',
  'barWidth': 'barWidth',
  'barSpacing': 'barSpacing',
  'size': 'size',
  'font': 'font',
  'italic': 'italic',
  'bold': 'bold',
  'zoom': 'zoom',
  'fill': 'fill',
  'stroke': 'stroke',
  'strokeWidth': 'strokeWidth',
  'lineWidth': 'lineWidth',
  'blendMode': 'blendMode',
  'amount': 'amount',
  'threshold': 'threshold',
  'type': 'type',
  'radius': 'radius',
  'brightness': 'brightness',
  'angle': 'angle',
  'intensity': 'intensity',
  'side': 'side',
  'offset': 'offset',
  'text': 'text',
  'src': 'src',
  'fixed': 'fixed',
  'shape': 'shape',
};

const mirrorSideOptions = [
  { labelKey: 'mirrorSide.leftToRight', value: 0 },
  { labelKey: 'mirrorSide.rightToLeft', value: 1 },
  { labelKey: 'mirrorSide.topToBottom', value: 2 },
  { labelKey: 'mirrorSide.bottomToTop', value: 3 },
];

export default function ControlWithI18n({ display, className, showHeader = true }) {
  const { t } = useTranslation();
  const {
    displayName,
    constructor: {
      config: { label, controls = {} },
    },
  } = display;

  const onChange = useEntity(display);

  function getTranslatedLabel() {
    const name = display.constructor.config.name;
    if (name.includes('Display')) {
      const key = displayKeyMap[name];
      return key ? t(`display.${key}`) : label;
    }
    if (name.includes('Effect')) {
      const key = effectKeyMap[name];
      return key ? t(`effect.${key}`) : label;
    }
    return label;
  }

  function translateOptionItems(name, option) {
    if (name === 'side' && display.constructor.config.name === 'MirrorEffect') {
      return mirrorSideOptions.map(opt => ({
        label: t(opt.labelKey),
        value: opt.value,
      }));
    }
    return option.items;
  }

  function translateOptionLabel(name, optionLabel) {
    const key = controlKeyMap[name];
    if (key) {
      return t(`control.${key}`);
    }
    return optionLabel;
  }

  function mapOption(name, option) {
    const props = {};

    for (const [propName, value] of Object.entries(option)) {
      if (propName === 'items') {
        props[propName] = translateOptionItems(name, option);
      } else if (propName === 'label') {
        props[propName] = translateOptionLabel(name, value);
      } else {
        props[propName] = resolve(value, [display]);
      }
    }

    return (
      <Option
        key={name}
        display={display}
        name={name}
        value={display.properties[name]}
        onChange={inputValueToProps(onChange)}
        {...props}
      />
    );
  }

  return (
    <div className={classNames(styles.control, className)}>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.title}>
            <div className={styles.label}>{getTranslatedLabel()}</div>
            <div className={styles.displayName}>{displayName}</div>
          </div>
        </div>
      )}
      {Object.keys(controls).map(key => mapOption(key, controls[key]))}
    </div>
  );
}
