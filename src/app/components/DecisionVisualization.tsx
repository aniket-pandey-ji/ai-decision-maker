import { useEffect, useRef } from 'react';
import * as tfvis from '@tensorflow/tfjs-vis';

export default function DecisionVisualization({ inputValues, prediction }) {
  const surfaceRef = useRef(null);

    useEffect(() => {
        if (!surfaceRef.current || !inputValues) return;
            
                // Visualize feature importance
                    const features = inputValues.map((val, i) => ({
                          feature: `Factor ${i+1}`,
                                value: val
                                    }));
                                        
                                            tfvis.render.table(
                                                  { name: 'Input Features', tab: 'Decision Analysis' },
                                                        { headers: ['Feature', 'Value'], values: features }
                                                            );
                                                                
                                                                    // Visualize prediction confidence
                                                                        tfvis.render.barchart(
                                                                              { name: 'Decision Confidence', tab: 'Decision Analysis' },
                                                                                    [
                                                                                            { index: 0, value: 1 - prediction, label: 'No' },
                                                                                                    { index: 1, value: prediction, label: 'Yes' }
                                                                                                          ],
                                                                                                                { xLabel: 'Decision', yLabel: 'Confidence' }
                                                                                                                    );
                                                                                                                      }, [inputValues, prediction]);

                                                                                                                        return (
                                                                                                                            <div>
                                                                                                                                  <h3>Decision Analysis</h3>
                                                                                                                                        <div ref={surfaceRef} style={{ width: '100%', height: '400px' }} />
                                                                                                                                            </div>
                                                                                                                                              );
                                                                                                                                              }