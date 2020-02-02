import Coin from './Coin';
import Timer from './Timer';
import WallRight from './WallRight';
import { randomPositionOfEnemy, randomSizes } from './enemyPosition';
import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ImageBackground } from 'react-native';
import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';
import Bird from './Bird';
import Wall from './Wall';
import Enemy from './Enemy';
import Physics from './Physics';
import { Constants } from './Constants';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
// const startTimer = (callback) => {
//   const interval = setInterval(() => {
//     // this.width = this.width++;
//   }, 1000);
//   setTimeout(() => {
//     clearInterval(interval);
//     callback();
//   }, 20000);
//   return null;
// };

export default class App extends Component {
  constructor(props) {
    super(props);
    this.width = 0;

    this.state = {
      firstLaunch: true,
      running: false,
      success: false,
      points: 0,
    };

    this.gameEngine = null;

    // this.entities = this.setupWorld();
  }

  setupWorld = () => {
    activateKeepAwake();
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0;


    let bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 100, 27, 68, {
      isStatic: false,
      mass: 10,
    });
    bird.restitution = 20;
    let left = Matter.Bodies.rectangle(5, Constants.MAX_HEIGHT / 2, 1, Constants.MAX_HEIGHT, { isStatic: true });
    let right = Matter.Bodies.rectangle(Constants.MAX_WIDTH, Constants.MAX_HEIGHT / 2, 15, Constants.MAX_HEIGHT, { isStatic: true });
    // let right = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true });

    // let [pipe1Height, pipe2Height] = generatePipes();
    let sizes = [randomSizes(), randomSizes(), randomSizes(), randomSizes(), randomSizes(), randomSizes(), randomSizes(), randomSizes()];
    let pipe1 = Matter.Bodies.circle(randomPositionOfEnemy(), 30, sizes[0][0] - 30, { isStatic: true });
    let pipe2 = Matter.Bodies.circle(randomPositionOfEnemy(), -30, sizes[1][0] - 30, { isStatic: true });
    let pipe3 = Matter.Bodies.circle(randomPositionOfEnemy(), -100, sizes[2][0] - 30, { isStatic: true });
    let pipe4 = Matter.Bodies.circle(randomPositionOfEnemy(), -200, sizes[3][0] - 30, { isStatic: true });
    let pipe5 = Matter.Bodies.circle(randomPositionOfEnemy(), -200, sizes[4][0] - 30, { isStatic: true });
    let pipe6 = Matter.Bodies.circle(randomPositionOfEnemy(), -400, sizes[5][0] - 30, { isStatic: true });
    let pipe7 = Matter.Bodies.circle(randomPositionOfEnemy(), -700, sizes[6][0] - 30, { isStatic: true });
    let pipe8 = Matter.Bodies.circle(randomPositionOfEnemy(), -800, sizes[7][0] - 30, { isStatic: true });

    let coin = Matter.Bodies.circle(randomPositionOfEnemy(), -20, 27, {
      // isStatic: true,
      isSensor: true,
      mass: 0,
      label: 'coin',
    });
    // let pipe2 = Matter.Bodies.rectangle(Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe2Height / 2), Constants.PIPE_WIDTH, pipe2Height, { isStatic: true });
    let timer = Matter.Bodies.rectangle(0, 10, 27, 68, {
      isStatic: true,
      mass: 20,
    });

    // let [pipe3Height, pipe4Height] = generatePipes();

    // let pipe3 = Matter.Bodies.rectangle(Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), pipe3Height / 2, Constants.PIPE_WIDTH, pipe3Height, { isStatic: true });
    // let pipe4 = Matter.Bodies.rectangle(Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe4Height / 2), Constants.PIPE_WIDTH, pipe4Height, { isStatic: true });

    Matter.World.add(world, [bird, pipe1, pipe2, pipe3, pipe4, coin, left, right]);
    // const timeout = startTimer(() => {
    //     this.gameEngine.dispatch({ type: 'game-success' });
    //   },
    // );

    Matter.Events.on(engine, 'collisionStart', (event) => {
      debugger
      if (event.pairs[0].bodyB.label === 'coin') {
        this.gameEngine.dispatch({ type: 'point-collected' });
        let position = randomPositionOfEnemy();
        Matter.Body.setPosition(this.entities['coin'].body, {
          y: 0,
          x: position,
        });
      } else {
        this.gameEngine.dispatch({ type: 'game-over' });
      }
    });

    return {
      physics: { engine: engine, world: world },
      left: { body: left, size: [90, Constants.MAX_HEIGHT], renderer: Wall },
      right: { body: right, size: [120, Constants.MAX_HEIGHT], renderer: WallRight },
      bird: { body: bird, size: [35, 75], renderer: Bird },
      pipe1: { body: pipe1, size: sizes[0], renderer: Enemy },
      pipe2: { body: pipe2, size: sizes[1], renderer: Enemy },
      pipe3: { body: pipe3, size: sizes[2], renderer: Enemy },
      pipe4: { body: pipe4, size: sizes[3], renderer: Enemy },
      pipe5: { body: pipe5, size: sizes[4], renderer: Enemy },
      pipe6: { body: pipe6, size: sizes[5], renderer: Enemy },
      pipe7: { body: pipe7, size: sizes[6], renderer: Enemy },
      pipe8: { body: pipe8, size: sizes[7], renderer: Enemy },
      coin: { body: coin, size: [30, 30], renderer: Coin },
      timer: { body: timer, size: [0], renderer: Timer },
      // pipe2: { body: pipe2, size: [randomSize(), randomSize()], color: 'green', renderer: Wall },
      // pipe3: { body: pipe3, size: [randomSize(), randomSize()], color: 'green', renderer: Wall },
      // pipe4: { body: pipe4, size: [randomSize(), randomSize()], color: 'green', renderer: Wall },
    };
  };

  onEvent = (e) => {
    if (e.type === 'game-over') {
      //Alert.alert("Game Over");
      deactivateKeepAwake();
      this.setState({
        running: false,
      });
    }
    if (e.type === 'game-success') {
      //Alert.alert("Game Over");
      deactivateKeepAwake();
      this.setState({
        running: false, success: true,
      });
    }
    if (e.type === 'point-collected') {
      //Alert.alert("Game Over");
      let points = this.state.points + 1;
      this.setState({
        points: points,
      });
    }

  };

  start = () => {
    this.entities = this.setupWorld();
    this.gameEngine.swap(this.entities);
    this.setState({
      running: true, success: false, points: 0, firstLaunch: false,
    });
  };
  reset = () => {
    this.entities = this.setupWorld();
    this.gameEngine.swap(this.entities);
    this.setState({
      running: true, success: false, points: 0,
    });
  };

  render() {
    return (
      <ImageBackground source={require('./assets/bg.png')} style={{ width: '100%', height: '100%' }}>
        <View style={styles.container}>
          <GameEngine
            ref={(ref) => {
              this.gameEngine = ref;
            }}
            style={styles.gameContainer}
            systems={[Physics]}
            running={this.state.running}
            onEvent={this.onEvent}
            entities={this.entities}>
            <StatusBar hidden={true}/>
          </GameEngine>
          <Text style={styles.points}>{this.state.points}</Text>
          {(!this.state.running && !this.state.firstLaunch) && (!this.state.success ?
            <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
              <ImageBackground style={styles.fullScreen} source={require('./assets/lose.jpg')}>
                <Text style={styles.gameOverText}>Game Over</Text>
                <Text style={styles.gameOverText}>Your spaceship is destroyed!</Text>
                <Text style={styles.gameOverText}>Points: {this.state.points}</Text>
                <Text style={styles.gameOverText}>Tap to try again</Text>
              </ImageBackground>
            </TouchableOpacity> : <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
              <ImageBackground style={styles.fullScreen} source={require('./assets/success.png')}>
                <Text style={styles.gameOverText}>Winner</Text>
                <Text style={styles.gameOverText}>You have fixed satellite</Text>
                <Text style={styles.gameOverText}>Points: {this.state.points}</Text>
              </ImageBackground>

            </TouchableOpacity>)}

          {this.state.firstLaunch &&
          <TouchableOpacity style={styles.fullScreenButton} onPress={this.start}>

            <ImageBackground style={styles.fullScreen} source={require('./assets/start.jpg')}>
              <Text style={styles.gameOverText}>BestGameEver</Text>
              <Text style={styles.gameOverText}>Tap to launch</Text>
              <Text style={styles.gameOverText}>your rocket!</Text>


            </ImageBackground>
          </TouchableOpacity>}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameOverText: {
    color: 'white',
    textAlign:'center',
    fontSize: 48,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  points: {
    position: 'absolute',
    color: 'white',
    top: 10,
    left: 10,
    fontSize: 20,

  },
});
