function random() {
    var matricesMax=parseInt(document.getElementById("matricesMax").value);
    var matricesMin=parseInt(document.getElementById("matricesMin").value);
    var sizeDistinct=document.getElementById("sizeDistinct").checked;
    var sizeFactor=parseInt(document.getElementById("sizeFactor").value);
    var sizeMax=parseInt(document.getElementById("sizeMax").value);
    var sizeMin=parseInt(document.getElementById("sizeMin").value);
    var sizes="";
    if (sizeDistinct) {
        var possibleSizes=[];
        for (var ii=sizeMin; sizeMax>=ii; ++ii) {
            possibleSizes.push(ii*sizeFactor);
        }
        for (var ii=randomInt2(matricesMin, matricesMax)+1;
                (0<ii) && (0<possibleSizes.length);
                --ii) {
            var index=randomInt(possibleSizes.length);
            if (0<sizes.length) {
                sizes+=",";
            }
            sizes+=possibleSizes[index];
            possibleSizes.splice(index, 1);
        }
    }
    else {
        for (var ii=randomInt2(matricesMin, matricesMax)+1; 0<ii; --ii) {
            if (0<sizes.length) {
                sizes+=",";
            }
            sizes+=randomInt2(sizeMin, sizeMax)*sizeFactor;
        }
    }
    document.getElementById("sizes").value=sizes;
    solve();
}

function solve() {
    var sizes=document.getElementById("sizes").value.replace(/, +/g, ",").split(",").map(Number);
    var matrices=sizes.length-1;
    var cells=Array(matrices);
    for (var row=0; matrices>row; ++row) {
        cells[row]=Array(matrices);
        for (var column=0; matrices>column; ++column) {
            cells[row][column]=null;
        }
    }
    for (var ii=0; matrices>ii; ++ii) {
        cells[ii][ii]={fastest: 0, split: null};
    }
    for (var ii=1; matrices>ii; ++ii) {
        cells[ii-1][ii]={fastest: sizes[ii-1]*sizes[ii]*sizes[ii+1], split: null};
    }
    for (var ii=2; matrices>ii; ++ii) {
        for (var jj=ii; matrices>jj; ++jj) {
            var row=jj-ii;
            var column=jj;
            var fastest=null;
            var split=null;
            for (var kk=row; column>kk; ++kk) {
                var speed=cells[row][kk].fastest+cells[kk+1][column].fastest+sizes[row]*sizes[kk+1]*sizes[column+1];
                if ((null===fastest) || (fastest>speed)) {
                    fastest=speed;
                    split=kk+1;
                }
            }
            cells[row][column]={fastest: fastest, split: split};
        }
    }
    var table=document.getElementById("solution");
    while (0<table.children.length) {
        table.removeChild(table.children[0]);
    }
    for (var row=0; matrices>row; ++row) {
        var tableRow=document.createElement("tr");
        for (var column=0; matrices>column; ++column) {
            var cell=cells[row][column];
            var tableData=document.createElement("td");
            if (null!==cell) {
                if (null==cell.split) {
                    tableData.innerHTML=cell.fastest+"<br>&nbsp;";
                }
                else {
                    tableData.innerHTML=cell.fastest+"<br>k="+cell.split;
                }
            }
            tableRow.appendChild(tableData);
        }
        table.appendChild(tableRow);
    }
}

document.getElementById("random").onclick=random;
document.getElementById("solve").onclick=solve;

random();
solve()
