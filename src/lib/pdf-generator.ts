
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
}

const docFooter = (doc: jsPDF) => {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text(`© ${new Date().getFullYear()} Controle Financeiro - Todos os direitos reservados.`, 14, pageHeight - 10);
};

const docHeader = (doc: jsPDF, title: string) => {
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Relatório gerado em: ${formatDate(new Date())}`, 14, 30);
}

export const exportToPdf = (title: string, headers: string[][], body: any[][], footer?: any[][]) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    docHeader(doc, title);

    doc.autoTable({
        head: headers,
        body: body,
        foot: footer,
        startY: 35,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        footStyles: { fillColor: [230, 230, 230], textColor: [40, 40, 40], fontStyle: 'bold' },
    });

    docFooter(doc);
    
    doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};


export const exportChartToPdf = async (title: string, chartElement: HTMLElement) => {
    const canvas = await html2canvas(chartElement, { backgroundColor: null });
    const doc = new jsPDF();
    
    docHeader(doc, title);
    
    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth() - 28;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, 'PNG', 14, 40, pdfWidth, pdfHeight);
    
    docFooter(doc);

    doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const printReport = (title: string, tableHtml: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
                    th { background-color: #f2f2f2; }
                    tfoot { font-weight: bold; }
                    h1 { font-size: 18px; }
                    p { font-size: 10px; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Relatório gerado em: ${formatDate(new Date())}</p>
                ${tableHtml}
            </body>
        </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
}

export const printChart = async (title: string, chartElement: HTMLElement) => {
    const canvas = await html2canvas(chartElement, { backgroundColor: null });
    const imgData = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                 <style>
                    body { font-family: sans-serif; }
                    img { max-width: 100%; }
                    h1 { font-size: 18px; }
                    p { font-size: 10px; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Relatório gerado em: ${formatDate(new Date())}</p>
                <img src="${imgData}" />
            </body>
        </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
};
