
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

export const exportToPdf = (title: string, headers: string[][], body: any[][], footer?: string[][]) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const pageHeight = doc.internal.pageSize.height;
    let finalY = 20;

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Relatório gerado em: ${formatDate(new Date())}`, 14, 30);

    doc.autoTable({
        head: headers,
        body: body,
        foot: footer,
        startY: 35,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        footStyles: { fillColor: [230, 230, 230], textColor: [40, 40, 40], fontStyle: 'bold' },
        didDrawPage: (data) => {
            finalY = data.cursor?.y ?? 20;
        }
    });

    if (finalY + 15 > pageHeight) {
        doc.addPage();
        finalY = 20;
    }

    doc.setFontSize(8);
    doc.text(`© ${new Date().getFullYear()} Controle Financeiro - Todos os direitos reservados.`, 14, pageHeight - 10);
    
    doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};


export const exportChartToPdf = (title: string, chartElement: HTMLElement) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Relatório gerado em: ${formatDate(new Date())}`, 14, 30);
    
    html2canvas(chartElement, { backgroundColor: null }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 28;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let finalY = 35;
        if (finalY + pdfHeight + 15 > pageHeight) {
            doc.addPage();
            finalY = 20;
        }

        doc.addImage(imgData, 'PNG', 14, finalY, pdfWidth, pdfHeight);
        finalY += pdfHeight;

        doc.setFontSize(8);
        doc.text(`© ${new Date().getFullYear()} Controle Financeiro - Todos os direitos reservados.`, 14, pageHeight - 10);

        doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    });
};
