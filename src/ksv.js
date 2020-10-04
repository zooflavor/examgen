function random() {
    var itemsMax=parseInt(document.getElementById("itemsMax").value);
    var itemsMin=parseInt(document.getElementById("itemsMin").value);
    var valueMax=parseInt(document.getElementById("valueMax").value);
    var valueMin=parseInt(document.getElementById("valueMin").value);
    var weightMax=parseInt(document.getElementById("weightMax").value);
    var weightMin=parseInt(document.getElementById("weightMin").value);
    var weightFactor=parseInt(document.getElementById("weightFactor").value);
    var items="";
    var totalWeight=0;
    for (var ii=randomInt2(itemsMin, itemsMax); 0<ii; --ii) {
        if (0<items.length) {
            items+=",";
        }
        var weight=randomInt2(weightMin, weightMax)*weightFactor;
        totalWeight+=weight;
        items+=randomInt2(valueMin, valueMax)+";"+weight;
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
    var value=0;
    for (var ii=0; items.length>ii; ++ii) {
        value+=items[ii][0];
        items[ii].push(value);
    }
    var cells=Array(items.length+1);
    for (var row=0; items.length>=row; ++row) {
        cells[row]=Array(value+1);
        for (var column=0; value>=column; ++column) {
            cells[row][column]=null;
        }
    }
    var solution;
    if (capacity<solve2(
            cells, true, items.length, items, 0).weight) {
        solution=0;
    }
    else if (capacity>=solve2(
            cells, true, items.length, items, value).weight) {
        solution=value;
    }
    else {
        var ll=0;
        var uu=value;
        while (ll+1<uu) {
            var mm=Math.floor((ll+uu)/2);
            if (capacity<solve2(
                    cells, true, items.length, items, mm).weight) {
                uu=mm;
            }
            else {
                ll=mm;
            }
        }
        solution=ll;
    }
    solve2(cells, true, items.length, items, value);
    for (var ii=0; items.length>=ii; ++ii) {
        for (var vv=0; value>=vv; ++vv) {
            solve2(cells, false, ii, items, vv);
        }
    }
    for (var ii=items.length, vv=solution; 0<=ii; --ii) {
        var cell=cells[ii][vv];
        cell.solution=true;
        vv=cell.up;
    }
    var table=document.getElementById("solution");
    while (0<table.children.length) {
        table.removeChild(table.children[0]);
    }
    var tableRow=document.createElement("tr");
    var tableData=document.createElement("th");
    tableData.innerHTML="i\\v";
    tableRow.appendChild(tableData);
    for (var vv=0; value>=vv; ++vv) {
        tableData=document.createElement("th");
        tableData.innerHTML=""+vv;
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    for (var ii=0; items.length>=ii; ++ii) {
        tableRow=document.createElement("tr");
        tableData=document.createElement("th");
        tableData.innerHTML=""+ii;
        tableRow.appendChild(tableData);
        for (var vv=0; value>=vv; ++vv) {
            var cell=cells[ii][vv];
            tableData=document.createElement("td");
            if (!cell.empty) {
                tableData.innerHTML=""+cell.weight;
                tableData.innerHTML+="<br>"
                        +(cell.include?"+":"&nbsp;");
                tableData.innerHTML+="<br>"
                        +(null!==cell.up?"v="+cell.up:"&nbsp;");
                if (cell.solution) {
                    tableData.style="color: blue";
                }
                else if (cell.critical) {
                    tableData.style="color: red";
                }
            }
            tableRow.appendChild(tableData);
        }
        table.appendChild(tableRow);
    }
}

function solve2(cells, critical, item, items, value) {
    cell=cells[item][value];
    if (null===cell) {
        if (0===value) {
            cell={
                empty: false,
                include: false,
                up: value,
                weight: 0};
        }
        else if (0==item) {
            cell={
                empty: true,
                include: false,
                up: value,
                weight: 0};
        }
        else {
            var item2=items[item-1];
            if (value>item2[2]) {
                cell={
                    empty: true,
                    include: false,
                    up: value,
                    weight: 0};
            }
            else {
                var up=solve2(
                        cells, critical, item-1, items, value);
                var upLeftValue=Math.max(0, value-item2[0]);
                var upLeft=solve2(
                        cells, critical, item-1, items, upLeftValue);
                if (up.empty
                        || (up.weight>upLeft.weight+item2[1])) {
                    cell={
                        empty: false,
                        include: true,
                        up: upLeftValue,
                        weight: upLeft.weight+item2[1]};
                }
                else {
                    cell={
                        empty: false,
                        include: false,
                        up: value,
                        weight: up.weight};
                }
            }
        }
        cell.critical=critical;
        cell.solution=false;
        cells[item][value]=cell;
    }
    return cell;
}

document.getElementById("random").onclick=random;
document.getElementById("solve").onclick=solve;

random();
solve()
