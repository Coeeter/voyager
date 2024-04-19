import { ReactNode, useEffect, useRef } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from './ui/button';
import { SystemPaths } from '@/ipa';
import { getIconForFolder } from 'vscode-icons-js';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { systemPathsQueryOptions } from '@/data/systemPathsQueryOptions';
import { useNavigateToFilepath } from '@/hooks/useNavigateToFilepath';
import { useHistory } from '@/hooks/useHistory';

type SidebarProps = {
  children?: ReactNode;
  className?: string;
};

export const SidebarLayout = ({ children, className }: SidebarProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const filepath = useHistory(state => state.currentNode.filePath);

  useEffect(() => {
    if (!panelRef.current) return;
    panelRef.current?.scrollTo(0, 0);
  }, [filepath]);

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
      <Panel className="h-full">
        <div ref={panelRef} className="h-full overflow-auto">
          {children}
        </div>
      </Panel>
    </PanelGroup>
  );
};

const Sidebar = () => {
  const navigate = useNavigateToFilepath();
  const filepath = useHistory(state => state.currentNode.filePath);
  const { data } = useSuspenseQuery(systemPathsQueryOptions);

  return (
    <aside className="h-full overflow-auto border-r border-border">
      {Object.keys(data).map(key => {
        const objKey = key as keyof SystemPaths;
        const path = data[objKey];

        if (!path) return null;

        return (
          <Button
            key={key}
            className={cn('w-full justify-start rounded-none capitalize', {
              'bg-background': filepath !== path,
            })}
            onClick={() => navigate(path)}
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
    </aside>
  );
};
