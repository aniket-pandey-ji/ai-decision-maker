import { useState } from 'react';
import DecisionInput from '../components/DecisionInput';
import ModelVersionControl from '../components/ModelVersionControl';
import { ModelManager } from '../lib/modelManager';
import RealtimeTraining from '../components/RealtimeTraining';


export default function Home() {
  const [decision, setDecision] = useState(null);
  const [lastInputs, setLastInputs] = useState([]);
    const [trainingData, setTrainingData] = useState([]);
      const [trainingLabels, setTrainingLabels] = useState([]);
        const [modelManager] = useState(new ModelManager());

          const addTrainingExample = (inputs, label) => {
              setTrainingData([...trainingData, inputs]);
                  setTrainingLabels([...trainingLabels, [label]]);
                    };
                      
                        const trainModel = async () => {
                            const response = await fetch('/api/decision', {
                                  method: 'POST',
                                        headers: {
                                                'Content-Type': 'application/json',
                                                      },
                                                            body: JSON.stringify({
                                                                    inputData: trainingData,
                                                                            labels: trainingLabels
                                                                                  }),
                                                                                      });


                                                                                      const handleSubmit = async () => {
                                                                                          const model = await tf.loadLayersModel('localstorage://my-decision-model');
                                                                                            const inputTensor = tf.tensor2d([inputValues]);
                                                                                              setLastInputs(inputValues); // Store for feedback
                                                                                                
                                                                                                  const prediction = model.predict(inputTensor);
                                                                                                    const result = await prediction.data();
                                                                                                      onPredict(result[0]);
                                                                                                      };
                                                                                      
                                                                                          const result = await response.json();
                                                                                              console.log('Training complete:', result);
                                                                                                };
                                                                                                  
                                                                                                    return (
                                                                                                        <div>
                                                                                                              <h1>AI Decision Maker</h1>
                                                                                                                    
                                                                                                                          <section>
                                                                                                                                  <h2>Make a Decision</h2>
                                                                                                                                          <DecisionInput onPredict={(confidence) => setDecision(confidence)} />
                                                                                                                                                  {decision !== null && (
                                                                                                                                                            <p>Decision confidence: {(decision * 100).toFixed(1)}%</p>
                                                                                                                                                                    )}

                                                                                                                                                                    <section>
                                                                                                                                                                        <h2>Continuous Learning</h2>
                                                                                                                                                                          <RealtimeTraining 
                                                                                                                                                                              modelManager={modelManager}
                                                                                                                                                                                  dataManager={dataManager}
                                                                                                                                                                                    />
                                                                                                                                                                                    </section>
                                                                                                                                                                         
                                                                                                                                                                         <section>
                                                                                                                                                                            <h2>Model Version Control</h2>
                                                                                                                                                                              <ModelVersionControl dataManager={dataManager} />
                                                                                                                                                                              </section>
                                                                                                                                                                         
                                                                                                                                                                          </section>
                                                                                                                                                                                
                                                                                                                                                                                      <section>
                                                                                                                                                                                              <h2>Train the Model</h2>
                                                                                                                                                                                                      <div>
                                                                                                                                                                                                                <DecisionInput 
                                                                                                                                                                                                                            onPredict={(confidence) => {
                                                                                                                                                                                                                                          const correctLabel = confirm('Was this decision correct?') ? 1 : 0;
                                                                                                                                                                                                                                                        addTrainingExample([...trainingData[0] || []], correctLabel);
                                                                                                                                                                                                                                                                    }}
                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                        <button onClick={trainModel} disabled={trainingData.length === 0}>
                                                                                                                                                                                                                                                                                                    Train Model ({trainingData.length} examples)
                                                                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                            </section>
                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                                                                                  }
