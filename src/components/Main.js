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

class AppComponent extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        imgsArrangeArr : [
          {
            pos : {
              left : "0",
              top : "0"
            },
            rotate : 0,
            isInverse : false,
            isCenter:false
          }
        ]
      }
    }

  //组件加载完后为每个图片分配位置
  componentDidMount(){
    var stageDom = this.refs.stage;
    var stageHeight = stageDom.scrollHeight;
    var stageWidth = stageDom.scrollWidth;
    var halfStageWidth = Math.ceil(stageWidth/2);
    var halfStageHeight = Math.ceil(stageHeight/2);

    var imgFigure = this.refs.imgFigure0.refs.figure;
    var imgFigureHeight = imgFigure.scrollHeight;
    var imgFigureWidth = imgFigure.scrollWidth;
    var halfImgFigureWidth = Math.ceil(imgFigureWidth/2);
    var halfImgFigureHeight = Math.ceil(imgFigureHeight/2);

    //计算中心图片的位置点
    this.props.centerPos.left = halfStageWidth - halfImgFigureWidth;
    this.props.centerPos.top = halfStageHeight - halfImgFigureHeight;

    this.props.hPosRange.leftSecX[0] = 0-halfImgFigureWidth;
    this.props.hPosRange.leftSecX[1] = halfStageWidth - 3*halfImgFigureWidth;

    this.props.hPosRange.rightSecX[0] = halfStageWidth+halfImgFigureWidth;
    this.props.hPosRange.rightSecX[1] = stageWidth - halfImgFigureWidth;

    this.props.hPosRange.y[0] = 0-halfImgFigureHeight;
    this.props.hPosRange.y[1] = stageHeight - halfImgFigureHeight;

    this.props.vPosRange.y[0] = 0-halfImgFigureHeight;
    this.props.vPosRange.y[1] = halfStageHeight-halfImgFigureHeight*3;
    this.props.vPosRange.x[0] = halfStageWidth - imgFigureWidth;
    this.props.vPosRange.x[1] = halfStageWidth;

    this.arrange(0);
    console.log(this)
  }
  //闭包
  inverse(index){
    var _this = this;
    return function(){
      var imgsArrangeArr = _this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      _this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    };
  }
  //闭包
  center(index){
    var _this = this;
    return function(){
      _this.arrange(index)
    }
  }
  getRangeRandom(low,high){
    return Math.floor(Math.random()*(high-low)+low)
  }
  //获取0-30间的正负值
  get30DegRandom(){
    return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30);
  }
  arrange(centerIndex){
    var _this = this;

    var imgsArrangeArr = this.state.imgsArrangeArr;
    var centerPos = this.props.centerPos;
    var hPosRange = this.props.hPosRange;
    var vPosRange = this.props.vPosRange;

    var hPosRangeLeftSecx = hPosRange.leftSecX;
    var hPosRangeRightSecx = hPosRange.rightSecX;
    var hPosRangeY = hPosRange.y;

    var vPosRangeY = vPosRange.y;
    var vPosRangeX = vPosRange.x;

    var imgsArrangeTopArr = [];
    var topImgNum = Math.floor(Math.random()*2);
    var topImgSpliceIndex = 0;
    var imgArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
    //居中
    imgArrangeCenterArr[0].pos = centerPos;
    imgArrangeCenterArr[0].rotate = 0;
    imgArrangeCenterArr[0].isCenter = true;

    //上侧
    topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    imgsArrangeTopArr.forEach(function(data,index){
      imgsArrangeTopArr[index]={
        pos:{
          top : _this.getRangeRandom(vPosRangeY[0],vPosRangeY[1]),
          left: _this.getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate : _this.get30DegRandom(),
        isCenter : false
      }
    });
    //布局左右两侧的图片
    for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
      var hPosRangeLORX = null;
      if(i<k){
        hPosRangeLORX = hPosRangeLeftSecx;
      }else{
        hPosRangeLORX = hPosRangeRightSecx;
      }
      imgsArrangeArr[i]={
        pos:{
          left : _this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
          top : _this.getRangeRandom(hPosRangeY[0],hPosRangeY[1])
        },
        rotate : _this.get30DegRandom(),
        isCenter : false
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr : imgsArrangeArr
    });
  }


  render() {
    var _this = this;
    var controllerUnits = [];
    var imgFigures = [];
    imageDatas.forEach(function(data,index){

      if(!_this.state.imgsArrangeArr[index]){
        _this.state.imgsArrangeArr[index] = {
          pos : {
            left : 0,
            top : 0
          },
          rotate : 0,
          isInverse : false,
          isCenter : false
        }
      }
      imgFigures.push(<ImageFigure data={data} key={index} ref={'imgFigure'+index} arrange={_this.state.imgsArrangeArr[index]} inverse={_this.inverse(index).bind(this)}
        center={_this.center(index)} />)
      controllerUnits.push(<ControllerUnit key={index} arrange={_this.state.imgsArrangeArr[index]}
        inverse={_this.inverse(index)} center={_this.center(index)}/>);
    })
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}


AppComponent.defaultProps = {
  centerPos : {
    left : 0,
    top : 0
  },
  hPosRange : {
    leftSecX : [0,0],
    rightSecX : [0,0],
    y : [0,0]
  },
  vPosRange : {
    x : [0,0],
    y: [0,0]
  }
};

class ImageFigure extends React.Component{
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();

  }
  render(){
    var styleObj = {};
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    if(this.props.arrange.rotate){
      (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
        styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this))
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }
    var imgFigureClassName = "img-figure";
    imgFigureClassName+=this.props.arrange.isInverse?' is-inverse ':''
    return (
      <figure className={imgFigureClassName} ref="figure" style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imgURL}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

class ControllerUnit extends React.Component{
  handlerClick(e){
    //如果点击的是居中态的按钮，翻转图片，否则对应的图片居中。
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render(){
    var controllerUnitClassName = "controller-unit";
    //如果对应的是居中的图片，显示控制按钮的居中态。
    if(this.props.arrange.isCenter){
      controllerUnitClassName+=" is-center ";
      if(this.props.arrange.isInverse){
        controllerUnitClassName+= " is-inverse ";
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handlerClick.bind(this)}></span>
    )
  }
}
export default AppComponent;
