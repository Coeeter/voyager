import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Toolbar } from './toolbar';
import { useAppStore } from '@/hooks/useAppStore';
import React from 'react';

export const Navbar = () => {
  const { filePath, setFilePath } = useAppStore();

  const paths = filePath.split('/').filter(Boolean);

  return (
    <header className="fixed top-0 z-10 w-full bg-background">
      <nav className="flex gap-2 border border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
        >
          <ArrowRight className="size-5" />
        </Button>
        <div className="grid flex-1 grid-cols-5 gap-2">
          <div className="relative col-span-3 flex items-center gap-3 border border-border">
            {paths.map((dir, i) => {
              return (
                <React.Fragment key={i}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative z-20 text-xs"
                    onClick={() => {
                      setFilePath(paths.slice(0, i + 1).join('/') + '/');
                    }}
                  >
                    {dir}
                  </Button>
                  <span className="text-xs">/</span>
                </React.Fragment>
              );
            })}
            <Input
              placeholder="File Path"
              className="absolute inset-0 opacity-0"
              value={filePath}
              readOnly
            />
          </div>
          <Input placeholder="Search" className="col-span-2" />
        </div>
      </nav>
      <Toolbar />
    </header>
  );
};
