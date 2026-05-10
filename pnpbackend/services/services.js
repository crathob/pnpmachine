const fs = require('fs');
const path = require('path');

//Use path object for route optimisation
class Path{
    #path = {
        head0 : {
            feeder : '',
            placement : '',
        },
        head1 : {
            feeder : '',
            placement : '',
        }
    }
    constructor(head0feeder, head0placement, head1feeder, head1placement){
        this.#path.head0.feeder = head0feeder;
        this.#path.head0.placement = head0placement;
        this.#path.head1.feeder = head1feeder;
        this.#path.head1.placement = head1placement;
    }
    getPath(){
        return this.#path;
    }
}

class PathPlanning{
    #completepath = [];
    #Placements;
    #Packages;
    #Feeders;
    constructor(Placements, Packages, Feeders){
        this.#Placements = Placements;
        this.#Packages = Packages;
        this.#Feeders = Feeders;
    }
    CreatePath(){
        //Create a path for every placement, except the last if the num placements is even. Create a path only if the placement at x
        //is placeable.
        for (let x = 0; x < (this.#Placements.length-1); x+=2){
            const p0 = this.isUnplaceable(this.#Placements[x])   ? this.#Placements[x]   : ""; 
            const p1 = this.isUnplaceable(this.#Placements[x+1]) ? this.#Placements[x+1] : "";
            this.#completepath.push(new Path(
                p0 ? this.findFeeder(p0) : "", p0,
                p1 ? this.findFeeder(p1) : "", p1
            ));
        }

        //Create a path for the last, uneven placement.
        if ((this.#Placements.length % 2 !== 0)){
            const last = this.#Placements[this.#Placements.length - 1];
            const p0 = this.isUnplaceable(last)   ?  last   : ""; 
            this.#completepath.push(new Path(
                p0 ? this.findFeeder(p0) : "", p0,
                "", ""
            ));
        }   
    }

    //returns feeder where the feeder has the same package as the placement
    findFeeder(placement){
        return this.#Feeders.find((Feeder => (Feeder.package === placement.package)&&Feeder.qty!== 0))
    }

    //return all paths.
    getAll(){
        return this.#completepath;
    }

    //A placement is unplaceable if its package isn't in the packages list.
    isUnplaceable(thisplacement){
        return this.#Packages.map(p=>p.Package).includes(thisplacement.package);
    }
}

//Machine sequence that moves heads to an idle position above the board origin.
//Useful during machine assembly, maintenance or power failures.
class MachineStartupSequenceService{
    #GCode = [];
    constructor(settings){
        this.#GCode.push("M42 P41 S0");
        this.#GCode.push("M42 P50 S0");
        this.#GCode.push("M42 P51 S0");
        this.#GCode.push("M42 P52 S0");
        this.#GCode.push("G90");                          // Use absolute Positioning. G91 is relative positioning
        this.#GCode.push("M280 P" + "0" + " S" + settings.machine.nozzle0top);             // Left nozzle up 
        this.#GCode.push("M280 P" + "1" + " S" + settings.machine.nozzle1top);             // Right nozzle up
        this.#GCode.push("G28");                          // Home XY axes
        this.#GCode.push("G0 F8000 X" + settings.machine.cbo_x + " Y"+settings.machine.cbo_y);
    }
    getAll(){
        return this.#GCode;
    }
}

//Generates gcode for a path.
class GenerateGCode{
    #Gcode
    constructor(path, feeder, settings){
        this.#Gcode = [];

        //for each path, pick a part and place it with both heads. Use first head only if the second is empty.
        for (let x = 0; x < path.length; x++)
        {
            const sequence = path[x].getPath();
            this.pickUp(0, sequence, feeder, settings);
            if (sequence.head1.feeder !== '') this.pickUp(1, sequence, feeder, settings);
            this.placeDown(0, sequence, feeder, settings);
            if (sequence.head1.feeder !== '') this.placeDown(1, sequence, feeder, settings);
        }
    }

    //Pick up routine
    pickUp(headnumber, sequence, feeders, settings){
        this.#Gcode.push("T"+headnumber);
        const head = headnumber === 0 ? sequence.head0 : sequence.head1;
        const newxpos = head.feeder.xpos + (headnumber === 0 ? 0 : settings.machine.nozzleoffsetx);
        const newypos = head.feeder.ypos - (headnumber === 0 ? 0 : settings.machine.nozzleoffsety);
        this.#Gcode.push(("G0 X" + Math.round(newxpos*100)/100 + " Y" + Math.round(newypos*100)/100));
        this.#Gcode.push("M400");
        this.#Gcode.push("M280 P" + headnumber + " S" + settings.machine.nozzle0bot);
        this.#Gcode.push((headnumber === 0) ? "M42 P41 S255" : "M42 P51 S255");
        this.#Gcode.push("M400");
        this.#Gcode.push("M280 P" + headnumber + " S" + settings.machine.nozzle0top);
    }

    //Placement routine
    placeDown(headnumber, sequence, feeders, settings){
        const head = headnumber === 0 ? sequence.head0 : sequence.head1;
        const newxpos = head.placement.xpos - (headnumber === 0 ? 0 : settings.machine.nozzleoffsetx);
        const newypos = head.placement.ypos - (headnumber === 0 ? 0 : settings.machine.nozzleoffsety);
        this.#Gcode.push("G1 F8000 X" + Math.round(newxpos*100)/100+ " Y" + Math.round(newypos*100)/100);
        this.#Gcode.push("M280 P" + headnumber + " S" + settings.machine.nozzle0bot);
        this.#Gcode.push(headnumber === 0 ? "M42 P41 S255" : "M42 P51 S255");
        this.#Gcode.push(headnumber === 0 ? "M42 P50 S255" : "M42 P52 S255");
        this.#Gcode.push("M400");
        this.#Gcode.push("M280 P" + headnumber + " S" + settings.machine.nozzle0top);
        this.#Gcode.push(headnumber === 0 ? "M42 P50 S0" : "M42 P52 S0");
    }
    getAll(){
        return this.#Gcode;
    }
}

//Write a gcode array to file.
async function gCodeToFile(gcode){
    const textform = gcode.join('\n');
    await fs.promises.writeFile(path.join(__dirname, '../files/output.txt'), textform, 'utf-8');
}

module.exports = { PathPlanning, MachineStartupSequenceService, GenerateGCode, gCodeToFile };