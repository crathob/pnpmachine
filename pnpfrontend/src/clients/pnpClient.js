import { Form } from "lucide-react";
//Define back-end base url
const baseurl = 'http://localhost:30000/api/v1';

//Creates form data and appends files, positions to it.
const generateGCode = async (placements, packages, feeders, posx, posy) => {
    const data = new FormData();
    data.append('placements', placements);
    data.append('packages', packages);
    data.append('feeders', feeders);
    data.append('posx', posx);
    data.append('posy', posy);

    //Send files and coordinates to backend
    const response = await fetch(`${baseurl}/gcode`,{
        method: 'POST',
        body: data
    });

    //Start file download, create temp url and remove it.
    const blob = await response.blob();
    const tempurl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = tempurl;
    a.download = 'GCode.txt';
    a.click();
    window.URL.revokeObjectURL(tempurl);
}

const goToFirstPlacement = async (posx, posy) => {
    // Append origin coordinates to form data
    const data = new FormData();
    data.append('posx', posx);
    data.append('posy', posy);

    //Send origin coordinates to backend
    const response = await fetch(`${baseurl}/first`,{
        method: 'POST'
    });

    //Start file download
    const blob = await response.blob();
    const tempurl2 = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = tempurl2;
    a.download = 'FirstPlacement.txt';
    a.click();
    window.URL.revokeObjectURL(tempurl2);
}

export {goToFirstPlacement, generateGCode};