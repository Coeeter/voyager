import { create } from 'zustand';

type HistoryNode = {
  filePath: string;
  next: HistoryNode | null;
  prev: HistoryNode | null;
};

type History = {
  currentNode: HistoryNode;
  updateHistory: (path: string, replace?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
};

export const useHistory = create<History>((set, get) => ({
  currentNode: {
    filePath: '/',
    next: null,
    prev: null,
  },
  updateHistory: (path, replace) => {
    const currentPath = get().currentNode;
    const node: HistoryNode = {
      filePath: path,
      next: null,
      prev: replace ? null : currentPath,
    };
    if (currentPath && !replace) {
      currentPath.next = node;
    }
    set({ currentNode: node });
  },
  goBack: () => {
    const currentPath = get().currentNode;
    if (currentPath?.prev) {
      set({ currentNode: currentPath.prev });
    }
  },
  goForward: () => {
    const currentPath = get().currentNode;
    if (currentPath?.next) {
      set({ currentNode: currentPath.next });
    }
  },
}));
