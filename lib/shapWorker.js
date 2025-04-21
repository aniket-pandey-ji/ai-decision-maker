export class SHAPWorker {
  constructor() {
      this.worker = new Worker(new URL('./shap.worker.js', import.meta.url));
          this.callbacks = {};
              
                  this.worker.onmessage = (e) => {
                        const { id, result, error } = e.data;
                              if (error) {
                                      this.callbacks[id].reject(error);
                                            } else {
                                                    this.callbacks[id].resolve(result);
                                                          }
                                                                delete this.callbacks[id];
                                                                    };
                                                                      }

                                                                        explain(model, backgroundData, input, numSamples = 50) {
                                                                            return new Promise((resolve, reject) => {
                                                                                  const id = Math.random().toString(36).substring(2, 9);
                                                                                        this.callbacks[id] = { resolve, reject };
                                                                                              
                                                                                                    // Send model weights and data to worker
                                                                                                          model.save().then(async (artifacts) => {
                                                                                                                  this.worker.postMessage({
                                                                                                                            id,
                                                                                                                                      artifacts,
                                                                                                                                                backgroundData,
                                                                                                                                                          input,
                                                                                                                                                                    numSamples
                                                                                                                                                                            });
                                                                                                                                                                                  });
                                                                                                                                                                                      });
                                                                                                                                                                                        }

                                                                                                                                                                                          terminate() {
                                                                                                                                                                                              this.worker.terminate();
                                                                                                                                                                                                }
                                                                                                                                                                                                }