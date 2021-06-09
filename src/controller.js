//require in db of choice
const fs = require("fs");
const path = require("path");
const surveyController = {};

//method:
// const surveyController = {
//     saveFile(path, json)
// };

//writes json into file
surveyController.saveFile = (link, json) => {
  const filePath = path.join(__dirname, link);
  fs.writeFileSync(filePath, JSON.stringify(json));
};

//read data from json
surveyController.readFile = (link) => {
  //retrieve json
  const filePath = path.join(__dirname, link);
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

//delete json file
surveyController.deleteFile = (link) => {
  const filePath = path.join(__dirname, link);
  return fs.unlinkSync(filePath);
};

//create survey
surveyController.createSurvey = (name) => {
  const id = "_" + Date.now(); //or use uuid
  //create obj
  const survey = {
    name,
    id,
    questions: [],
  };
  //save to json with empty questions array and return survey to router
  surveyController.saveFile(`../surveys/${id}.json`, survey);
  return survey;
};

//delete survey
surveyController.deleteSurvey = (id) => {
  return surveyController.deleteFile(`../surveys/${id}.json`); //would return undefined
};

//get survey
surveyController.getSurvey = (id) => {
  return surveyController.readFile(`../surveys/${id}.json`);
};

module.exports = surveyController;
