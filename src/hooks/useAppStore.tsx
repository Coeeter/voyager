import { create } from 'zustand';

type AppStore = {
  filePath: string;
  setFilePath: (filePath: string) => void;
  sortType: 'Name' | 'Date' | 'Size' | 'Type';
  sortOrder: 'Ascending' | 'Descending';
  setSortType: (sortType: 'Name' | 'Date' | 'Size' | 'Type') => void;
  setSortOrder: (sortOrder: 'Ascending' | 'Descending') => void;
};

export const useAppStore = create<AppStore>(set => ({
  filePath: '/',
  setFilePath: filePath => set({ filePath }),
  sortType: 'Name',
  sortOrder: 'Ascending',
  setSortOrder: sortOrder => set({ sortOrder }),
  setSortType: sortType => set({ sortType }),
}));
