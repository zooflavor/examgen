function randomInt(bound) {
    return Math.floor(bound*Math.random());
}

function randomInt2(min, max) {
    return min+randomInt(max-min+1);
}

function randomElement(array) {
    return array[randomInt(array.length)];
}
