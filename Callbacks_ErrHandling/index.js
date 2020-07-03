/*var rect = {
    perimeter: (x,y) => (2*(x+y)),
    area: (x,y) => (x*y)
};*/
var rect = require('./rectangle');

function solveRect(l,b) {
    console.log("Solving for rectangle with l=" + l + "and b=" + b);
    rect(l,b,(err, results) => {
        if(err) {
            console.log("Error: ", err.message);
        }
        else {
            console.log("with l = " + l + "and b = " + b + " , area = " + results.area() + " , perimeter = " + results.perimeter());
        }
    });
    console.log("end");
};

solveRect(0, 1);
solveRect(2, 4);
solveRect(-1, 5);