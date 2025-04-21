export async function createModel(inputShape, config = {}) {
      const model = tf.sequential();
        
          // Input layer
            model.add(tf.layers.dense({
                units: config.hiddenUnits || 64,
                    activation: 'relu',
                        inputShape: [inputShape]
                          }));
                            
                              // Optional dropout for regularization
                                if (config.dropoutRate) {
                                    model.add(tf.layers.dropout({ rate: config.dropoutRate }));
                                      }
                                        
                                          // Additional hidden layers
                                            for (let i = 0; i < (config.hiddenLayers || 1); i++) {
                                                model.add(tf.layers.dense({
                                                      units: config.hiddenUnits || 64,
                                                            activation: 'relu'
                                                                }));
                                                                  }
                                                                    
                                                                      // Output layer (configurable for binary/multi-class)
                                                                        model.add(tf.layers.dense({
                                                                            units: config.outputUnits || 1,
                                                                                activation: config.outputActivation || 'sigmoid'
                                                                                  }));
                                                                                    
                                                                                      model.compile({
                                                                                          optimizer: tf.train.adam(config.learningRate || 0.001),
                                                                                              loss: config.loss || 'binaryCrossentropy',
                                                                                                  metrics: ['accuracy']
                                                                                                    });
                                                                                                      
                                                                                                        return model;
                                                                                                        }