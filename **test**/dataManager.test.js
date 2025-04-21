import { DataManager } from '../lib/dataManager';

describe('Data Manager', () => {
  let dataManager;

    beforeEach(() => {
        dataManager = new DataManager();
          });

            it('should normalize data correctly', () => {
                dataManager.addExample([10, 20], 1);
                    dataManager.addExample([20, 40], 0);
                        
                            const { normalizedData } = dataManager.normalizeData();
                                expect(normalizedData.shape).toEqual([2, 2]);
                                    
                                        const normalized = normalizedData.arraySync();
                                            // Check mean is ~0 and std is ~1
                                                expect(Math.abs(normalized[0][0])).toBeCloseTo(1, 0.5);
                                                    expect(Math.abs(normalized[0][1])).toBeCloseTo(1, 0.5);
                                                      });
                                                      });