
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';
import { exportToPdf, printReport } from '@/lib/pdf-generator';

interface ReportViewProps {
  title: string;
  data: any[];
  columns: { header: string; dataKey: string }[];
  footer?: { content: string; colSpan?: number; styles?: any }[][];
}

export function ReportView({ title, data, columns, footer }: ReportViewProps) {
  const tableRef = React.useRef<HTMLTableElement>(null);

  const handleExportPdf = () => {
    const headers = [columns.map(col => col.header)];
    const body = data.map(row => columns.map(col => row[col.dataKey]));
    exportToPdf(title, headers, body, footer);
  };

  const handlePrint = () => {
    if (tableRef.current) {
        printReport(title, tableRef.current.outerHTML);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <Button onClick={handleExportPdf} variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </div>
      <div className="border rounded-md">
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              {columns.map(col => <TableHead key={col.dataKey}>{col.header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map(col => <TableCell key={col.dataKey}>{row[col.dataKey]}</TableCell>)}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum dado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footer && (
            <TableFooter>
                {footer.map((footerRow, rowIndex) => (
                    <TableRow key={`footer-${rowIndex}`}>
                        {footerRow.map((cell, cellIndex) => (
                             <TableCell key={`footer-cell-${cellIndex}`} colSpan={cell.colSpan} className={cell.styles?.halign === 'right' ? 'text-right' : ''}>
                                {cell.content}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
