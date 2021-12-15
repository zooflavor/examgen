function alignCenter(length, value) {
    for (var bb=false; value.length<length; bb=!bb) {
        value=bb?(value+" "):(" "+value);
    }
    return value;
}

function alignRight(length, value) {
    while (value.length<length) {
        value=" "+value;
    }
    return value;
}

function createArray(length, constr=()=>undefined) {
    var result=Array(length);
    for (var ii=0; length>ii; ++ii) {
        result[ii]=constr();
    }
    return result;
}

function createMatrix(rows, columns, constr=()=>undefined) {
    var result=Array(rows);
    for (var rr=0; rows>rr; ++rr) {
        result[rr]=Array(columns);
        for (var cc=0; columns>cc; ++cc) {
            result[rr][cc]=constr();
        }
    }
    return result;
}

function generateTextTable(matrix, rowHeaderStart=undefined, columnHeaderStart=undefined) {
    var rows=matrix.length;
    var columns=matrix[0].length;
    var maxHeights=createArray(rows, ()=>0);
    var maxWidths=createArray(columns, ()=>0);
    var rowHeaderWidth=0;
    if (columnHeaderStart) {
        for (var cc=0; columns>cc; ++cc) {
            maxWidths[cc]=Math.max(maxWidths[cc], (""+(columnHeaderStart+cc)).length);
        }
    }
    if (rowHeaderStart) {
        rowHeaderWidth=Math.max(rowHeaderWidth, (""+(rowHeaderStart+rows-1)).length);
    }
    for (var rr=0; rows>rr; ++rr) {
        for (var cc=0; columns>cc; ++cc) {
            maxHeights[rr]=Math.max(maxHeights[rr], matrix[rr][cc].length);
            for (var ll=0; matrix[rr][cc].length>ll; ++ll) {
                maxWidths[cc]=Math.max(maxWidths[cc], matrix[rr][cc][ll].length);
            }
        }
    }
    var result="";
    function columnHeader() {
        if (columnHeaderStart) {
            for (var ii=0; rowHeaderWidth>ii; ++ii) {
                result+=" ";
            }
            result+=" ";
            for (var cc=0; columns>cc; ++cc) {
                result+=alignCenter(maxWidths[cc], ""+(columnHeaderStart+cc));
                result+=" ";
            }
            result+="\n";
        }
    }
    function horizontalSeparator() {
        for (var ii=0; rowHeaderWidth>ii; ++ii) {
            result+=" ";
        }
        result+="+";
        for (var cc=0; columns>cc; ++cc) {
            for (var ii=0; maxWidths[cc]>ii; ++ii) {
                result+="-";
            }
            result+="+";
        }
        for (var ii=0; rowHeaderWidth>ii; ++ii) {
            result+=" ";
        }
        result+="\n";
    }
    columnHeader();
    horizontalSeparator();
    for (var rr=0; rows>rr; ++rr) {
        for (var ll=0; maxHeights[rr]>ll; ++ll) {
            var printRowHeader=rowHeaderStart && (ll==Math.floor((maxHeights[rr]+1)/2)-1);
            if (printRowHeader) {
                result+=alignCenter(rowHeaderWidth, ""+(rowHeaderStart+rr));
            }
            else {
                for (var ii=0; rowHeaderWidth>ii; ++ii) {
                    result+=" ";
                }
            }
            result+="|";
            for (var cc=0; columns>cc; ++cc) {
                result+=alignRight(maxWidths[cc], (matrix[rr][cc].length>ll)?matrix[rr][cc][ll]:"");
                result+="|";
            }
            if (printRowHeader) {
                result+=alignCenter(rowHeaderWidth, ""+(rowHeaderStart+rr));
            }
            else {
                for (var ii=0; rowHeaderWidth>ii; ++ii) {
                    result+=" ";
                }
            }
            result+="\n";
        }
        horizontalSeparator();
    }
    columnHeader();
    return result;
}

function randomInt(bound) {
    return Math.floor(bound*Math.random());
}

function randomInt2(min, max) {
    return min+randomInt(max-min+1);
}

function randomElement(array) {
    return array[randomInt(array.length)];
}
