function createCell(color, tag, value) {
    var cell=document.createElement(tag);
    cell.innerHTML=value;
    if (null!==color) {
        cell.style="color: "+color;
    }
    return cell;
}

function random() {
    var alphabet=document.getElementById("alphabet").value;
    var commonMax=parseInt(document.getElementById("commonMax").value);
    var commonMin=parseInt(document.getElementById("commonMin").value);
    var commonLength=randomInt2(commonMin, commonMax);
    var common="";
    while (commonLength>common.length) {
        common+=randomElement(alphabet);
    }
    for (var ii=0; 2>ii; ++ii) {
        var max=parseInt(document.getElementById("max"+ii).value);
        var min=parseInt(document.getElementById("min"+ii).value);
        var value=common;
        var length=randomInt2(min, max);
        while (length>value.length) {
            var jj=randomInt2(0, value.length);
            value=value.slice(0, jj)+randomElement(alphabet)+value.slice(jj, value.length);
        }
        document.getElementById("value"+ii).value=value;
    }
    solve();
}

function solve() {
    var value0=document.getElementById("value0").value;
    var value1=document.getElementById("value1").value;
    var cells=Array(value0.length+1);
    for (var row=0; value0.length>=row; ++row) {
        cells[row]=Array(value1.length+1);
        for (var column=0; value1.length>=column; ++column) {
            cells[row][column]=null;
        }
    }
    solve2(cells, value1.length, true, value0.length, value0, value1);
    for (var row=0; value0.length>=row; ++row) {
        for (var column=0; value1.length>=column; ++column) {
            solve2(cells, column, false, row, value0, value1);
        }
    }
    var table=document.getElementById("solution");
    while (0<table.children.length) {
        table.removeChild(table.children[0]);
    }
    var tableRow=document.createElement("tr");
    tableRow.appendChild(createCell(null, "th", ""));
    tableRow.appendChild(createCell(null, "th", ""));
    for (var xx=0; value1.length>xx; ++xx) {
        tableRow.appendChild(createCell(null, "th", value1[xx]));
    }
    table.appendChild(tableRow);
    for (var row=0; value0.length>=row; ++row) {
        var tableRow=document.createElement("tr");
        tableRow.appendChild(createCell(null, "th", 0<row?value0[row-1]:""));
        for (var column=0; value1.length>=column; ++column) {
            var cell=cells[row][column];
            var value=cell.direction+"&nbsp;"+cell.longest;
            tableRow.appendChild(createCell(cell.critical?"red":null, "td", value));
        }
        table.appendChild(tableRow);
    }
    var criticalCells=0;
    for (var row=0; value0.length>=row; ++row) {
        for (var column=0; value1.length>=column; ++column) {
            if (cells[row][column].critical) {
                ++criticalCells;
            }
        }
    }
    document.getElementById("cells").innerHTML=(value0.length+1)*(value1.length+1);
    document.getElementById("criticalCells").innerHTML=criticalCells;
    document.getElementById("longest").innerHTML=cells[value0.length][value1.length].longest;
}

function solve2(cells, column, critical, row, value0, value1) {
    cell=cells[row][column];
    if (null===cell) {
        if ((0===column) || (0===row)) {
            cell={direction: "&nbsp;&nbsp;", longest: 0};
        }
        else if (value0[row-1]===value1[column-1]) {
            var leftUp=solve2(cells, column-1, critical, row-1, value0, value1);
            cell={direction: "&nwarr;&nbsp;", longest: leftUp.longest+1};
        }
        else {
            var left=solve2(cells, column-1, critical, row, value0, value1);
            var up=solve2(cells, column, critical, row-1, value0, value1);
            if (left.longest===up.longest) {
                cell={direction: "&larr;&uarr;", longest: left.longest};
            }
            else if (left.longest>=up.longest) {
                cell={direction: "&larr;&nbsp;", longest: left.longest};
            }
            else {
                cell={direction: "&uarr;&nbsp;", longest: up.longest};
            }
        }
        cell.critical=critical;
        cells[row][column]=cell;
    }
    return cell;
}

document.getElementById("random").onclick=random;
document.getElementById("solve").onclick=solve;

//random();
solve()
