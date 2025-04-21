import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function DecisionInput({ onPredict }) {
  const [inputValues, setInputValues] = useState(Array(5).fill(0));
    
      const handleChange = (index, value) => {
          const newValues = [...inputValues];
              newValues[index] = parseFloat(value) || 0;
                  setInputValues(newValues);
                    };
                      
                        const handleSubmit = async () => {
                            const model = await tf.loadLayersModel('localstorage://my-decision-model');
                                const inputTensor = tf.tensor2d([inputValues]);
                                    const prediction = model.predict(inputTensor);
                                        const result = await prediction.data();
                                            onPredict(result[0]);
                                              };
                                                
                                                  return (
                                                      <div>
                                                            {inputValues.map((val, i) => (
                                                                    <div key={i}>
                                                                              <label>Factor {i+1}: </label>
                                                                                        <input 
                                                                                                    type="number" 
                                                                                                                value={val}
                                                                                                                            onChange={(e) => handleChange(i, e.target.value)}
                                                                                                                                      />
                                                                                                                                              </div>
                                                                                                                                                    ))}
                                                                                                                                                          <button onClick={handleSubmit}>Make Decision</button>
                                                                                                                                                              </div>
                                                                                                                                                                );
                                                                                                                                                                }