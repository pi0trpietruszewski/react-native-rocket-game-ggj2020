import { Constants } from './Constants';
import React, { Component } from 'react';
import { Image } from 'react-native';

export default class Wall extends Component {
  render() {
    const width = this.props.size[0];
    const percent = `${width / Constants.GAMETIME*100}%`;
    return (
      <Image

        source={require('./assets/loader.png')}
        style={{
          resizeMode: 'stretch',
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: percent,
          height: 50,
          // backgroundColor: this.props.color,
        }}/>
    );
  }
}
