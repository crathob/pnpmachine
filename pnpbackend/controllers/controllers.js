const services = require('../services/services');
const models = require('../models/models');
const settings = require('../config');
const nodepath = require('path');

async function generateGCode(req, res, next){
        //Check if the input files are present before processing
        if (!req.files?.['placements'] || !req.files?.['packages'] || !req.files?.['feeders']){
            return res.status(400).json({error: 'Missing three files'});
        }

        //Update board origin coordinate settings from user.
        settings.machine.cbo_x = req.body.posx;
        settings.machine.cbo_y = req.body.posy;     
        try{
            //Parse files into respective repositories before calling services
            const placements = (await models.PlacementRepository.fromFile(req.files['placements'][0].path)).getAll();
            const packages = (await models.PackageRepository.fromFile(req.files['packages'][0].path)).getAll();
            const feeders = (await models.FeederRepository.fromFile(req.files['feeders'][0].path)).getAll();

            //Use route planning to create a path for the gcode service
            const path = new services.PathPlanning(placements, packages, feeders);
            path.CreatePath();

            //Use path to generate the G-code for the machine, send to client.
            const Gcode = new services.GenerateGCode(path.getAll(), feeders, settings);
            await services.gCodeToFile(Gcode.getAll());
            res.download(nodepath.join(__dirname, '../files/output.txt'), 'GCode.txt');
        }    
        //error handling
        catch(err){
            //Return error to user if file validation fails
            return res.status(400).json({ error: err.message });
        }
    }

async function goToFirstPlacement(req, res, next){
    try{
        //Update board origin
        settings.machine.cbo_x = req.body.posx;
        settings.machine.cbo_y = req.body.posy;

        //Generate startup sequence and move to first placement.
        const startup = new services.MachineStartupSequenceService(settings);
        await services.gCodeToFile(startup.getAll());
        res.download(nodepath.join(__dirname, '../files/output.txt'), 'FirstPlacement.txt');
    }
    catch(err){
        next(err);
    }
    }

module.exports = {generateGCode, goToFirstPlacement};

