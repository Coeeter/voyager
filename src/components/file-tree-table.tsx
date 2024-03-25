import { DirContents, openFile } from '@/ipa';
import { FC } from 'react';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';
import { useAppStore } from '@/hooks/useAppStore';

type FileTreeProps = {
  files: DirContents[];
};

const columns: ColumnDef<DirContents>[] = [
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
    accessorFn: file =>
      file.is_dir ? '-' : Math.ceil(file.size / 1000).toString() + 'kb',
  },
];

export const FileTreeTable: FC<FileTreeProps> = ({ files }) => {
  const { setFilePath } = useAppStore();

  const table = useReactTable({
    data: files,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow
            key={headerGroup.id}
            className="border border-border hover:bg-background"
          >
            {headerGroup.headers.map(header => (
              <TableHead key={header.id} className="border border-border">
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
        {table.getRowModel().rows?.length ?
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={() => {
                row.original.is_dir ?
                  setFilePath(row.original.file_path)
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
        : <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
};
