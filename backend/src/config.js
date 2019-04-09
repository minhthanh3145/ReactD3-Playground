
const uploadedFilesFolder = '/uploaded_files';
const path = require('path');

const config = {
    absolutePathToUploadedFilesFolder: path.join(__dirname, uploadedFilesFolder)
}

module.exports = config;
