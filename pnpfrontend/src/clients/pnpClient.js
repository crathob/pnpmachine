import { Form } from "lucide-react";

const baseurl = 'http://localhost:30000/api/v1';


const generateGCode = async (placements, packages, feeders, posx, posy) => {
    const data = new FormData();
    data.append('placements', placements);
    data.append('packages', packages);
    data.append('feeders', feeders);
    data.append('posx', posx);
    data.append('posy', posy);

    const response = await fetch(`${baseurl}/gcode`,{
        method: 'POST',
        body: data
    });
    const blob = await response.blob();
    const tempurl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = tempurl;
    a.download = 'GCode.txt';
    a.click();
    window.URL.revokeObjectURL(tempurl);
}

const goToFirstPlacement = async (posx, posy) => {
    const data = new FormData();
    data.append('posx', posx);
    data.append('posy', posy);

    const response = await fetch(`${baseurl}/first`,{
        method: 'POST'
    });
    const blob = await response.blob();
    const tempurl2 = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = tempurl2;
    a.download = 'FirstPlacement.txt';
    a.click();
    window.URL.revokeObjectURL(tempurl2);
}

export {goToFirstPlacement, generateGCode};