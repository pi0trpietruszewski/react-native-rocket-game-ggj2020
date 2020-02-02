import { randomPositionOfEnemy, randomSizes } from './enemyPosition';
import Matter from 'matter-js';
import { Constants } from './Constants';
import { Accelerometer, Gyroscope } from 'expo-sensors';

const Physics = (entities, { touches, time, ...rest }) => {
  let engine = entities.physics.engine;
  let bird = entities.bird.body;

  // touches.filter(t => t.type === 'press').forEach(t => {
  //   Matter.Body.applyForce(bird, bird.position, { y: 0.00, x: -0.10 });
  // });
  let _subscription = Accelerometer.addListener(gyroscopeData => {
    Matter.Body.applyForce(bird, bird.position, { y: 0.00, x: -gyroscopeData.x * 0.00005 });
  });

  for (let i = 1; i <= 8; i++) {
    // console.warn(JSON.stringify(entities['pipe' + i].body.position.y))
    if (entities['coin'].body.position.y >= Constants.MAX_HEIGHT) {
      let position = randomPositionOfEnemy();
      Matter.Body.setPosition(entities['coin'].body, {
        y: 0,
        x: position,
      });
    } else {
      Matter.Body.translate(entities['coin'].body, { y: 1, x: 0 });
    }
    if (entities['pipe' + i].body.position.y >= Constants.MAX_HEIGHT) {
      let position = randomPositionOfEnemy();
      let sizes = randomSizes();
      // setTimeout(() =>

      Matter.Body.setPosition(entities['pipe' + i].body, {
        y: 0,
        x: position,
      });
      // ), Math.random() * 40 * 1000);
    } else {
      Matter.Body.translate(entities['pipe' + i].body, { y: 2, x: 0 });
    }
  }

  Matter.Engine.update(engine, time.delta);
  if (entities.timer.size < Constants.GAMETIME) {
    entities.timer.size = [entities.timer.size[0] + 1];
  } else {
    rest.dispatch({ type: 'game-success' });
  }

  return entities;
};

export default Physics;
