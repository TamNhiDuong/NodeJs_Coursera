var rect = {
    perimeter: (x,y) => (2*(x+y)),
    area: (x,y) => (x*y)
};

function solveRect(l,b) {
    console.log("Solving for rectangle with l=" + l + "and b=" + b);
    if(l <= 0 || b <= 0) {
        console.log("Rectangle dimensions must bigger than 0");
    }
    else {
        console.log("The area is: " + rect.area(l,b));
        console.log("the perimeter is: " + rect.perimeter(l,b));
    }
};

solveRect(0, 1);
solveRect(2, 4);
solveRect(-1, 5);