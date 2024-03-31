import { useAppStore } from '@/hooks/useAppStore';
import { DirContents, openFile } from '@/ipa';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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

type FileTreeProps = {
  files: DirContents[];
};

export const FileTreeTable: FC<FileTreeProps> = ({ files }) => {
  const [lastSelectedId, setLastSelectedId] = useState<string>('');
  const { navigate } = useAppStore();
  const { type } = useCreateContent();

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

  return (
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
                className="border border-t-0 border-border"
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
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={e => {
                if (e.detail === 1) {
                  if (!e.shiftKey) {
                    let isSelected = row.getIsSelected();
                    table.toggleAllRowsSelected(false);
                    row.toggleSelected(!isSelected);
                  }

                  if (e.shiftKey) {
                    const { rows, rowsById } = table.getRowModel();
                    const rowsToToggle = getRowRange(
                      rows,
                      row.id,
                      lastSelectedId
                    );
                    const isLastSelected =
                      rowsById[lastSelectedId].getIsSelected();
                    rowsToToggle.forEach(row =>
                      row.toggleSelected(isLastSelected)
                    );
                  }

                  setLastSelectedId(row.id);
                  return;
                }

                if (e.detail !== 2) return;

                console.log(row.original.file_path);

                row.original.is_dir ?
                  navigate(row.original.file_path)
                : openFile(row.original.file_path);
              }}
              className="cursor-pointer border-none"
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        : undefined}
      </TableBody>
    </Table>
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
