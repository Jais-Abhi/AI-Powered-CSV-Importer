import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExtractionStore = create(
  persist(
    (set) => ({
      extractedRecords: [],
      skippedRecords: [],
      totalExtracted: 0,
      totalSkipped: 0,
      setExtractionResult: (result) =>
        set({
          extractedRecords: result?.extractedRecords || [],
          skippedRecords: result?.skippedRecords || [],
          totalExtracted: result?.totalExtracted || 0,
          totalSkipped: result?.totalSkipped || 0,
        }),
      clearExtractionResult: () =>
        set({
          extractedRecords: [],
          skippedRecords: [],
          totalExtracted: 0,
          totalSkipped: 0,
        }),
    }),
    {
      name: 'extraction-result-storage',
    }
  )
);

export default useExtractionStore;
