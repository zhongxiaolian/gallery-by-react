require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imageDatas = require('../data/imagesData.json');

imageDatas = (function generatorImageURL(imageArr){
  for(var i=0,j=imageArr.length;i<j;i++){
    var singleImageData = imageArr[i];
    singleImageData.imgURL = require("../images/"+singleImageData.fileName);
    imageArr[i] = singleImageData;
  }
  return imageArr;
})(imageDatas)

console.log(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
