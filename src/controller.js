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

//-----Validation-----//
//verify question types
//type, question = string
//if options relevant, make sure 1) exists and 2) array of strings based on req.body

//verify responses
//search for response by id
//expect req.body.response to be an obj
//key-value pairs with key as valid id of an existing question in survey
//remove key-value pairs that have invalid keys

//check response type
//if response is not an option in mc type questions, reject with error
//if question type is date or text, response value should be string
//if question type is date, check response value with regex to be in desired format; if not, reject with error

//adding a question
const validateQuestion = (questionIn) => {
  //check if question object has a type and a question
  const { type, question, options } = questionIn; //questionIn.type, questionIn.question, questionIn.options
  const validTypes = ["text", "mc", "date"];

  if (!type || !question) return false;
  if (typeof type !== "string" || typeof question !== "string") return false; //was ===?
  if (validTypes.includes(type)) return false; //can pass in just 'type into includes bc of destructuring

  if (type !== "mc") return true;
  if (!options) return false;
  if (!Array.isArray(options)) return false;
  if (options.reduce((arr, el) => arr && typeof el === "string", true))
    return false;
  return true;
};

//checking response
const validateResponses = (responses, survey) => {
  const regex = /^\d{2}-\d{2}$/;
  //check if responses is an array of objects
  if (!Array.isArray(responses)) return false;

  //check if response has relative id; if not, remove from response array
  //iterate over responses array
  for (const responseObj of responses) {
    let matchingQuestion;
    //iterate over questions array
    for (const questionObj of survey.questions) {
      if (questionObj.id === responseObj.id) {
        matchingQuestion = questionObj;
        break;
      }
    }
    if (!matchingQuestion) {
      //"flag" object we want to delete and remove responseObj from responses later
      responseObj.removeMe = true;
      continue; //go to next responseObj
    }
    //check if question has type mc, verify options exists in question and response exists in options
    if (
      matchingQuestion.type === "mc" &&
      !matchingQuestion.options.includes(responseObj.response)
    )
      responseObj.invalid = true; //if we find a response that is invalid
    //check if question has type date, verify format of response is correct (regex) /^\d{2}-\d{2}$/
    if (matchingQuestion.type === "date" && !regex.test(responseObj.response))
      //responseObj.response.match(regex)
      responseObj.invalid = true;
    //check if question has type text, verify response is type string
    if (
      matchingQuestion.type === "text" &&
      typeof responseObj.response !== "string"
    )
      responseObj.invalid = true;
  }

  //removing responseObjs without corresponding questions
  responses = responses.filter((obj) => !obj.removeMe); //responseObjs that we want to keep
  //flag responses that are outdated but have matching id to question and send error message to frontend
  return responses;
};

/*
// Survey
{
  "nextQuestionId": "#",
  "id": "",
  "name": "",
  "questions": [],
  "responses": []
}

// Questions
{
  "id": "#",
  "question": "",
  "type": "",
  "options" ["*"]
}

// Responses
{
  "id": "#",
  "response": ""
}
*/

//create survey
// surveyController.createSurvey = (name) => {
//   const id = "_" + Date.now(); //or use uuid
//   //create obj
//   const survey = {
//     nextQuestionId: 0, //initial id for each question
//     name,
//     id,
//     questions: [],
//     responses: [], //[[user 1 responses in order of questions in questions array], [user 2 responses in order of questions in questions array], ...]
//   };
//   //save to json with empty questions array and return survey to router
//   surveyController.saveFile(getSurveyDir(id), survey);
//   return survey;
// };

//alternative create survey:
surveyController.createSurvey = (req, res, next) => {
  const { name } = req.body; //const name = req.body.name
  const id = "_" + Date.now();
  const survey = {
    nextQuestionId: 0, //initial id for each question
    name,
    id,
    questions: [],
    responses: [],
  };
  surveyController.saveFile(getSurveyDir(id), survey);
  res.locals.newSurvey = survey;
  next();
};

//get survey
surveyController.getSurvey = (id) => {
  return surveyController.readFile(getSurveyDir(id));
};

//delete survey
surveyController.deleteSurvey = (id) => {
  return surveyController.deleteFile(getSurveyDir(id)); //would return undefined
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

//receive an array of responses
surveyController.saveResponse = (req, res, next) => {
  const { id } = req.params;
  const { response } = req.body;
  const survey = surveyController.getSurvey(id);

  let validatedResponses = validateResponses(response, survey);

  //if response is invalid
  if (!validatedResponses)
    return next("Did not receive expected array of responses!");

  //if responseObj has invalid property = true, return response array
  if (validatedResponses.find((obj) => obj.invalid)) {
    res.locals.survey = survey;
    res.locals.responses = validatedResponses;
    return next();
  }

  //if response is valid
  //modifying responses array by pushing received data into in-memory survey
  survey.responses.push(response);
  //saving back out to file
  surveyController.saveFile(getSurveyDir(id), survey);
  res.locals.survey = survey;
  return next();
};

//pre-migration to api
// surveyController.saveResponse = (id, response) => {
//   let validatedResponses = validateResponses(response);
//   if (!validatedResponses) return;
//   //if responseObj has invalid property = true, return response array
//   if (validatedResponses.find((obj) => obj.invalid)) return validatedResponses;
//   //reading from json
//   const survey = surveyController.getSurvey(id);
//   //modifying responses array by pushing received data into in-memory survey
//   survey.responses.push(response);
//   //saving back out to file
//   surveyController.saveFile(getSurveyDir(id), survey);
//   return survey;
// };

//create a question (generic)
surveyController.saveQuestion = (id, question) => {
  if (!validateQuestion(question)) return;

  //reading from json
  const survey = surveyController.getSurvey(id);
  //extract nextQuestionID from survey to set ID of incoming question
  const { nextQuestionID } = survey; //survey.nextQuestionID
  question.id = nextQuestionID;
  survey.nextQuestionID += 1;
  //adding questions to end of array of in-memory survey
  survey.questions.push(question);
  //saving back out to file
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

//delete a question (generic)
surveyController.deleteQuestion = (id, index) => {
  //reading from json
  const survey = surveyController.getSurvey(id);
  //delete a question based on its index placement in questions array
  survey.questions.splice(index, 1); // if use React on frontend, suppose component rerenders sequence of questions
  //saving back out to file
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

//reorder question, front end sends us instructions; assuming frontend does this by dnd, re-indexing
surveyController.reorderQuestion = (id, oldIndex, newIndex) => {
  //id of survey
  //oldIndex = previous position of question
  //newIndex = number of elements before question in new position of copy of questions array
  const survey = surveyController.getSurvey(id);
  const question = survey.questions.splice(oldIndex, 1); //removes question returns question in an array
  survey.questions.splice(newIndex, 0, ...question); //inserts question in new position
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

//modify question by overwriting old question with new changes; index, obj
//reorder via overwriting obj with what has been changed
surveyController.modifyQuestion = (id, index, newQuestion) => {
  const survey = surveyController.getSurvey(id);
  const questionObj = survey.questions[index]; //question = entire question obj
  //combining w/ previous question object, forming new question
  newQuestion = Object.assign(questionObj, newQuestion);

  //validating new question
  if (!validateQuestion(newQuestion)) return;

  survey.questions.splice(index, 1, newQuestion); //newQuestion = object from front end
  surveyController.saveFile(getSurveyDir(id), survey);
  return survey;
};

module.exports = surveyController;
