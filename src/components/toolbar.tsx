import {
  ArrowDownUp,
  Clipboard,
  Copy,
  File,
  FilePen,
  Folder,
  Link,
  Plus,
  Scissors,
  Trash2,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';

export const Toolbar = () => {
  return (
    <menu className="flex h-16 gap-2 border border-b px-4 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'secondary'}>
            <Plus className="mr-2 size-5" />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={12}>
          <DropdownMenuItem>
            <Folder className="mr-2 size-5" />
            Folder
          </DropdownMenuItem>
          <DropdownMenuItem>
            <File className="mr-2 size-5" />
            File
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="mr-2 size-5" />
            Shortcut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="h-full" />
      <Button variant={'ghost'} size="icon" className="rounded-full">
        <Scissors className="size-5" />
      </Button>
      <Button variant={'ghost'} size="icon" className="rounded-full">
        <Copy className="size-5" />
      </Button>
      <Button variant={'ghost'} size="icon" className="rounded-full">
        <Clipboard className="size-5" />
      </Button>
      <Button variant={'ghost'} size="icon" className="rounded-full">
        <FilePen className="size-5" />
      </Button>
      <Button variant={'ghost'} size="icon" className="rounded-full">
        <Trash2 className="size-5" />
      </Button>
      <Separator orientation="vertical" className="h-full" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>
            <ArrowDownUp className="mr-2 size-5" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={12}>
          <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Date</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Type</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Ascending</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Descending</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </menu>
  );
};
