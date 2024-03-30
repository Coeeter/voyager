import { createDir, createFile } from '@/ipa';
import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { revalidateDirContents } from './useDirContents';

type CreateContentStore = {
  type: 'file' | 'folder' | null;
  name: string | null;
  parentFolder: string | null;
  setType: (type: 'file' | 'folder' | null) => void;
  setName: (name: string | null) => void;
  setParentFolder: (parentFolder: string) => void;
  submit: (queryClient: QueryClient) => void;
};

export const useCreateContent = create<CreateContentStore>((set, get) => ({
  type: null,
  setType: type => set({ type }),
  name: null,
  setName: name => set({ name }),
  parentFolder: null,
  setParentFolder: parentFolder => set({ parentFolder }),
  submit: async queryClient => {
    const { type, name, parentFolder } = get();
    try {
      if (!type || !name || !parentFolder) return;
      const filepath = `${parentFolder}/${name}`;
      if (type === 'file') return await createFile(filepath);
      await createDir(filepath);
    } finally {
      if (parentFolder) revalidateDirContents(parentFolder, queryClient);
      set({
        type: null,
        name: null,
        parentFolder: null,
      });
    }
  },
}));
