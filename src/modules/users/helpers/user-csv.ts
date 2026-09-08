import { Readable } from 'stream';
import { parse } from 'fast-csv';

export function parseUsersCsv(buffer: Buffer): Promise<{ name: string; email: string }[]> {
  return new Promise((resolve, reject) => {
    const rows: { name: string; email: string }[] = [];
    const stream = Readable.from(buffer.toString());
    stream
      .pipe(parse({ headers: true }))
      .on('data', (row: Record<string, string>) => {
        const name = row['Name']?.trim();
        const email = row['Email']?.trim()?.toLocaleLowerCase();
        if (name && email) {
          rows.push({ name, email });
        }
      })
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}
