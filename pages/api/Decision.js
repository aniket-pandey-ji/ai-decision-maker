import * as tf from '@tensorflow/tfjs-node';
import { createModel, trainModel } from '../../lib/decisionModel';

export default async function handler(req, res) {
  if (req.method === 'POST') {
      try {
            const { inputData, labels } = req.body;
                  
                        // Convert to tensors
                              const inputTensor = tf.tensor2d(inputData);
                                    const labelTensor = tf.tensor2d(labels);
                                          
                                                // Create and train model
                                                      const model = await createModel(inputData[0].length);
                                                            await trainModel(model, inputTensor, labelTensor);
                                                                  
                                                                        // Save model (in a real app, you'd save to disk or cloud)
                                                                              const savedModel = await model.save('localstorage://my-decision-model');
                                                                                    
                                                                                          res.status(200).json({ success: true, modelInfo: savedModel });
                                                                                              } catch (error) {
                                                                                                    res.status(500).json({ error: error.message });
                                                                                                        }
                                                                                                          } else {
                                                                                                              res.status(405).end(); // Method not allowed
                                                                                                                }
                                                                                                                }