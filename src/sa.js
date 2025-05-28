function solve() {
    var value0=document.getElementById("value0").value;
    var value1=document.getElementById("value1").value;
    var costDeleteInsert=parseInt(document.getElementById("costDeleteInsert").value);
    var costEqual=parseInt(document.getElementById("costEqual").value);
    var costReplace=parseInt(document.getElementById("costReplace").value);
    
    var cells=Array(value0.length+1);
    for (var row=0; value0.length>=row; ++row) {
        cells[row]=Array(value1.length+1);
        for (var column=0; value1.length>=column; ++column) {
            cells[row][column]=null;
        }
    }
    
    for (var ii=0; value0.length>=ii; ++ii) {
		cells[ii][0]={both: false, cost: ii*costDeleteInsert, first: false, second: false, solutions: 1};
	}
    for (var ii=1; value1.length>=ii; ++ii) {
		cells[0][ii]={both: false, cost: ii*costDeleteInsert, first: false, second: false, solutions: 1};
	}
	for (var rr=1; value0.length>=rr; ++rr) {
		for (var cc=1; value1.length>=cc; ++cc) {
			var costBoth=cells[rr-1][cc-1].cost
					+(value0[rr-1]==value1[cc-1]
						?costEqual
						:costReplace);
			var costFirst=cells[rr-1][cc].cost+costDeleteInsert;
			var costSecond=cells[rr][cc-1].cost+costDeleteInsert;
			var cost=Math.min(costBoth, costFirst, costSecond);
			var both=false;
			var first=false;
			var second=false;
			var solutions=0;
			if (cost==costBoth) {
				both=true;
				solutions+=cells[rr-1][cc-1].solutions;
			}
			if (cost==costFirst) {
				first=true;
				solutions+=cells[rr-1][cc].solutions;
			}
			if (cost==costSecond) {
				second=true;
				solutions+=cells[rr][cc-1].solutions;
			}
			cells[rr][cc]={both: both, cost: cost, first: first, second: second, solutions: solutions};
		}
	}
    
    var textOutput=document.getElementById("text-output");
    textOutput.value="Szekvenciaillesztés: "+value0+" - "+value1+"\n\n";
    
    var dpTable=createMatrix(value0.length+1, value1.length+1, ()=>[]);
    for (var rr=0; value0.length>=rr; ++rr) {
        for (var cc=0; value1.length>=cc; ++cc) {
            var cell=cells[rr][cc];
            var lines=[""+cell.cost];
            lines.push((cell.second?"←":"")+(cell.both?"↖":"")+(cell.first?"↑":""));
            if (1<cell.solutions) {
                lines.push("s="+cell.solutions);
            }
            dpTable[rr][cc]=lines;
        }
    }
    var rowHeaders=["0"];
    for (var ii=0; value0.length>ii; ++ii) {
        rowHeaders.push((ii+1)+"-"+value0[ii]);
    }
    var columnHeaders=["0"];
    for (var ii=0; value1.length>ii; ++ii) {
        columnHeaders.push((ii+1)+"-"+value1[ii]);
    }
    textOutput.value+=generateTextTable(dpTable, rowHeaders, columnHeaders, 3);
    textOutput.value+="\n";
    textOutput.value+="minimum költség: "+cells[value0.length][value1.length].cost+"\n";
    textOutput.value+="összes megoldás száma: "+cells[value0.length][value1.length].solutions+"\n"
}

document.getElementById("solve").onclick=solve;

solve()
