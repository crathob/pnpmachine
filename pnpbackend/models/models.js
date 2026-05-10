const fs = require('fs');
const settings = require('../config');
const validators = require('../validators/validators.js');
const { error } = require('console');

class Feeder{
    constructor(thispackage, xpos, ypos, pitch, qty, priority){
        this.package = thispackage;
        this.xpos = xpos;
        this.ypos = ypos;
        this.pitch = pitch;
        this.qty = qty;
        this.priority = priority;
    }
    Equals(otherfeeder)
    {
        if (otherfeeder.Package == this.Package)
            return true;
        else return false;
    }
    MoveToNextFeedPos(thisnozzle)
    {
        newxpos = (Xpos + ((QtyOrig - Qty)-1) * Pitch) - thisnozzle.Xoffset;
        newypos = Ypos - thisnozzle.Yoffset;
        return ("G0 X" + Math.round(this.newxpos*100)/100 + " Y" + Math.round(this.newypos*100)/100);
    }
}

class FeederRepository{
        #feeders = [];
        constructor(data){
            this.#feeders = data;
    }
    static async fromFile(directory){
        const data = await fs.promises.readFile(directory,'utf-8');
        let lines = data.replace(/\r\n/g, '\n').split('\n');
        let feeders = [];
        for (const line of lines){
            if (!validators.validateFeeders(line))
                throw new Error("Invalid format of data in placements file");
            const pa = line.split('\t');
            feeders.push(new Feeder(pa[0],pa[1],pa[2],pa[3],pa[4],pa[5]));
        }
        return new FeederRepository(feeders);
    }
    getAll(){
        return this.#feeders;
    }
}

class Package{
    constructor(Package, Width, Height)
    {
        this.Package = Package;
        this.Width = Width;
        this.Height = Height;
    }
}

class PackageRepository{
    #packages = [];
    constructor(data){
                this.#packages = data;
    }
    static async fromFile(directory){
        const data = await fs.promises.readFile(directory,'utf-8');
        let lines = data.replace(/\r\n/g, '\n').split('\n');
        let Packages = [];
        for (const line of lines){
            if (!validators.validatePackages(line))
                throw new Error("Invalid format of data in placements file");
            const pa = line.split('\t');
            Packages.push(new Package(pa[0],pa[1],pa[2]));
        }
        return new PackageRepository(Packages);
    }
    getAll(){
        return this.#packages;
    }
}

class Placement{
    constructor(localname, xpos, ypos, rot, name, thispackage)
    {
        this.localName = localname;
        this.xpos = xpos;
        this.ypos = ypos;
        this.rot = rot;
        this.name = name;
        this.package = thispackage;
    }

    MoveToNextPlacement(thisnozzle, thisclamp)
    {
        this.newxpos = (this.xpos - thisnozzle.xposoffset) + thisclamp.Cbo_x;
        this.newypos = (this.ypos - thisnozzle.yoffset) + thisclamp.Cbo_y;
    }
}

class PlacementRepository{
    #placements = [];
    constructor(data){
                this.#placements = data;
    }
    static async fromFile(directory){
        const data = await fs.promises.readFile(directory,'utf-8');
        let lines = data.replace(/\r\n/g, '\n').split('\n');
        let Placements = [];
        for (const line of lines){
            if (!validators.validatePlacements(line))
                throw new Error("Invalid format of data in placements file");
            const pa = line.split('\t');
            Placements.push(new Placement(pa[0],pa[1],pa[2],pa[3],pa[4],pa[5]));
        }
        return new PlacementRepository(Placements);
    }
    getAll(){
        return this.#placements;
    }
}

class Clamp{
    constructor(baseoffsetx, baseoffsety){
        this.baseoffsetx = baseoffsetx;
        this.baseoffsety = baseoffsety;
    }
}

module.exports = {FeederRepository, PackageRepository, PlacementRepository, Clamp};