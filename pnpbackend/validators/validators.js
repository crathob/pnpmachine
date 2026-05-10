const fs = require('fs');
const path = require('path');

function validatePlacements(line){
    const regex = /^[A-Z0-9]+\t[0-9.]+\t[0-9.]+\t[0-9.]+\t[A-Z0-9]+\t[A-Z0-9]+$/;
    return regex.test(line);
};

function validatePackages(line){
    const regex = /^[A-Z0-9]+\t[0-9.]+\t[0-9.]+$/;
    return regex.test(line);
};

function validateFeeders(line) {
    const regex = /^[A-Z0-9]+\t[0-9.]+\t[0-9.]+\t[0-9.]+\t[0-9]+\t[0-9]+$/;
    return regex.test(line);
};

module.exports = {validatePlacements, validatePackages, validateFeeders};