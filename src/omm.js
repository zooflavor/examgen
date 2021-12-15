function allSolutions(cells, row, column) {
    if (row>column) {
        return "error";
    }
    if (row==column) {
        return "A"+(row+1);
    }
    if (row+1==column) {
        return "(A"+column+"*A"+(column+1)+")";
    }
    var result=[];
    var cell=cells[row][column];
    for (var ii=0; cell.split.length>ii; ++ii) {
        var kk=cell.split[ii]-1;
        result.push("("+allSolutions(cells, row, kk)+"*"+allSolutions(cells, kk+1, column)+")");
    }
    return result;
}

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
    var cells=createMatrix(matrices, matrices, ()=>({}));
    for (var ii=0; matrices>ii; ++ii) {
        cells[ii][ii]={fastest: 0, solutions: 1, split: null};
    }
    for (var ii=1; matrices>ii; ++ii) {
        cells[ii-1][ii]={fastest: sizes[ii-1]*sizes[ii]*sizes[ii+1], solutions: 1, split: null};
    }
    for (var ii=2; matrices>ii; ++ii) {
        for (var jj=ii; matrices>jj; ++jj) {
            var row=jj-ii;
            var column=jj;
            var fastest=null;
            var split=null;
            var solutions=null;
            for (var kk=row; column>kk; ++kk) {
                var c0=cells[row][kk];
                var c1=cells[kk+1][column];
                var speed=c0.fastest+c1.fastest+sizes[row]*sizes[kk+1]*sizes[column+1];
                if ((null===fastest) || (fastest>speed)) {
                    fastest=speed;
                    split=[kk+1];
                    solutions=c0.solutions*c1.solutions;
                }
                else if (fastest===speed) {
                    split.push(kk+1);
                    solutions+=c0.solutions*c1.solutions;
                }
            }
            cells[row][column]={fastest: fastest, solutions: solutions, split: split};
        }
    }
    var textOutput=document.getElementById("text-output");
    textOutput.value="";
    textOutput.value+="Latex:\n\n";
    textOutput.value+="Adottak az $";
    for (var ii=0; matrices>ii; ++ii) {
        if (0<ii) {
            textOutput.value+=", ";
        }
        textOutput.value+="A_"+(ii+1);
    }
    textOutput.value+="$ mátrixok,\nahol ";
    for (var ii=0; matrices>ii; ++ii) {
        if (0<ii) {
            textOutput.value+=",\n";
        }
        textOutput.value+="az $A_"+(ii+1)+"$ mátrix $"+sizes[ii]+" \\times "+sizes[ii+1]+"$ dimenziós";
    }
    textOutput.value+=".\nHatározzuk meg a tanult dinamikus programozás algoritmus alkalmazásával az $";
    for (var ii=0; matrices>ii; ++ii) {
        if (0<ii) {
            textOutput.value+=" ";
        }
        textOutput.value+="A_"+(ii+1);
    }
    textOutput.value+="$ szorzat azon zárójelezését,\namely minimalizálja a szorzat kiszámításához szükséges elemi szorzások számát.\nMinden számolást mellékelni kell!\n";
    textOutput.value+="\nmegoldás:\n\n";
    var dimensionsTable=createMatrix(3, matrices+1, ()=>[]);
    dimensionsTable[1][0]=["sor"];
    dimensionsTable[2][0]=["oszlop"];
    for (var ii=0; matrices>ii; ++ii) {
        dimensionsTable[0][ii+1]=["A"+(ii+1)];
        dimensionsTable[1][ii+1]=[""+sizes[ii]];
        dimensionsTable[2][ii+1]=[""+sizes[ii+1]];
    }
    textOutput.value+=generateTextTable(dimensionsTable, undefined, undefined);
    textOutput.value+="\n";
    var dpTable=createMatrix(matrices, matrices, ()=>([]));
    for (var row=0; matrices>row; ++row) {
        for (var column=0; matrices>column; ++column) {
            var cell=cells[row][column];
            if (null!=cell.fastest) {
                lines=[""+cell.fastest];
                if (null!=cell.split) {
                    lines.push("k="+cell.split);
                }
                if ((null!=cell.solutions) && (1<cell.solutions)) {
                    lines.push("s="+cell.solutions);
                }
                dpTable[row][column]=lines;
            }
        }
    }
    textOutput.value+=generateTextTable(dpTable, 1, 1);
    textOutput.value+="\nelemi szorzások minimális száma: "+cells[0][matrices-1].fastest+"\n";
    textOutput.value+="\nösszes megoldás: "+allSolutions(cells, 0, matrices-1)+"\n";
}

document.getElementById("random").onclick=random;
document.getElementById("solve").onclick=solve;

random();
solve()
