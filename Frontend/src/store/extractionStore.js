import { create } from 'zustand';

const useExtractionStore = create((set) => ({
  extractionResult: null,
  setExtractionResult: (result) => set({ extractionResult: result }),
  clearExtractionResult: () => set({ extractionResult: null }),
}));

export default useExtractionStore;
