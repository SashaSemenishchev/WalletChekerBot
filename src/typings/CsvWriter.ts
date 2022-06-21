import * as fs from 'fs';
export class CsvWriter {
    file: string;
    rowNames: string[];
    constructor(name: string, rowNames: string[]) {
        // check if file with name exists, if not create it
        this.file = name;
        this.rowNames = rowNames;
        if (!fs.existsSync(this.file)) {
            let rowsString: string = rowNames.join(",");
            fs.writeFileSync(this.file, rowsString + "\n");
        }
    }

    async writeRow(row: string[]) {
        if(row.length !== this.rowNames.length) {
            throw new Error("Row length does not match row names length");
        }

        fs.appendFileSync(this.file, row.join(",") + "\n");
    }

    getRowByFirstValue(value: string): string[] {
        let rows = fs.readFileSync(this.file).toString().split("\n");
        let colunms: string[] = [];
        let rowsByFirstValue = rows.filter(row => {
            colunms = row.split(",");
            return colunms[0] === value;
        });
        return colunms;
    }
}