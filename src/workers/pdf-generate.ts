import path from 'path';
import PdfPrinter from 'pdfmake';

async function getPdf(definition): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const fonts = {
        Poppins: {
          normal: path.join(__dirname, '../../fonts/Poppins-Regular.ttf'),
          bold: path.join(__dirname, '../../fonts/Poppins-Medium.ttf'),
          italics: path.join(__dirname, '../../fonts/Poppins-Italic.ttf'),
          bolditalics: path.join(
            __dirname,
            '../../fonts/Poppins-MediumItalic.ttf',
          ),
        },
      };
      const printer: PdfPrinter = new PdfPrinter(fonts);
      const pdfDoc = printer.createPdfKitDocument(definition, {});
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', () => {
        const pdfBuffer: Buffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      pdfDoc.end();
    } catch (error) {
      reject(error);
    }
  });
}
export default async function pdfGenerator(definition: any): Promise<Buffer> {
  try {
    return await getPdf(definition);
  } catch (err) {
    throw err;
  }
}
