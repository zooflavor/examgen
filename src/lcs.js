function allSolutions(cells, row, column, value0) {
    if ((0>=row) || (0>=column)) {
        return [""];
    }
    var cell=cells[row][column]
    var result;
    if (cell.diagonal) {
        result=allSolutions(cells, row-1, column-1, value0);
        for (var ii=0; result.length>ii; ++ii) {
            result[ii]+=value0[row-1];
        }
    }
    else {
        result=[];
        if (cell.left) {
            result=result.concat(allSolutions(cells, row, column-1, value0));
        }
        if (cell.up) {
            result=result.concat(allSolutions(cells, row-1, column, value0));
        }
    }
    return result;
}

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
    var textOutput=document.getElementById("text-output");
    textOutput.value="Latex:\n\n";
    textOutput.value+="A tanult dinamikus programozás algoritmussal határozzuk meg\na $(";
    for (var ii=0; value0.length>ii; ++ii) {
        if (0<ii) {
            textOutput.value+=", ";
        }
        textOutput.value+=value0[ii];
    }
    textOutput.value+=")$\nés a $(";
    for (var ii=0; value1.length>ii; ++ii) {
        if (0<ii) {
            textOutput.value+=", ";
        }
        textOutput.value+=value1[ii];
    }
    textOutput.value+=")$\nkarakterláncok egy leghosszabb közös részsorozatát!\n\n";
    textOutput.value+="megoldás:\n\n";
    textOutput.value+="LKR("+value0+", "+value1+")\n\n";
    var dpTable=createMatrix(value0.length+1, value1.length+1, ()=>[]);
    for (var rr=0; value0.length>=rr; ++rr) {
        for (var cc=0; value1.length>=cc; ++cc) {
            var cell=cells[rr][cc];
            var lines=[""+cell.longest];
            lines.push((cell.diagonal?"á":"")+(cell.left?"b":"")+(cell.up?"f":"")+(cell.critical?"!":""));
            if (1<cell.solutions) {
                lines.push("s="+cell.solutions);
            }
            dpTable[rr][cc]=lines;
        }
    }
    var rowHeaders=["0"];
    for (var ii=0; value0.length>ii; ++ii) {
        rowHeaders.push((ii+1)+"-"+value0[ii])
    }
    var columnHeaders=["0"];
    for (var ii=0; value1.length>ii; ++ii) {
        columnHeaders.push((ii+1)+"-"+value1[ii])
    }
    textOutput.value+=generateTextTable(dpTable, rowHeaders, columnHeaders, 3);
    var criticalCells=0;
    for (var row=0; value0.length>=row; ++row) {
        for (var column=0; value1.length>=column; ++column) {
            if (cells[row][column].critical) {
                ++criticalCells;
            }
        }
    }
    textOutput.value+="\ncellák: "+(value0.length+1)*(value1.length+1)+"\n";
    textOutput.value+="kritikus cellák: "+criticalCells+"\n";
    textOutput.value+="leghosszabb: "+cells[value0.length][value1.length].longest+"\n";
    textOutput.value+="összes megoldás: "+allSolutions(cells, value0.length, value1.length, value0)+"\n";
}

function solve2(cells, column, critical, row, value0, value1) {
    cell=cells[row][column];
    if (null===cell) {
        if ((0===column) || (0===row)) {
            cell={diagonal: false, left: false, longest: 0, solutions: 1, up: false};
        }
        else if (value0[row-1]===value1[column-1]) {
            var leftUp=solve2(cells, column-1, critical, row-1, value0, value1);
            cell={diagonal: true, left: false, longest: leftUp.longest+1, solutions: leftUp.solutions, up: false};
        }
        else {
            var left=solve2(cells, column-1, critical, row, value0, value1);
            var up=solve2(cells, column, critical, row-1, value0, value1);
            if (left.longest===up.longest) {
                cell={diagonal: false, left: true, longest: left.longest, solutions: left.solutions+up.solutions, up: true};
            }
            else if (left.longest>=up.longest) {
                cell={diagonal: false, left: true, longest: left.longest, solutions: left.solutions, up: false};
            }
            else {
                cell={diagonal: false, left: false, longest: up.longest, solutions: up.solutions, up: true};
            }
        }
        cell.critical=critical;
        cells[row][column]=cell;
    }
    return cell;
}

document.getElementById("random").onclick=random;
document.getElementById("solve").onclick=solve;

random();
solve()
