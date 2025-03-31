function allSolutions(cells, row, column) {
    if (row>column) {
        return ["error"];
    }
    if (row==column) {
        return ["A_"+(row+1)];
    }
    if (row+1==column) {
        return ["(A_"+column+" \\cdot A_"+(column+1)+")"];
    }
    var result=[];
    var cell=cells[row][column];
    for (var ii=0; cell.split.length>ii; ++ii) {
        var kk=cell.split[ii]-1;
        var solutions0=allSolutions(cells, row, kk);
        var solutions1=allSolutions(cells, kk+1, column);
        for (var j0=0; solutions0.length>j0; ++j0) {
			for (var j1=0; solutions1.length>j1; ++j1) {
				result.push("("+solutions0[j0]+" \\cdot "+solutions1[j1]+")");
			}
		}
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
    textOutput.value="Feladat:\n\n";
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
    
    textOutput.value+="\n\\bigskip\n\n";
    textOutput.value+="Megoldás:\n";
    
    /*var dimensionsTable=createMatrix(3, matrices+1, ()=>[]);
    dimensionsTable[1][0]=["sor"];
    dimensionsTable[2][0]=["oszlop"];
    for (var ii=0; matrices>ii; ++ii) {
        dimensionsTable[0][ii+1]=["A"+(ii+1)];
        dimensionsTable[1][ii+1]=[""+sizes[ii]];
        dimensionsTable[2][ii+1]=[""+sizes[ii+1]];
    }
    textOutput.value+=generateTextTable(dimensionsTable, undefined, undefined, 2);*/
    textOutput.value+="\n";
    textOutput.value+="\\begin{tabular}{";
    for (var ii=0; matrices>=ii; ++ii) {
		textOutput.value+="|"+((0==ii)?"l|":"r");
	}
    textOutput.value+="|}\n";
    for (var rr=0; 3>rr; ++rr) {
		textOutput.value+="\\hline";
		switch (rr) {
			case 1:
				textOutput.value+=" \\hline sor";
				break;
			case 2:
				textOutput.value+=" oszlop";
				break;
		}
		for (var cc=0; matrices>cc; ++cc) {
			textOutput.value+=" & ";
			switch (rr) {
				case 0:
					textOutput.value+="$A_"+(cc+1)+"$";
					break;
				case 1:
					textOutput.value+="$"+sizes[cc]+"$";
					break;
				case 2:
					textOutput.value+="$"+(sizes[cc+1])+"$";
					break;
			}
		}
		textOutput.value+=" \\\\\n";
	}
	textOutput.value+="\\hline\n";
    textOutput.value+="\\end{tabular}\n";

    textOutput.value+="\n\\bigskip\n\n";
    
    /*var dpTable=createMatrix(matrices, matrices, ()=>([]));
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
    var headers=[];
    for (var ii=0; matrices>ii; ++ii) {
        headers.push(""+(ii+1));
    }
    textOutput.value+=generateTextTable(dpTable, headers, headers, 3);*/
    textOutput.value+="\\begin{tabular}{";
    for (var ii=0; matrices+2>ii; ++ii) {
		if ((1==ii) || (matrices+1==ii)) {
			textOutput.value+="|";
		}
		textOutput.value+="|c";
	}
    textOutput.value+="|}\n";
    for (var rr=0; matrices+2>rr; ++rr) {
		textOutput.value+="\\hline";
		if ((1==rr) || (matrices+1==rr)) {
			textOutput.value+=" \\hline";
		}
		for (var cc=0; matrices+2>cc; ++cc) {
			if (0!=cc) {
				textOutput.value+=" &";
			}
			if ((0==rr) || (matrices+1==rr)) {
				if ((0!=cc) && (matrices+1!=cc)) {
					textOutput.value+=" $"+(cc)+"$";
				}
			}
			else if ((0==cc) || (matrices+1==cc)) {
				textOutput.value+=" $"+(rr)+"$";
			}
			else if (cc==rr) {
				textOutput.value+=" $0$";
			}
			else if (cc>rr) {
				var cell=cells[rr-1][cc-1];
				if (null!=cell.fastest) {
					lines=["$"+cell.fastest+"$"];
					if (null!=cell.split) {
						lines.push("$k="+cell.split+"$");
					}
					if ((null!=cell.solutions) && (1<cell.solutions)) {
						lines.push("$s="+cell.solutions+"$");
					}
					textOutput.value+=" ";
					if (1==lines.length) {
						textOutput.value+=lines[0];
					}
					else {
						textOutput.value+="\\begin{tabular}{@{}c@{}}\n";
						for (var ii=0; lines.length>ii; ++ii) {
							if (0!=ii) {
								textOutput.value+="\\\\\n";
							}
							textOutput.value+=lines[ii];
						}
						textOutput.value+="\\end{tabular}\n";
					}
				}
			}
		}
		textOutput.value+=" \\\\\n";
	}
	textOutput.value+="\\hline\n";
    textOutput.value+="\\end{tabular}\n";

    textOutput.value+="\n\\bigskip\n\n";
    
    textOutput.value+="Elemi szorzások minimális száma: $"+cells[0][matrices-1].fastest+"$.\n\n";
    //textOutput.value+="\nÖsszes megoldás: $"+allSolutions(cells, 0, matrices-1)+"$.\n";
    var allSolutions2=allSolutions(cells, 0, matrices-1);
    textOutput.value+="Összes megoldás:\n";
    textOutput.value+="\\begin{itemize}\n";
    for (var ii=0; allSolutions2.length>ii; ++ii) {
		textOutput.value+="\\item $"+allSolutions2[ii]+"$\n";
	}
    textOutput.value+="\\end{itemize}\n";
    
    textOutput.value+="\n\\bigskip\n\n";

    textOutput.value+="Számítások:\n";
    textOutput.value+="\\begin{align*}\n";
    for (var dd=1; matrices>dd; ++dd) {
		for (var ll=0; ; ++ll) {
			var rr=ll+dd;
			if (matrices<=rr) {
				break;
			}
			for (var sp=ll; rr>sp; ++sp) {
				var c0=cells[ll][sp].fastest;
				var c1=cells[sp+1][rr].fastest;
				var s0=sizes[ll];
				var s1=sizes[sp+1];
				var s2=sizes[rr+1];
				var result=c0+c1+s0*s1*s2;
				textOutput.value+="C["+(ll+1)+","+(rr+1)+"]_{"+(sp+1)+"}";
				textOutput.value+=" &= "+c0+" + "+c1+" + "+s0+" \\cdot "+s1+" \\cdot "+s2;
				textOutput.value+=" = "+result;
				if (result==cells[ll][rr].fastest) {
				textOutput.value+=" (*)";
				}
				textOutput.value+=" \\\\\n";
			}
			textOutput.value+="\\\\\n";
		}
	}
    textOutput.value+="\\end{align*}\n";
}

document.getElementById("random").onclick=random;
document.getElementById("solve").onclick=solve;

random();
solve()
