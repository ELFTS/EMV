import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/interface/Button';
import { Settings, Setting } from 'components/controls';
import Layout from 'components/layout/Layout';
import ButtonRow from 'components/layout/ButtonRow';
import useStage, { updateCanvas } from 'actions/stage';
import {
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
  MIN_CANVAS_WIDTH,
  MIN_CANVAS_HEIGHT,
} from 'view/constants';

export default function CanvasSettings({ onClose }) {
  const { t } = useTranslation();
  const stageConfig = useStage(state => state);
  const [state, setState] = useState(stageConfig);
  const { width, height, backgroundColor } = state;

  function handleChange(props) {
    setState({ ...state, ...props });
  }

  function handleCancel() {
    onClose();
  }

  async function handleSave() {
    await updateCanvas(width, height, backgroundColor);
    onClose();
  }

  return (
    <Layout width={500}>
      <Settings columns={['50%', '50%']} onChange={handleChange}>
        <Setting
          label={t('modal.canvas.width')}
          type="number"
          name="width"
          value={width}
          min={MIN_CANVAS_WIDTH}
          max={MAX_CANVAS_WIDTH}
          step={2}
        />
        <Setting
          label={t('modal.canvas.height')}
          type="number"
          name="height"
          value={height}
          min={MIN_CANVAS_HEIGHT}
          max={MAX_CANVAS_HEIGHT}
          step={2}
        />
        <Setting
          label={t('modal.canvas.backgroundColor')}
          type="color"
          name="backgroundColor"
          value={backgroundColor}
        />
      </Settings>
      <ButtonRow>
        <Button onClick={handleSave} text={t('modal.canvas.ok')} />
        <Button onClick={handleCancel} text={t('modal.canvas.cancel')} />
      </ButtonRow>
    </Layout>
  );
}
