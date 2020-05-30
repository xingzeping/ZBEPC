export function export_excel_to_json(evt) {
    var wb;//读取完成的数据
    if(!evt.target.files) {
        return;
    }
    var f = evt.target.files[0];
    var reader = new FileReader();

    var p=new Promise(function(resolve, reject) {
      reader.onload = function(e) {
          var data = e.target.result;
          var XLSX = require('xlsx');
          //wb = XLSX.read(data, {type: 'binary'});
          wb = XLSX.read(btoa(fixdata(data)), {type: 'base64'});
          //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
          //wb.Sheets[Sheet名]获取第一个Sheet的数据
          //console.log(JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) ));
          var result=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          resolve(result);
      }

      //reader.readAsBinaryString(f);
      reader.readAsArrayBuffer(f);
    }).catch(error => console.log(error));
    return p;
}

export function export_json_to_excel(th, jsonData, defaultTitle) {
    /* original data */
    var data = jsonData;
    data.unshift(th);
    var ws_name = "Sheet1";
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var XLSX = require('xlsx');
    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    var title = defaultTitle || '列表'
    var FileSaver = require('file-saver');
    FileSaver.saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}


function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C]};
            if (cell.v == null) continue;
            var XLSX = require('xlsx');
            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function fixdata(data) { //文件流转BinaryString
    var o = "",
        l = 0,
        w = 10240;
    for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}
