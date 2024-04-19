import { createDir, createFile } from '@/ipa';
import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { useAppStore } from './useAppStore';
import { dirContentsQueryOptions } from '@/data/dirContentsQueryOptions';

type CreateContentStore = {
  type: 'file' | 'folder' | null;
  name: string | null;
  setType: (type: 'file' | 'folder' | null) => void;
  setName: (name: string | null) => void;
  submit: (queryClient: QueryClient) => Promise<void>;
};

export const useCreateContent = create<CreateContentStore>((set, get) => ({
  type: null,
  setType: type => set({ type }),
  name: null,
  setName: name => set({ name }),
  parentFolder: null,
  submit: async queryClient => {
    const { type, name } = get();
    const parentFolder = useAppStore.getState().filePath.value;
    try {
      if (!type || !name || !parentFolder) return;
      const filepath = `${parentFolder}/${name}`;
      if (type === 'file') return await createFile(filepath);
      await createDir(filepath);
    } finally {
      if (parentFolder) {
        queryClient.invalidateQueries(dirContentsQueryOptions(parentFolder));
      }
      set({
        type: null,
        name: null,
      });
    }
  },
}));
