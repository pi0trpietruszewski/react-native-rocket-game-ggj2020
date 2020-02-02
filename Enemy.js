import React  from 'react';
import {
  Animated,
  Easing,
} from 'react-native';

export default class Wall extends React.Component {
  state = {
    rotateAnim: new Animated.Value(0),
  };

  componentDidMount(): void {
    this.startAnimation();
  }

  startAnimation() {
    this.state.rotateAnim.setValue(0);
    Animated.timing(
      this.state.rotateAnim,
      {
        toValue: 1,
        duration: 7200,
        easing: Easing.linear,
      },
    ).start(() => {
      this.startAnimation();
    });
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;

    return (
      <Animated.Image

        source={require('./assets/enemy1.png')}
        style={
          {
            // backgroundColor:'red',
            resizeMode: 'cover',
            position: 'absolute',
            left: x,
            top: y,
            width: width,
            height: height,
            transform: [
              {
                rotate: this.state.rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    '0deg', '360deg',
                  ],
                }),
              },
            ],
          }
        }/>
    );
  }
}
