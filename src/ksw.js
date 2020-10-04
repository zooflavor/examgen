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
    var capacity=document.getElementById("capacity").value;
    var items=document.getElementById("items")
            .value
            .replace(/, +/g, ",")
            .split(",")
            .map( pair => pair.replace(/; +/g, ";")
                    .split(";")
                    .map(Number));
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
    for (var ii=items.length, cc=capacity; 0<=ii; --ii) {
        var cell=cells[ii][cc];
        cell.solution=true;
        cc=cell.up;
    }
    var table=document.getElementById("solution");
    while (0<table.children.length) {
        table.removeChild(table.children[0]);
    }
    var tableRow=document.createElement("tr");
    var tableData=document.createElement("th");
    tableData.innerHTML="i\\w";
    tableRow.appendChild(tableData);
    for (var ww=0; capacity>=ww; ++ww) {
        tableData=document.createElement("th");
        tableData.innerHTML=""+ww;
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    for (var ii=0; items.length>=ii; ++ii) {
        tableRow=document.createElement("tr");
        tableData=document.createElement("th");
        tableData.innerHTML=""+ii;
        tableRow.appendChild(tableData);
        for (var cc=0; capacity>=cc; ++cc) {
            var cell=cells[ii][cc];
            tableData=document.createElement("td");
            tableData.innerHTML=""+cell.value;
            tableData.innerHTML+="<br>"
                    +(cell.include?"+":"&nbsp;");
            tableData.innerHTML+="<br>"
                    +(null!==cell.up?"w="+cell.up:"&nbsp;");
            if (cell.solution) {
                tableData.style="color: blue";
            }
            else if (cell.critical) {
                tableData.style="color: red";
            }
            tableRow.appendChild(tableData);
        }
        table.appendChild(tableRow);
    }
}

function solve2(capacity, cells, critical, item, items) {
    cell=cells[item][capacity];
    if (null===cell) {
        if ((0===capacity) || (0===item)) {
            cell={
                include: false,
                up: capacity,
                value: 0};
        }
        else {
            var item2=items[item-1];
            var up=solve2(capacity, cells, critical, item-1, items);
            if (capacity>=item2[1]) {
                var upLeft=solve2(
                        capacity-item2[1], cells, critical, item-1,
                        items);
                if (upLeft.value+item2[0]>up.value) {
                    cell={
                        include: true,
                        up: capacity-item2[1],
                        value: upLeft.value+item2[0]};
                }
                else {
                    cell={
                        include: false,
                        up: capacity,
                        value: up.value};
                }
            }
            else {
                cell={
                    include: false,
                    up: capacity,
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
