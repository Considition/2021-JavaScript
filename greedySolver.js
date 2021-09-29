const {isUndefined} = require("axios/lib/utils");
let otherPackages = []
let heavyPackages = []
let placedPackages = []

let lastKnownMaxLength = 0
let xp = 0
let yp = 0
let zp = 0
let lastKnownMaxWidth = 0
let _map
let nextPackage

/**
 * Tries to solve the given map. The greedy solver will prioritize stacking heavy packages on the floor, it does not take order into consideration at all.
 * @param   map
 * @param   stackHeight         How high the solver stacks heavy packages before starting with other.
 * @returns A list of packages with coordinates
 */

function solve(map, stackHeight) {
    _map = map
    _map.dimensions.forEach(package => {
            if (package.weightClass === 2) heavyPackages.push(package)
            else otherPackages.push(package)
        }
    );
    // Sort both arrays so that the packages with the largest bottom area are in front.
    otherPackages = otherPackages.sort(function (a, b) {
        return (a.length * a.width) - (b.length * b.width)
    }).reverse();
 
    heavyPackages = heavyPackages.sort(function (a, b) {
        return (a.length * a.width) - (b.length * b.width)
    }).reverse();
    
    while (placedPackages.length < _map.dimensions.length) {
        
        if ( (nextPackageOnFloor() || zp < _map.vehicle.height / stackHeight) && !isUndefined(heavyPackages[0])) {
                nextPackage = heavyPackages.pop()
         
        } else if (otherPackages.length > 0) {
            nextPackage = otherPackages.pop()
        }
        else {
            nextPackage = heavyPackages.pop()
        }
        
        if (doesPackageFitZ(nextPackage)) {
            addPackage(nextPackage);
            zp += nextPackage.height;
        }
        else if(doesPackageFitY(nextPackage)){
            yp += lastKnownMaxWidth;
            zp = 0;
            addPackage(nextPackage)
            zp = nextPackage.height
            lastKnownMaxWidth = 0
        }
        else if(doesPackageFitX(nextPackage)){
            xp += lastKnownMaxLength
            yp = 0
            zp = 0
            addPackage(nextPackage)
            zp = nextPackage.height
            lastKnownMaxLength = 0
        }
        else {
            console.log("Fatal error: something broke")
            break;
        }
        setMaxX(nextPackage)
        setMaxY(nextPackage)
    }
    return placedPackages

}
function nextPackageOnFloor(){
    if(heavyPackages.length > 0 && otherPackages.length > 0){ return !(doesPackageFitZ(heavyPackages[0]) && doesPackageFitZ(otherPackages[0]))}
    return false;
}
function addPackage(package) {
    placedPackages.push({
        Id: package.id,
        x1: xp,
        x2: xp,
        x3: xp,
        x4: xp,
        x5: xp + package.length,
        x6: xp + package.length,
        x7: xp + package.length,
        x8: xp + package.length,
        y1: yp,
        y2: yp,
        y3: yp,
        y4: yp,
        y5: yp + package.width,
        y6: yp + package.width,
        y7: yp + package.width,
        y8: yp + package.width,
        z1: zp,
        z2: zp,
        z3: zp,
        z4: zp,
        z5: zp + package.height,
        z6: zp + package.height,
        z7: zp + package.height,
        z8: zp + package.height,
        orderClass: package.orderClass,
        weightClass: package.weightClass
    })

}

function doesPackageFitX(package) {
    return xp + lastKnownMaxLength + package.length < _map.vehicle.length
}

function doesPackageFitY(package) {
    return yp + lastKnownMaxWidth + package.width < _map.vehicle.width && xp + package.length < _map.vehicle.length
}

function doesPackageFitZ(package) {
    return zp + package.height < _map.vehicle.height && yp + package.width < _map.vehicle.width && zp + package.height < _map.vehicle.height
}
function setMaxX(package) {
    if(package.length > lastKnownMaxLength){
        lastKnownMaxLength = package.length
    }
}
function setMaxY(package) {
    if(package.width > lastKnownMaxWidth){
        lastKnownMaxWidth = package.width
    }
}

module.exports = {
    solve
}