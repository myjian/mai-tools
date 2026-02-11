import {memo} from 'react';

interface SongImgProps {
  imgSrc?: string;
}

export const SongImg = memo(({imgSrc}: SongImgProps) => {
  return (
    <div className="songImgContainer">
      {imgSrc ? (
        <img className="songImg" src={imgSrc} alt="" />
      ) : (
        <div className="songImg songImgPlaceholder" />
      )}
      <div className="songImgReflecContainer">{getReflecElement(imgSrc)}</div>
    </div>
  );
});

function getReflecElement(imgSrc?: string) {
  if (imgSrc) {
    const style = {backgroundImage: `url("${imgSrc}")`};
    return <div className="songImgReflec" style={style}></div>;
  }
  return <div className="songImgPlaceholder songImgReflecPlaceholder" />;
}
