/*exports.perimeter = (x, y) => (2*(x+y));
exports.area = (x, y) => x*y;*/
module.exports = (l, b, callback) => {
    if (l<=0 || b<=0)
    setTimeout(()=> callback(new Error("dimensions must bigger than 0"), null), 2000);
    else 
    setTimeout(()=> callback(null, {
        perimeter: ()=> (2*(l+b)),
        area: ()=> (l*b)
    }), 2000); 
}