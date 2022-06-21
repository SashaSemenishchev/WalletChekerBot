"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvWriter = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
class CsvWriter {
    file;
    rowNames;
    constructor(name, rowNames) {
        // check if file with name exists, if not create it
        this.file = name;
        this.rowNames = rowNames;
        if (!fs.existsSync(this.file)) {
            let rowsString = rowNames.join(",");
            fs.writeFileSync(this.file, rowsString);
        }
    }
    async writeRow(row) {
        if (row.length !== this.rowNames.length) {
            throw new Error("Row length does not match row names length");
        }
        fs.appendFileSync(this.file, "\n" + row.join(","));
    }
    async updateRow(search, row) {
        let rows = fs.readFileSync(this.file).toString();
        let colunms = this.getRowByFirstValue_(search, rows);
        if (colunms.length > 0) {
            let newRows = rows.replaceAll(colunms.join(","), row.join(","));
            fs.writeFileSync(this.file, newRows);
        }
        else {
            this.writeRow(row);
        }
    }
    getRowByFirstValue(value) {
        let rows = fs.readFileSync(this.file).toString().split("\n");
        let searchColunms = [];
        let colunms = [];
        rows.filter(row => {
            searchColunms = row.split(",");
            if (searchColunms[0] === value) {
                colunms = row.split(",");
                return true;
            }
        });
        return colunms;
    }
    getRowByFirstValue_(value, rowsInput) {
        let rows = rowsInput.split("\n");
        let searchColunms = [];
        let colunms = [];
        rows.filter(row => {
            searchColunms = row.split(",");
            if (searchColunms[0] === value) {
                colunms = row.split(",");
                return true;
            }
        });
        return colunms;
    }
}
exports.CsvWriter = CsvWriter;
