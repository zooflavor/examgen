function allSolutions(cells, row, column, items) {
    if ((0>=row) || (0>=column)) {
        return [""];
    }
    var cell=cells[row][column];
    var result=[];
    for (var ii=0; cell.include.length>ii; ++ii) {
        if (cell.include[ii]) {
            var subsolutions=allSolutions(cells, row-1, column-items[row-1].weight, items);
            for (var ii=0; subsolutions.length>ii; ++ii) {
                var subsolution=subsolutions[ii];
                if (0<subsolution.length) {
                    subsolution+=",";
                }
                subsolution+=""+row;
                result.push(subsolution);
            }
        }
        else {
            result=result.concat(allSolutions(cells, row-1, column, items));
        }
    }
    return result;
}

function random() {
    var itemsMax=parseInt(document.getElementById("itemsMax").value);
    var itemsMin=parseInt(document.getElementById("itemsMin").value);
    var valueFactor=parseInt(document.getElementById("valueFactor").value);
    var valueMax=parseInt(document.getElementById("valueMax").value);
    var valueMin=parseInt(document.getElementById("valueMin").value);
    var weightMax=parseInt(document.getElementById("weightMax").value);
    var weightMin=parseInt(document.getElementById("weightMin").value);
    var items="";
    var totalWeight=0;
    for (var ii=randomInt2(itemsMin, itemsMax); 0<ii; --ii) {
        if (0<items.length) {
            items+=",";
        }
        var weight=randomInt2(weightMin, weightMax);
        totalWeight+=weight;
        items+=randomInt2(valueMin, valueMax)*valueFactor+";"+weight;
    }
    var capacity=Math.floor(totalWeight*(0.5+0.4*Math.random()));
    document.getElementById("capacity").value=capacity;
    document.getElementById("items").value=items;
    solve();
}

function solve() {
    var capacity=parseInt(document.getElementById("capacity").value);
    var items=document.getElementById("items")
            .value
            .replace(/, +/g, ",")
            .split(",")
            .map( pair => pair.replace(/; +/g, ";")
                    .split(";")
                    .map(Number));
    for (var ii=0; items.length>ii; ++ii) {
        items[ii]={value: items[ii][0], weight: items[ii][1]};
    }
    var cells=Array(items.length+1);
    for (var row=0; items.length>=row; ++row) {
        cells[row]=Array(capacity+1);
        for (var column=0; capacity>=column; ++column) {
            cells[row][column]=null;
        }
    }
    solve2(capacity, cells, true, items.length, items);
    for (var ii=0; items.length>=ii; ++ii) {
        for (var cc=0; capacity>=cc; ++cc) {
            solve2(cc, cells, false, ii, items);
        }
    }
    var textOutput=document.getElementById("text-output");
    textOutput.value="Latex:\n\n";
    textOutput.value+="Adott "+items.length+" tárgy, amelyek súlyát és értékét a következõ táblázat tartalmazza.\n";
    textOutput.value+="\\bigskip\n\\begin{center}\n\\begin{tabular}{|c||";
    for (var ii=0; items.length>ii; ++ii) {
        textOutput.value+="c|";
    }
    textOutput.value+="}\n\\hline\n$i$";
    for (var ii=0; items.length>ii; ++ii) {
        textOutput.value+=" & "+(ii+1);
    }
    textOutput.value+="\\\\\n\\hline\n$w_i$";
    for (var ii=0; items.length>ii; ++ii) {
        textOutput.value+=" & "+items[ii].weight;
    }
    textOutput.value+="\\\\\n\\hline\n$v_i$";
    for (var ii=0; items.length>ii; ++ii) {
        textOutput.value+=" & "+items[ii].value;
    }
    textOutput.value+="\\\\\n\\hline\n\\end{tabular}\n\\end{center}\n\\bigskip\n\\noindent\n";
    textOutput.value+="A tanult dinamikus programozás algoritmussal határozzuk meg a tárgyaknak egy olyan részhalmazát,\n";
    textOutput.value+="amelyben a tárgyak értékének összege a lehetõ legnagyobb, súlyuk összege viszont maximum "+capacity+".\n";
    textOutput.value+="\nmegoldás:\n\n";
    textOutput.value+="\nkapacitás: "+capacity+"\n\n";
    var itemsTable=createMatrix(3, items.length+1, ()=>[]);
    itemsTable[1][0]=["súly"];
    itemsTable[2][0]=["érték"];
    for (var ii=0; items.length>ii; ++ii) {
        itemsTable[0][ii+1]=[""+(ii+1)];
        itemsTable[1][ii+1]=[""+items[ii].weight];
        itemsTable[2][ii+1]=[""+items[ii].value];
    }
    textOutput.value+=generateTextTable(itemsTable, undefined, undefined, 3);
    textOutput.value+="\n";
    var dpTable=createMatrix(items.length+1, capacity+1, ()=>[]);
    var rowHeaders=[];
    for (var ii=0; items.length>=ii; ++ii) {
        rowHeaders.push(""+ii);
    }
    var columnHeaders=[];
    for (var ii=0; capacity>=ii; ++ii) {
        columnHeaders.push(""+ii);
    }
    var criticalCells=0;
    for (var rr=0; items.length>=rr; ++rr) {
        for (var cc=0; capacity>=cc; ++cc) {
            var cell=cells[rr][cc];
            var lines=[""+cell.value];
            var line="";
            for (var ii=0; cell.include.length>ii; ++ii) {
                line+=(cell.include[ii])?"+":"-";
            }
            if (cell.critical) {
                line+="!";
            }
            if (0<line.length) {
                lines.push(line);
            }
            if (1<cell.solutions) {
                lines.push("s="+cell.solutions);
            }
            if (cell.critical) {
                ++criticalCells;
            }
            dpTable[rr][cc]=lines;
        }
    }
    textOutput.value+=generateTextTable(dpTable, rowHeaders, columnHeaders, 3);
    textOutput.value+="\ncellák: "+(items.length+1)*(capacity+1)+"\n";
    textOutput.value+="kritikus cellák: "+criticalCells+"\n";
    textOutput.value+="legnagyobb érték: "+cells[items.length][capacity].value+"\n";
    textOutput.value+="összes megoldás: "+allSolutions(cells, items.length, capacity, items).map(ss=>"("+ss+")")+"\n";
}

function solve2(capacity, cells, critical, item, items) {
    cell=cells[item][capacity];
    if (null===cell) {
        if ((0===capacity) || (0===item)) {
            cell={
                include: [],
                solutions: 1,
                value: 0};
        }
        else {
            var item2=items[item-1];
            var up=solve2(capacity, cells, critical, item-1, items);
            if (capacity>=item2.weight) {
                var upLeft=solve2(
                        capacity-item2.weight, cells, critical, item-1,
                        items);
                if (upLeft.value+item2.value>up.value) {
                    cell={
                        include: [true],
                        solutions: upLeft.solutions,
                        value: upLeft.value+item2.value};
                }
                else if (upLeft.value+item2.value===up.value) {
                    cell={
                        include: [false, true],
                        solutions: up.solutions+upLeft.solutions,
                        value: upLeft.value+item2.value};
                }
                else {
                    cell={
                        include: [false],
                        solutions: up.solutions,
                        value: up.value};
                }
            }
            else {
                cell={
                    include: [false],
                    solutions: up.solutions,
                    value: up.value};
            }
        }
        cell.critical=critical;
        cell.solution=false;
        cells[item][capacity]=cell;
    }
    return cell;
}

document.getElementById("random").onclick=random;
document.getElementById("solve").onclick=solve;

random();
solve()
