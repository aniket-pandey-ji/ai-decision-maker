import * as tf from '@tensorflow/tfjs';

export class DataManager {
  constructor(featureName =[]) {
    this.featuresNames = featureNames;
      this.trainingData = [];
          this.trainingLabels = [];
              this.normalizationParams = null;
                }

                  addExample(inputs, label) {
                      this.trainingData.push(inputs);
                          this.trainingLabels.push(label);
                            }

                              normalizeData() {
                                  const dataTensor = tf.tensor2d(this.trainingData);
                                      const { mean, variance } = tf.moments(dataTensor, 0);
                                          
                                              this.normalizationParams = {
                                                    mean: mean.arraySync(),
                                                          std: tf.sqrt(variance).arraySync()
                                                              };
                                                                  
                                                                      const normalizedData = dataTensor.sub(mean).div(tf.sqrt(variance));
                                                                          return {
                                                                                normalizedData,
                                                                                      labels: tf.tensor2d(this.trainingLabels)
                                                                                          };
                                                                                            }

                                                                                            getFeatureName(index) {
                                                                                                  return this.featureNames[index] || `Feature ${index + 1}`;
                                                                                                    }
                                                                                            
  normalizeSingleInput(input) {
      if (!this.normalizationParams) return {
            values: input,
                  names: this.featureNames
                      };
                          
                              const normalized = input.map((val, i) => 
                                    (val - this.normalizationParams.mean[i]) / this.normalizationParams.std[i]
                                        );
                                            
                                                return {
                                                      values: normalized,
                                                            names: this.featureNames
                                                                };
                                                                  }
                                                                  

                                                                                                                        saveToLocalStorage() {
                                                                                                                            localStorage.setItem('decisionData', JSON.stringify({
                                                                                                                                  data: this.trainingData,
                                                                                                                                        labels: this.trainingLabels,
                                                                                                                                              params: this.normalizationParams
                                                                                                                                                  }));
                                                                                                                                                    }

                                                                                                                                                      loadFromLocalStorage() {
                                                                                                                                                          const saved = JSON.parse(localStorage.getItem('decisionData'));
                                                                                                                                                              if (saved) {
                                                                                                                                                                    this.trainingData = saved.data || [];
                                                                                                                                                                          this.trainingLabels = saved.labels || [];
                                                                                                                                                                                this.normalizationParams = saved.params;
                                                                                                                                                                                    }
                                                                                                                                                                                      }
                                                                                                                                                                                      }