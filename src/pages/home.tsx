import { Button } from '@/components/ui/button';
import { useAppStore } from '@/hooks/useAppStore';
import { useDirContents } from '@/hooks/useDirContents';
import { openFile } from '@/ipa';
import { useEffect } from 'react';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';

export const Home = () => {
  const { filePath, setFilePath } = useAppStore();

  const { data, isLoading, error } = useDirContents({
    dirPath: filePath || 'C:/users/nasru/',
  });

  useEffect(() => {
    if (!filePath) {
      setFilePath('C:/users/nasru/');
    }
  }, []);

  if (isLoading) return <section className="p-6">Loading...</section>;

  if (error) return <section className="p-6">Error: {error.message}</section>;

  return (
    <section className="p-6">
      <div className="flex flex-col gap-3">
        {data?.map(file => (
          <Button
            key={file.name}
            className="flex w-full max-w-xl items-center justify-start gap-2"
            variant={'ghost'}
            onClick={() => {
              if (file.is_dir) {
                setFilePath(file.file_path);
                return;
              }
              openFile(file.file_path);
            }}
          >
            <img
              src={`/icons/${
                file.is_dir ?
                  getIconForFolder(file.name)
                : getIconForFile(file.name)
              }`}
              alt={file.name}
              className="size-6"
            />
            {file.name}
          </Button>
        ))}
      </div>
    </section>
  );
};
