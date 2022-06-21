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
            fs.writeFileSync(this.file, rowsString);
        }
    }

    async writeRow(row: string[]) {
        if(row.length !== this.rowNames.length) {
            throw new Error("Row length does not match row names length");
        }

        fs.appendFileSync(this.file, "\n" + row.join(","));
    }

    async updateRow(search: string, row: string[]) {
        let rows = fs.readFileSync(this.file).toString();
        let colunms = this.getRowByFirstValue_(search, rows);
        if(colunms.length > 0) {
            let newRows = rows.replaceAll(colunms.join(","), row.join(","));
            fs.writeFileSync(this.file, newRows);
        } else {
            this.writeRow(row);
        }
    }

    getRowByFirstValue(value: string): string[] {
        let rows = fs.readFileSync(this.file).toString().split("\n");
        let searchColunms: string[] = [];
        let colunms: string[] = [];
        rows.filter(row => {
            searchColunms = row.split(",");
            if(searchColunms[0] === value) {
                colunms = row.split(",");
                return true;
            }
        });
        return colunms;
    }

    getRowByFirstValue_(value: string, rowsInput: string): string[] {
        let rows = rowsInput.split("\n");
        let searchColunms: string[] = [];
        let colunms: string[] = [];
        rows.filter(row => {
            searchColunms = row.split(",");
            if(searchColunms[0] === value) {
                colunms = row.split(",");
                return true;
            }
        });
        return colunms;
    }
}