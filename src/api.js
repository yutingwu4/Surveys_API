const express = require("express");
const router = express.Router();
const surveyController = require("./controller");

//post request to create survey
// router.post("/new", (req, res) => {
//   const name = req.body.name;
//   const survey = surveyController.createSurvey(name);
//   res.status(200).json(survey);
// });

//alternative post request:
router.post("/new", surveyController.createSurvey, (req, res, next) => {
  res.status(200).json(res.locals.newSurvey);
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

//-----create questions and responses via post request as values-----//
/* Example: 
{
    type: "text",
    question: "What is your name?"
  }

  {
    type: "mc",
    question: "Which color do you like the best?",
    options: [
      "Orange", "Green", "Blue", "Red"
    ]
  }

 {
    type: "date",
    question: "What is your birthdate?"
  }

  "responses": [
    {
      "What is your name?": "Herro",
      "Which color do you like the best?": "Orange"
    }
  ]

new question Front End:

fetch("/api/addQuestion/4", {
	method: "POST",
  	header: "...",
  	body: JSON.stringify({
    	type: "mc",
      	question: "Which color do you like?",
      	options: ["purple", "green"]
    })
});

id 4: req.params.id
req.body = {
    	type: "mc",
      	question: "Which color do you like?",
      	options: ["purple", "green"]
    }
//req.body.type = "mc"

fetch("/api/resequence/4", {
	method: "PUT",
  	header: "...",
  	body: JSON.stringify({
    	questionIndex: 5,
      	questionsBefore: 0
    })
});
*/

//collecting responses for corresponding questions
router.post(
  "/responses/:id",
  surveyController.saveResponse,
  (req, res, next) => {
    //if res.locals has responses key, return markup
    if (res.locals.responses)
      return res.status(400).json({
        survey: res.locals.survey,
        responses: res.locals.responses,
      });

    //if response is good
    res.status(200).json(res.locals.survey);
  }
);

//pre-validation
// router.post("/responses/:id", (req, res) => {
//   const survey = surveyController.saveResponse(
//     req.params.id,
//     req.body.response//array of response objs that user is sending in for survey
//   );
//   res.status(200).json(survey);
// });

//add a question (generic)
router.post("/addQuestion/:id", (req, res) => {
  const newQuestion = req.body;
  const survey = surveyController.saveQuestion(req.params.id, newQuestion);
  res.status(200).json(survey);
});

//delete a question (generic)
router.delete("/deleteQuestion/:id", (req, res) => {
  const updatedSurvey = surveyController.deleteQuestion(
    req.params.id,
    req.body.index
  );
  res.status(200).json(updatedSurvey);
});

//-----modify previously created survey-----//
//reorder a question (generic)
router.put("/resequenced/:id", (req, res) => {
  const currIndex = req.body.currIndex;
  const questionsBefore = req.body.questionsBefore;
  const survey = surveyController.reorderQuestion(
    req.params.id,
    currIndex,
    questionsBefore
  );
  res.status(200).json(survey);
});

//modify a question (generic)
router.put("/edit/:id/:index", (req, res) => {
  const currIndex = req.params.index;
  const question = req.body;
  const survey = surveyController.modifyQuestion(
    req.params.id,
    currIndex,
    question
  );
  res.status(200).json(survey);
});

module.exports = router;
