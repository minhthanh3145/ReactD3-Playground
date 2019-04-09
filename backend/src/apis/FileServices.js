const fs = require("fs");
const config = require("../config.js");
const absolutePathToUploadedFilesFolder =
  config.absolutePathToUploadedFilesFolder;
const FileUtils = require("../utils/FileUtils");

const FileServices = {
  exists(fileName) {
    return new Promise((resolve, reject) => {
      fs.readdir(absolutePathToUploadedFilesFolder, (err, files) => {
        if (err) {
          reject(err);
        } else {
          let exists = false;
          files.forEach(file => {
            if (file == fileName) {
              resolve(true);
            }
          });
          resolve(false);
        }
      });
    });
  },

  save(fileName, jsonContent) {
    return new Promise((resolve, reject) => {
      let pathToFile = absolutePathToUploadedFilesFolder + "/" + fileName;
      fs.writeFile(pathToFile, jsonContent, "utf8", err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  getContent(fileName) {
    return new Promise((resolve, reject) => {
      console.log(fileName);
      let pathToFile = absolutePathToUploadedFilesFolder + "/" + fileName;
      fs.readFile(pathToFile, "utf8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          let jsonified = JSON.parse(content);
          resolve(jsonified);
        }
      });
    });
  },

  getFiles() {
    return new Promise((resolve, reject) => {
      fs.readdir(absolutePathToUploadedFilesFolder, (err, files) => {
        if (files) {
          resolve(files);
        } else {
          reject(err);
        }
      });
    });
  },

  saveFileIfNotExisted(fileName, content) {
    return new Promise((resolve, reject) => {
      let jsonContent = FileUtils.parseCSVToJSON(content);
      let fileNameWithExtension = fileName;
      let extension = FileUtils.getExtension(fileNameWithExtension);
      if (extension == ".csv") {
        let fileNameWithoutExtension = fileNameWithExtension.replace(
          extension,
          ""
        );
        let jsonFileName = fileNameWithoutExtension + ".json";
        let thisRef = this;
        thisRef
          .exists(jsonFileName)
          .then(exists => {
            if (exists) {
              resolve({ exists: true, msg: "File already exists !" });
            } else {
              thisRef.save(jsonFileName, jsonContent).then(() => {
                resolve({
                  exists: false,
                  msg: jsonFileName + " has been successfully saved !"
                });
              });
            }
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }
};

module.exports = FileServices;
