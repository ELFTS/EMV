import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import Icon from 'components/interface/Icon';
import { raiseError } from 'actions/error';
import { ignoreEvents } from 'utils/react';
import { api } from 'view/global';
import { FolderOpen, Times } from 'view/icons';
import { BLANK_IMAGE } from 'view/constants';
import styles from './ImageInput.less';

export default function ImageInput({ name, value, onChange }) {
  const image = useRef();
  const hasImage = value !== BLANK_IMAGE;

  useEffect(() => {
    // 当 value 改变时，确保图片正确加载
    if (image.current && value && value !== BLANK_IMAGE && image.current.src !== value) {
      image.current.src = value;
    }
  }, [value]);

  function handleImageLoad() {
    // 确保图片完全加载并且有正确的尺寸
    if (image.current && image.current.complete && image.current.naturalWidth > 0) {
      onChange(name, image.current);
    }
  }

  function loadImageSrc(src) {
    if (image.current && image.current.src !== src) {
      image.current.src = src;
    }
  }

  // 加载图片并确保获取正确的尺寸
  function loadImageWithDimensions(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = dataUrl;
    });
  }

  async function loadImageFile(file) {
    try {
      const dataUrl = await api.readImageFile(file);
      // 创建新的 Image 对象并等待加载完成，确保获取正确尺寸
      const loadedImage = await loadImageWithDimensions(dataUrl);
      // 同时更新预览图
      if (image.current) {
        image.current.src = dataUrl;
      }
      // 传递已加载完成的图片对象
      onChange(name, loadedImage);
    } catch (error) {
      raiseError('Invalid image file.', error);
    }
  }

  async function handleDrop(e) {
    e.preventDefault();

    await loadImageFile(e.dataTransfer.files[0].path);
  }

  async function handleClick() {
    const { filePaths, canceled } = await api.showOpenDialog();

    if (!canceled) {
      await loadImageFile(filePaths[0]);
    }
  }

  function handleDelete() {
    loadImageSrc(BLANK_IMAGE);
  }

  return (
    <>
      <div
        className={styles.image}
        onDrop={handleDrop}
        onDragOver={ignoreEvents}
        onClick={handleClick}
      >
        <img
          ref={image}
          className={classNames(styles.img, {
            [styles.hidden]: !hasImage,
          })}
          src={value}
          alt=""
          onLoad={handleImageLoad}
        />
        <Icon className={styles.openIcon} glyph={FolderOpen} title="Open File" />
      </div>
      {hasImage && (
        <Icon
          className={classNames({
            [styles.closeIcon]: true,
          })}
          glyph={Times}
          title="Remove Image"
          onClick={handleDelete}
        />
      )}
    </>
  );
}
