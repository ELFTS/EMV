import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import CanvasMeter from 'canvas/CanvasMeter';
import Button from 'components/interface/Button';
import { formatTime } from 'utils/format';
import useVideo, { stopRender } from 'actions/video';
import { PRIMARY_COLOR } from 'view/constants';
import styles from './RenderPanel.less';

const PROGRESS_MIN = 0.05;
const PROGRESS_THRESHHOLD = 0.1;

export default function RenderPanel({ onClose = () => {} }) {
  const { t } = useTranslation();
  const { finished, status, currentFrame, totalFrames, startTime } = useVideo();
  const elapsedTime = startTime ? (Date.now() - startTime) / 1000 : 0;
  const fps = elapsedTime > 0 ? currentFrame / elapsedTime : 0;
  const progress = totalFrames > 0 ? currentFrame / totalFrames : 0;
  const totalTime = currentFrame > 0 ? (totalFrames * elapsedTime) / currentFrame : null;
  const estimatedTotalTime =
    progress > PROGRESS_MIN ? ` / ${PROGRESS_THRESHHOLD && formatTime(totalTime)}` : '';
  const currentTotalTime = formatTime(elapsedTime);
  const canvas = useRef();
  const progressBar = useRef();

  function handleClose() {
    stopRender();
    onClose();
  }

  function draw() {
    progressBar.current.render(progress);
  }

  useEffect(() => {
    progressBar.current = new CanvasMeter(
      {
        width: 100,
        height: 5,
        color: PRIMARY_COLOR,
      },
      canvas.current,
    );
  }, []);

  useEffect(() => {
    draw();
  });

  return (
    <div className={classNames(styles.panel)}>
      <div className={styles.progress}>
        <canvas ref={canvas} className={styles.progressBar} />
      </div>
      <div className={styles.stats}>
        <div className={styles.row}>
          <Stat label={t('panel.progress')} value={`${~~(progress * 100)}%`} />
          <Stat label={t('panel.elapsedTime')} value={`${currentTotalTime}${estimatedTotalTime}`} />
          <Stat label={t('panel.frames')} value={`${~~currentFrame} / ${~~totalFrames}`} />
          <Stat label={t('panel.fps')} value={fps.toFixed(1)} />
          <Button text={finished ? t('modal.updates.close') : t('modal.video.cancel')} onClick={handleClose} />
        </div>
        <div className={styles.row}>
          <Stat label={t('panel.status')} value={status} />
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className={styles.info}>
    <span className={styles.label}>{label}</span>
    {value}
  </div>
);
