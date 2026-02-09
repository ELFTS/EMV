import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import shallow from 'zustand/shallow';
import { api, player } from 'global';
import { Settings, Setting } from 'components/controls';
import Layout from 'components/layout/Layout';
import Button from 'components/interface/Button';
import ButtonRow from 'components/layout/ButtonRow';
import TimeInfo from 'components/player/TimeInfo';
import { ButtonInput } from 'components/inputs';
import { replaceExt } from 'utils/file';
import { FolderOpen } from 'view/icons';
import useAudio, { openAudioFile } from 'actions/audio';
import { fitToScreen } from 'actions/stage';
import { startRender } from 'actions/video';
import styles from './VideoSettings.less';
import videoConfig from 'config/video.json';

const qualitySettings = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

function getVideoCodecs(t) {
  return Object.keys(videoConfig.codecs).map(key => ({
    label: t(`videoCodec.${key}`),
    value: key,
  }));
}

const initialState = {
  videoFile: '',
  codec: 'x264',
  fps: 60,
  quality: 'high',
  timeStart: 0,
  timeEnd: 0,
};

export default function VideoSettings({ onClose }) {
  const { t } = useTranslation();
  const [audioFile, duration] = useAudio(state => [state.file, state.duration], shallow);
  const [state, setState] = useState(initialState);
  const { videoFile, codec, fps, quality, timeStart, timeEnd } = state;
  const canStart = videoFile && audioFile && timeEnd - timeStart > 0;
  const videoCodecs = getVideoCodecs(t);

  useEffect(() => {
    player.stop();

    setState(state => ({
      ...state,
      audioFile,
      timeEnd: duration,
    }));
  }, []);

  function handleChange(props) {
    if (props.codec && videoFile) {
      const { extension } = videoConfig.codecs[props.codec].video;

      props.videoFile = replaceExt(videoFile, `.${extension}`);
    }

    setState(state => ({ ...state, ...props }));
  }

  function handleCancel() {
    onClose();
  }

  function handleStart() {
    startRender({ ...state, audioFile });
    fitToScreen();
    onClose();
  }

  async function handleOpenVideoFile() {
    const { extension } = videoConfig.codecs[codec].video;

    const { filePath, canceled } = await api.showSaveDialog({
      defaultPath: `video-${Date.now()}.${extension}`,
    });

    if (!canceled) {
      setState(state => ({ ...state, videoFile: replaceExt(filePath, `.${extension}`) }));
    }
  }

  async function handleOpenAudioFile() {
    await openAudioFile(false);

    const duration = player.getDuration();

    setState(state => ({
      ...state,
      timeStart: 0,
      timeEnd: Math.ceil(duration),
    }));
  }

  return (
    <Layout width={700}>
      <Settings columns={['40%', '60%']} onChange={handleChange}>
        <Setting
          label={t('modal.video.saveTo')}
          type="text"
          name="videoFile"
          width={300}
          value={videoFile}
          readOnly
        >
          <ButtonInput
            className={styles.button}
            icon={FolderOpen}
            title={t('modal.video.saveTo')}
            onClick={handleOpenVideoFile}
          />
        </Setting>
        <Setting
          label={t('modal.video.audioFile')}
          type="text"
          name="audioFile"
          width={300}
          value={audioFile}
          readOnly
        >
          <ButtonInput
            className={styles.button}
            icon={FolderOpen}
            title={t('modal.video.audioFile')}
            onClick={handleOpenAudioFile}
          />
        </Setting>
        <Setting label={t('modal.video.encoder')} type="select" name="codec" items={videoCodecs} value={codec} />
        <Setting
          label={t('modal.video.quality')}
          type="select"
          name="quality"
          items={qualitySettings}
          value={quality}
        />
        <Setting label={t('modal.video.fps')} type="number" name="fps" min={1} max={60} value={fps} />
        <Setting
          label={t('modal.video.startTime')}
          type="time"
          name="timeStart"
          width={80}
          min={0}
          max={timeEnd}
          value={timeStart}
          disabled={!audioFile}
        />
        <Setting
          label={t('modal.video.endTime')}
          type="time"
          name="timeEnd"
          width={80}
          min={0}
          max={duration}
          value={timeEnd}
          disabled={!audioFile}
        />
        <Setting label={t('modal.video.totalTime')}>
          <TimeInfo currentTime={timeEnd - timeStart} totalTime={duration} />
        </Setting>
      </Settings>
      <ButtonRow>
        <Button text={t('modal.video.start')} onClick={handleStart} disabled={!canStart} />
        <Button text={t('modal.video.cancel')} onClick={handleCancel} />
      </ButtonRow>
    </Layout>
  );
}
