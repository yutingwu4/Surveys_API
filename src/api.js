const express = require("express");
const router = express.Router();
const surveyController = require("./controller");

//reading doc/json obj to pass surveys to front end

//post request to create survey
router.post("/new", (req, res) => {
  const name = req.body.name;
  const survey = surveyController.createSurvey(name);
  res.status(200).json(survey);
});

//returning get survey as json to front end
router.get("/:id", (req, res) => {
  const survey = surveyController.getSurvey(req.params.id);
  res.status(200).json(survey);
});

//remove survey
router.delete("/:id", (req, res) => {
  surveyController.deleteFile(req.params.id);
  res.status(200).send("Survey deleted!");
});

//create via post request each survey question as values
//text entry with label property
//date - type = date, has label

//modify previously created survey
//given survey id and question index, remove and modify question
//add new question to the end of array
//reorder via overwriting json obj

//collecting responses for corresponding questions
router.post("/responses/:id", (req, res) => {
  const survey = surveyController.saveResponse(
    req.params.id,
    req.body.response
  );
  res.status(200).json(survey);
});

//add a question (generic)
router.post("/addQuestion/:id", (req, res) => {
  const newQuestion = req.body.question;
  const survey = surveyController.saveQuestion(req.params.id, newQuestion);
  res.status(200).json(survey);
});

//delete a question (generic)
router.delete("/deleteQuestion/:id", (req, res) => {
  surveyController.deleteQuestion(req.params.id, req.body.index);
  res.status(200).send("Question removed!");
});

module.exports = router;
