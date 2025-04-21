import * as tf from '@tensorflow/tfjs';
import { createModel, trainModel } from '../lib/decisionModel';

describe('Decision Model', () => {
  it('should create a model with correct architecture', async () => {
      const model = await createModel(5);
          expect(model.layers.length).toBe(3);
              expect(model.inputs[0].shape).toEqual([null, 5]);
                  expect(model.outputs[0].shape).toEqual([null, 1]);
                    });

                      it('should train on synthetic data', async () => {
                          const model = await createModel(3);
                              const xs = tf.tensor2d([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
                                  const ys = tf.tensor2d([[1], [0], [1]]);
                                      
                                          const history = await trainModel(model, xs, ys);
                                              expect(history.history.loss.length).toBeGreaterThan(0);
                                                  expect(history.history.acc.length).toBeGreaterThan(0);
                                                    });
                                                    });