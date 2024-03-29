import { useSystemPaths } from '@/hooks/useSystemPaths';
import { ReactNode } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { SystemPaths } from '@/ipa';
import { getIconForFolder } from 'vscode-icons-js';
import { useAppStore } from '@/hooks/useAppStore';
import { cn } from '@/lib/utils';

type SidebarProps = {
  children?: ReactNode;
  className?: string;
};

export const SidebarLayout = ({ children, className }: SidebarProps) => {
  return (
    <PanelGroup
      autoSaveId="resizable"
      direction="horizontal"
      className={className}
    >
      <Panel minSize={15} defaultSize={25} maxSize={50}>
        <Sidebar />
      </Panel>
      <PanelResizeHandle />
      <Panel className="h-full !overflow-auto">{children}</Panel>
    </PanelGroup>
  );
};

const Sidebar = () => {
  const { value } = useAppStore(state => state.filePath);
  const navigate = useAppStore(state => state.navigate);
  const { isLoading, data, error } = useSystemPaths();

  return (
    <aside className="h-full overflow-auto border-r border-border">
      {isLoading && <Skeleton className="h-10 w-full" />}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          {Object.keys(data).map(key => {
            const objKey = key as keyof SystemPaths;
            const path = data[objKey];

            if (!path) return null;

            return (
              <Button
                key={key}
                className={cn('w-full justify-start rounded-none capitalize', {
                  'bg-background': value !== path,
                })}
                onClick={navigate.bind(null, path, false)}
                variant={'secondary'}
              >
                <img
                  src={`/icons/${getIconForFolder(objKey)}`}
                  alt={key}
                  className="mr-2 h-6 w-6"
                />
                {key}
              </Button>
            );
          })}
        </div>
      )}
    </aside>
  );
};
