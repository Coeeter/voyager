import { invoke } from '@tauri-apps/api';

type DirContents = {
  name: string;
  is_dir: boolean;
  size: number;
  last_modified: number;
  extension: string;
};

export const getDirContents = async (
  dirPath: string
): Promise<DirContents[]> => {
  return invoke('get_dir_contents', { dirPath });
};
