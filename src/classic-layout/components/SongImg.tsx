import React from 'react';

interface SongImgProps {
  imgSrc?: string;
}
export class SongImg extends React.PureComponent<SongImgProps> {
  render() {
    const {imgSrc} = this.props;
    return (
      <div className="songImgContainer">
        {(
          imgSrc
          ? <img className="songImg" src={imgSrc} alt="" />
          : <div className="songImg songImgPlaceholder" />
        )}
        <div className="songImgReflecContainer">
          {this.getReflecElement(imgSrc)}
        </div>
      </div>
    );
  }
  
  private getReflecElement(imgSrc?: string) {
    if (imgSrc) {
      const style = {backgroundImage: `url("${imgSrc}")`};
      return <div className="songImgReflec" style={style}></div>;
    }
    return <div className="songImgPlaceholder songImgReflecPlaceholder" />;
  }
}
