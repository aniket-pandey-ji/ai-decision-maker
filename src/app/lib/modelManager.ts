import * as tf from '@tensorflow/tfjs';
import { v4 as uuidv4 } from 'uuid';

export class ModelManager {
  constructor() {
      this.modelVersions = [];
          this.loadVersions();
            }
            
            // Add to modelManager.js
            async syncWithCloud(bucketName = 'your-bucket-name') {
              // List available models in cloud
                const cloudModels = await tf.io.listModels(`gs://${bucketName}/models`);
                  
                    // Download missing models
                      for (const cloudPath in cloudModels) {
                          const versionId = cloudPath.split('/').slice(-2, -1)[0];
                              const existsLocally = this.modelVersions.some(v => v.id === versionId);
                                  
                                      if (!existsLocally) {
                                            const localPath = `localstorage://model-${versionId}`;
                                                  await tf.io.copyModel(cloudPath, localPath);
                                                        
                                                              this.modelVersions.push({
                                                                      id: versionId,
                                                                              path: localPath,
                                                                                      cloudPath,
                                                                                              timestamp: cloudModels[cloudPath].dateSaved,
                                                                                                      isProduction: false
                                                                                                            });
                                                                                                                }
                                                                                                                  }
                                                                                                                    
                                                                                                                      this.persistVersions();
                                                                                                                      }
            async rollbackToVersion(versionId) {
                  const targetVersion = this.modelVersions.find(v => v.id === versionId);
                    if (!targetVersion) throw new Error('Version not found');
                      
                        //
            }

              async saveModel(model, metadata = {}) {
                  const versionId = uuidv4();
                      const savePath = `localstorage://model-${versionId}`;
                          const saveResult = await model.save(savePath);
                              
                                  const versionInfo = {
                                        id: versionId,
                                              path: savePath,
                                                    timestamp: new Date().toISOString(),
                                                          metrics: metadata.metrics || {},
                                                                trainingDataSize: metadata.trainingDataSize || 0,
                                                                      description: metadata.description || '',
                                                                            isProduction: metadata.isProduction || false
                                                                                };
                                                                                    
                                                                                        this.modelVersions.push(versionInfo);
                                                                                            this.persistVersions();
                                                                                                
                                                                                                    return versionInfo;
                                                                                                      }

                                                                                                        async loadModel(versionId) {
                                                                                                            const version = this.modelVersions.find(v => v.id === versionId);
                                                                                                                if (!version) throw new Error('Version not found');
                                                                                                                    
                                                                                                                        return await tf.loadLayersModel(version.path);
                                                                                                                          }

                                                                                                                            async compareModels(versionId1, versionId2, testData) {
                                                                                                                                const model1 = await this.loadModel(versionId1);
                                                                                                                                    const model2 = await this.loadModel(versionId2);
                                                                                                                                        
                                                                                                                                            const { xs, ys } = testData;
                                                                                                                                                const results = {};
                                                                                                                                                    
                                                                                                                                                        // Evaluate accuracy
                                                                                                                                                            results[versionId1] = {
                                                                                                                                                                  accuracy: (await model1.evaluate(xs, ys)[1].dataSync())[0]
                                                                                                                                                                      };
                                                                                                                                                                          
                                                                                                                                                                              results[versionId2] = {
                                                                                                                                                                                    accuracy: (await model2.evaluate(xs, ys)[1].dataSync())[0]
                                                                                                                                                                                        };
                                                                                                                                                                                            
                                                                                                                                                                                                // Compare prediction times
                                                                                                                                                                                                    const testInput = xs.slice(0, 1);
                                                                                                                                                                                                        const start1 = performance.now();
                                                                                                                                                                                                            await model1.predict(testInput).data();
                                                                                                                                                                                                                results[versionId1].predictionTime = performance.now() - start1;
                                                                                                                                                                                                                    
                                                                                                                                                                                                                        const start2 = performance.now();
                                                                                                                                                                                                                            await model2.predict(testInput).data();
                                                                                                                                                                                                                                results[versionId2].predictionTime = performance.now() - start2;
                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                        return results;
                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                            setProductionVersion(versionId) {
                                                                                                                                                                                                                                                this.modelVersions.forEach(v => {
                                                                                                                                                                                                                                                      v.isProduction = v.id === versionId;
                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                              this.persistVersions();
                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                  getProductionModel() {
                                                                                                                                                                                                                                                                      const prodVersion = this.modelVersions.find(v => v.isProduction);
                                                                                                                                                                                                                                                                          return prodVersion ? this.loadModel(prodVersion.id) : null;
                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                              loadVersions() {
                                                                                                                                                                                                                                                                                  const saved = localStorage.getItem('modelVersions');
                                                                                                                                                                                                                                                                                      if (saved) {
                                                                                                                                                                                                                                                                                            this.modelVersions = JSON.parse(saved);
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                    persistVersions() {
                                                                                                                                                                                                                                                                                                        localStorage.setItem('modelVersions', JSON.stringify(this.modelVersions));
                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                            // Cloud storage integration (example for Google Cloud)
                                                                                                                                                                                                                                                                                                              async saveToCloud(versionId, bucketName = 'your-bucket-name') {
                                                                                                                                                                                                                                                                                                                  const version = this.modelVersions.find(v => v.id === versionId);
                                                                                                                                                                                                                                                                                                                      if (!version) throw new Error('Version not found');
                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                              // Convert local storage model to cloud format
                                                                                                                                                                                                                                                                                                                                  const localArtifacts = await tf.io.listModels();
                                                                                                                                                                                                                                                                                                                                      const modelInfo = localArtifacts[version.path];
                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                              const cloudPath = `gs://${bucketName}/models/${versionId}/model.json`;
                                                                                                                                                                                                                                                                                                                                                  await tf.io.copyModel(
                                                                                                                                                                                                                                                                                                                                                        version.path,
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                      ...tf.io.fileSystem(version.path),
                                                                                                                                                                                                                                                                                                                                                                              modelPath: cloudPath
                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                version.cloudPath = cloudPath;
                                                                                                                                                                                                                                                                                                                                                                                                    this.persistVersions();
                                                                                                                                                                                                                                                                                                                                                                                                        return cloudPath;
                                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                                          }