import * as tf from '@tensorflow/tfjs';

export async function createModel(inputShape) {
  const model = tf.sequential();
    
      model.add(tf.layers.dense({
          units: 64,
              activation: 'relu',
                  inputShape: [inputShape]
                    }));
                      
                        model.add(tf.layers.dense({
                            units: 32,
                                activation: 'relu'
                                  }));
                                    
                                      model.add(tf.layers.dense({
                                          units: 1,
                                              activation: 'sigmoid'
                                                }));
                                                  
                                                    model.compile({
                                                        optimizer: 'adam',
                                                            loss: 'binaryCrossentropy',
                                                                metrics: ['accuracy']
                                                                  });
                                                                    
                                                                      return model;
                                                                      }

                                                                      export async function trainModel(model, inputs, labels) {
                                                                        const history = await model.fit(inputs, labels, {
                                                                            epochs: 50,
                                                                                batchSize: 32,
                                                                                    validationSplit: 0.2
                                                                                      });
                                                                                        return history;
                                                                                        }