import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Toolbar } from './toolbar';
import { useAppStore } from '@/hooks/useAppStore';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

//TODO: clean up component using refs and all
export const Navbar = () => {
  const [focus, setFocus] = useState(false);
  const { filePath, setFilePath } = useAppStore();

  const paths = filePath.split('/').filter(Boolean);

  const pathsToDisplay =
    paths.length > 4 ? paths.slice(paths.length - 3) : paths;

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
          <div className="group relative col-span-3 flex items-center gap-3 rounded-md border border-border">
            {pathsToDisplay.map((dir, i) => {
              return (
                <React.Fragment key={i}>
                  {i !== 0 && (
                    <span className={cn('text-xs', focus && 'opacity-0')}>
                      /
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'relative z-20 text-xs',
                      focus && 'opacity-0'
                    )}
                    onClick={() => {
                      const index = paths.length > 4 ? paths.length - 3 + i : i;
                      const newPath =
                        paths.slice(0, index + 1).join('/') || '/';

                      setFilePath(newPath);
                    }}
                  >
                    {dir}
                  </Button>
                </React.Fragment>
              );
            })}
            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const newPath = formData.get('path') as string;
                setFilePath(newPath);
                const input = document.querySelector(
                  'input[name="path"]'
                ) as HTMLInputElement;
                input.blur();
              }}
            >
              <Input
                name="path"
                placeholder="File Path"
                className="absolute inset-0 opacity-0 focus:opacity-100"
                defaultValue={filePath}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
              />
            </form>
          </div>
          <Input placeholder="Search" className="col-span-2" />
        </div>
      </nav>
      <Toolbar />
    </header>
  );
};
