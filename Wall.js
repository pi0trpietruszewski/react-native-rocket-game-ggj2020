import React, { PureComponent } from 'react';
import { Image } from 'react-native';

export default class Wall extends PureComponent {
  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2 + 20;
    const y = this.props.body.position.y - height / 2;

    return (
      <Image

        source={require('./assets/wall-left.png')}
        style={{
          resizeMode: 'contain',
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: height,
          // backgroundColor: this.props.color,
        }}/>
    );
  }
}
