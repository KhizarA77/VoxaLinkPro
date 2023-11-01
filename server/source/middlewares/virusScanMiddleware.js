// Make sure to import the required modules at the top of your file
const NodeClam = require('clamscan');
const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

// Initialize clamscan asynchronously
let clamscan = null;
new NodeClam().init({
  removeInfected: true,
  quarantineInfected: false,
  scanLog: null,
  debugMode: false,
  fileList: null,
  scanRecursively: true,
  clamscan: {
    path: 'C:\\Program Files\\ClamAV\\clamscan.exe',
    db: null,
    scanArchives: true,
    active: true
  },
  clamdscan: {
    socket: false,
    host: false,
    port: false,
    timeout: 60000,
    localFallback: false,
    path: 'C:\\Program Files\\ClamAV\\clamdscan.exe',
    configFile: null,
    multiscan: false,
    reloadDb: false,
    active: true
  },
  preference: 'clamscan'
}).then((instance) => {
  clamscan = instance;
}).catch((err) => {
  console.error('Could not initialize clamscan', err);
});

exports.virusScan = async (req, res, next) => {
  // Ensure clamscan is initialized before proceeding
  if (!clamscan) {
    return res.status(500).send('ClamAV scan instance not initialized');
  }
  
  try {
    const { isInfected, file, viruses } = await clamscan.isInfected(`..\\server\\${req.file.path}`);
    if (isInfected) {
      await unlinkAsync(file);
      return res.status(400).send({
        message: 'The file is infected with a virus!',
        viruses: viruses,
      });
    }
    console.log(`No virus detected`);
    next();
  } catch (err) {
    console.error('An error occurred during the virus scan', err);
    return res.status(500).send('Error scanning the file for viruses');
  }
};