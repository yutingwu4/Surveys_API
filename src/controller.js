//require in db of choice
const fs = require("fs");
const path = require("path");
const surveyController = {};

//method:
// const surveyController = {
//     saveFile(path, json)
// };

//helper function for directory
const getSurveyDir = (id) => {
  return `../surveys/${id}.json`;
};

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
    responses: [],
  };
  //save to json with empty questions array and return survey to router
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

//delete survey
surveyController.deleteSurvey = (id) => {
  return surveyController.deleteFile(getSurveyDir(id)); //would return undefined
};

//get survey
surveyController.getSurvey = (id) => {
  return surveyController.readFile(getSurveyDir(id));
};

//receieve an array of responses
surveyController.saveResponse = (id, response) => {
  //reading from json
  const survey = surveyController.getSurvey(id);
  //modifying responses array by pushing received data into in-memory survey
  survey.responses.push(response);
  //saving back out to file
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

//create a question (generic)
surveyController.saveQuestion = (id, question) => {
  //reading from json
  const survey = surveyController.getSurvey(id);
  //modifying questions array by pushing received data into in-memory survey
  survey.questions.push(question);
  //saving back out to file
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

//delete a question (generic)
surveyController.saveQuestion = (id, index) => {
  //reading from json
  const survey = surveyController.getSurvey(id);
  //delete a question based on its index placement in questions array
  survey.questions.splice(index, 1, "");
  //saving back out to file
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

//  {
//     type: "text",
//     question: "What is your name?"
//   }
//   {
//     type: "mc",
//     question: "Which color do you like the best?",
//     options: [
//       "Orange", "Green", "Blue", "Red"
//     ]
//   }

module.exports = surveyController;
