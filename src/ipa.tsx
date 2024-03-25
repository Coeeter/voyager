import { invoke } from '@tauri-apps/api';

export type DirContents = {
  name: string;
  is_dir: boolean;
  size: number;
  last_modified: number;
  extension: string;
  file_path: string;
};

export const getDirContents = async (
  dirPath: string
): Promise<DirContents[]> => {
  return await invoke('get_dir_contents', { dirPath })
    .then(res => res as DirContents[])
    .then(res => {
      const dirs = res
        .filter(file => file.is_dir)
        .sort((a, b) => a.name.localeCompare(b.name));
      const files = res
        .filter(file => !file.is_dir)
        .sort((a, b) => a.name.localeCompare(b.name));
      return [...dirs, ...files];
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });
};

export const openFile = async (filePath: string) => {
  return await invoke('open_file', { filePath }).catch(err => {
    console.log(err);
    throw new Error(err);
  });
};
