import { DirContents, moveFile, openFile } from '@/ipa';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  Table as TableType,
  useReactTable,
} from '@tanstack/react-table';
import { FC, useCallback, useState } from 'react';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  createSelectColumn,
  getRowRange,
} from './ui/table';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { filesize } from 'filesize';
import { useCreateContent } from '@/hooks/useCreateContent';
import { Input } from './ui/input';
import { useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { revalidateDirContents } from '@/hooks/useDirContents';
import { useParams, useRouter } from '@tanstack/react-router';

type FileTreeProps = {
  files: DirContents[];
};

export const FileTreeTable: FC<FileTreeProps> = ({ files }) => {
  const { filepath } = useParams({
    from: '/$filepath',
  });
  const [lastSelectedId, setLastSelectedId] = useState<string>('');
  const { type } = useCreateContent();
  const queryClient = useQueryClient();

  const columns: ColumnDef<DirContents>[] = [
    createSelectColumn(lastSelectedId, setLastSelectedId),
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const file = row.original;

        return (
          <div className="flex items-center gap-2">
            <img
              src={`/icons/${
                file.is_dir ?
                  getIconForFolder(file.name)
                : getIconForFile(file.name)
              }`}
              onError={e => {
                e.currentTarget.src = `/icons/default_${
                  file.is_dir ? 'folder' : 'file'
                }.svg`;
              }}
              alt={file.name}
              className="h-6 w-6"
            />
            <span>{file.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'extension',
      header: 'File Type',
      accessorFn: file => {
        return file.is_dir ? 'File Folder' : (
            file.extension.toUpperCase() + ' File'
          );
      },
    },
    {
      accessorKey: 'last_modified',
      header: 'Last Modified',
      accessorFn: file => new Date(file.last_modified).toLocaleString(),
    },
    {
      accessorKey: 'size',
      header: 'Size',
      accessorFn: file => (file.is_dir ? '-' : filesize(file.size)),
    },
  ];

  const table = useReactTable({
    data: files,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const ref = useOutsideClick<HTMLTableElement>(() => {
    table.toggleAllPageRowsSelected(false);
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      distance: 8,
    },
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      distance: 8,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      distance: 8,
    },
  });

  const sensors = useSensors(mouseSensor, pointerSensor, touchSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={async ({ active, over }) => {
        const draggedElement = active.data.current as DirContents;
        const directory = over?.data.current as DirContents;
        const oldPath = draggedElement.file_path;
        const newPath = `${directory.file_path}/${draggedElement.name}`;
        await moveFile(oldPath, newPath);
        revalidateDirContents(filepath, queryClient);
      }}
    >
      <Table ref={ref} className="container m-0">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow
              key={headerGroup.id}
              className="border border-l-0 border-t-0 border-border bg-background hover:bg-background"
            >
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className="border border-l-0 border-t-0 border-border"
                >
                  {header.isPlaceholder ? null : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {type && <CreateContentForm />}
          {table.getRowModel().rows?.length ?
            table
              .getRowModel()
              .rows.map(row => (
                <FileItem
                  key={row.id}
                  table={table}
                  row={row}
                  lastSelectedId={lastSelectedId}
                  setLastSelectedId={setLastSelectedId}
                />
              ))
          : undefined}
        </TableBody>
      </Table>
    </DndContext>
  );
};

type FileItemProps = {
  table: TableType<DirContents>;
  row: Row<DirContents>;
  lastSelectedId: string;
  setLastSelectedId: (id: string) => void;
};

const FileItem = (props: FileItemProps) => {
  const router = useRouter();
  const { table, row, lastSelectedId, setLastSelectedId } = props;

  const { setNodeRef, attributes, listeners, transform, active, isDragging } =
    useDraggable({
      id: row.id,
      data: row.original,
    });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: row.id,
    data: row.original,
    disabled: !row.original.is_dir || isDragging,
  });

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
      if (e.detail === 1) {
        if (!e.shiftKey) {
          let isSelected = row.getIsSelected();
          table.toggleAllRowsSelected(false);
          row.toggleSelected(!isSelected);
        }

        if (e.shiftKey) {
          const { rows, rowsById } = table.getRowModel();
          const rowsToToggle = getRowRange(rows, row.id, lastSelectedId);
          const isLastSelected = rowsById[lastSelectedId].getIsSelected();
          rowsToToggle.forEach(row => row.toggleSelected(isLastSelected));
        }

        setLastSelectedId(row.id);
        return;
      }

      if (e.detail !== 2) return;

      console.log(row.original.file_path);

      row.original.is_dir ?
        router.navigate({
          to: '/$filepath',
          params: {
            filepath: row.original.file_path,
          },
        })
      : openFile(row.original.file_path);
    },
    []
  );

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <TableRow
      key={row.id}
      style={style}
      ref={ref => {
        if (row.original.is_dir) {
          setDroppableRef(ref);
        }
        setNodeRef(ref);
      }}
      onClick={onClick}
      className={cn(
        'relative cursor-pointer border-none',
        active && 'bg-background',
        isDragging && 'z-[999] hover:bg-muted',
        isOver && '-my-4 border-2 border-dashed border-primary bg-background'
      )}
      data-state={row.getIsSelected() && 'selected'}
      {...attributes}
      {...listeners}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

const CreateContentForm = () => {
  const queryClient = useQueryClient();
  const { type, setName, submit, setType } = useCreateContent();

  const reset = useCallback(() => {
    setType(null);
    setName(null);
  }, [setType, setName]);

  const ref = useOutsideClick<HTMLTableRowElement>(reset);

  return (
    <TableRow ref={ref}>
      <TableCell colSpan={5}>
        <form
          className="flex items-center gap-2"
          onSubmit={async e => {
            e.preventDefault();
            const formdata = new FormData(e.currentTarget);
            const name = formdata.get('name') as string;
            setName(name);
            await submit(queryClient);
          }}
        >
          <img
            src={`/icons/default_${type}.svg`}
            alt="Folder"
            className="h-6 w-6"
          />
          <Input
            id="create-content-input"
            name="name"
            placeholder="Name"
            onBlur={reset}
          />
        </form>
      </TableCell>
    </TableRow>
  );
};
