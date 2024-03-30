import { createDir, createFile } from '@/ipa';
import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { revalidateDirContents } from './useDirContents';

type CreateContentStore = {
  type: 'file' | 'folder' | null;
  filepath: string | null;
  parentFolder: string | null;
  setType: (type: 'file' | 'folder') => void;
  setFilepath: (filepath: string) => void;
  setParentFolder: (parentFolder: string) => void;
  submit: (queryClient: QueryClient) => void;
};

export const useCreateContent = create<CreateContentStore>((set, get) => ({
  type: null,
  setType: type => set({ type }),
  filepath: null,
  setFilepath: filepath => set({ filepath }),
  parentFolder: null,
  setParentFolder: parentFolder => set({ parentFolder }),
  submit: async queryClient => {
    const { type, filepath, parentFolder } = get();
    try {
      if (!type || !filepath) return;
      if (type === 'file') return await createFile(filepath);
      await createDir(filepath);
    } finally {
      if (parentFolder) revalidateDirContents(parentFolder, queryClient);
      set({
        type: null,
        filepath: null,
        parentFolder: null,
      });
    }
  },
}));
