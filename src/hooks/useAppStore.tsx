import { create } from 'zustand';

type LinkedListNode = {
  value: string;
  next: LinkedListNode | null;
  prev: LinkedListNode | null;
};

type AppStore = {
  filePath: LinkedListNode;
  navigate: (path: string, replace?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
  sortType: 'Name' | 'Date' | 'Size' | 'Type';
  sortOrder: 'Ascending' | 'Descending';
  setSortType: (sortType: 'Name' | 'Date' | 'Size' | 'Type') => void;
  setSortOrder: (sortOrder: 'Ascending' | 'Descending') => void;
};

export const useAppStore = create<AppStore>((set, get) => ({
  filePath: {
    value: '/',
    next: null,
    prev: null,
  },
  navigate: (path, replace) => {
    const currentPath = get().filePath;
    const node: LinkedListNode = {
      value: path,
      next: null,
      prev: replace ? null : currentPath,
    };
    if (currentPath && !replace) {
      currentPath.next = node;
    }
    set({ filePath: node });
  },
  goBack: () => {
    const currentPath = get().filePath;
    if (currentPath?.prev) {
      set({ filePath: currentPath.prev });
    }
  },
  goForward: () => {
    const currentPath = get().filePath;
    if (currentPath?.next) {
      set({ filePath: currentPath.next });
    }
  },
  sortType: 'Name',
  sortOrder: 'Ascending',
  setSortOrder: sortOrder => set({ sortOrder }),
  setSortType: sortType => set({ sortType }),
}));
