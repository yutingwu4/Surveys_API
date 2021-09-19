# Surveys_API

## Summary
Surveys API is a JSON REST API for creating, modifying, and submitting surveys.  This survey is an ordered list of questions that include:
- Text Entry (free form) (ex: "What is your name")
- Multiple Choice (ex: "Which color do you like the best? Choose one: [Orange, Green, Blue, Red]")
- Date (ex: "What is your birthdate?")
  - NOTE: This specifies a calendar date (not Datetime).

This exercise consists of two parts:
1. Design the logic for REST API endpoints (JSON) for the following functionality:
- Create a survey
- Modify a previously created survey
  - Add/Remove questions
  - Modify a question
  - Reorder questions
  - Change options for a Multiple Choice question
- Submit to/take the survey

2. Implement code.

### Out of scope
- Using a database or any persistent storage
- User management or identities (Assume API is used "anonymously," as a private service)
- Authentication
- Frontend
- Formal documentation

### Tech Specs
- Node version >v10
- Express server using `npm run dev` script and accessible locally on port 3001

## Getting Started
Run in terminal:
- `npm install`
- `npm run dev`

## Getting this app production-ready

![Alcove_notes](https://user-images.githubusercontent.com/74384669/121419744-26621d00-c921-11eb-9b32-c45a6786f022.png)

Assuming the provided feature set is complete, create a set of guidelines with internal team to determine what is considered "production-ready."  To transition from development to production mode, consider aligning standards and approaches for the following areas:
- Through code reviews, follow consistent naming conventions, discuss how to best handle error-handling, maintain readability,etc. (assuming that bottlenecks, single-points-of-failure, issues such as scalability/reliability/latency have been factored into the greater system design before implementing code)
- Where and how to document decisions and thought processes
- Testing (ie. unit, integration)/TDD
- Determine workflow for CI/CD, how to regularly evaluate performance

Once guidelines are set and code quality verified:
- Register for an URL/DNS
- Upload documents and have app be publicly available
- Establish a hosting service (may be on the cloud) which would take care of holding onto the app's documents and running the server, handle load balancing, traffic routing, service discovery, health checks, etc.


## Design Considerations

The API system has been built as a CRUD interface that enables HTTP requests to be stored in a flat-file database.  It accounts for extensibility by maintaining the flexibility for engineers to modify the functionality of each route or controller. The routes are written to accommodate a variety of question types, beyond the ones outlined under Product Description, that can be asked on any survey.  Currently, this system is written so that it receives some instructions from the frontend on how each CRUD operation should relay information to the backend.  However, details such as how the user takes the survey/enters responses, specification of question types, whether the questions are reordered through a dnd interface, or other interpretation of json are assumed to be handled by some kind of frontend component framework.

Some thoughts included:
- How easy would it be for a new contributor to pick up the project?
- How easy would it be to plug-in a database layer? 
- How easy would it be to add another type of survey question?
- How easy would it be to add other new features (search surveys / submissions, list submissions, store user data, etc)?

Testing of routes were performed through PostMan:
1) Adding a question to a new survey:

![postMan_addQ](https://user-images.githubusercontent.com/74384669/121431490-519f3900-c92e-11eb-8cb5-463cabf22e53.PNG)

2) Adding a response:

![postMan_responses2](https://user-images.githubusercontent.com/74384669/121432963-36352d80-c930-11eb-96de-160b1a6f2402.PNG)

3) Editing a question:

![postMan_editQ](https://user-images.githubusercontent.com/74384669/121431682-91feb700-c92e-11eb-9f72-cecb60236acf.PNG)

4) Reordering a question:

Before:

![postMan_survey_original_order2](https://user-images.githubusercontent.com/74384669/121432264-4dbfe680-c92f-11eb-9fe7-268ef6e91430.PNG)

After:

![postMan_survey_new_order2](https://user-images.githubusercontent.com/74384669/121432279-52849a80-c92f-11eb-92b8-361c3e2fe51a.PNG)

5) Delete a question:

Before:

![postMan_deleteQ](https://user-images.githubusercontent.com/74384669/121432743-e9515700-c92f-11eb-8862-88d2b54acc91.PNG)

After:

![postMan_deleteQ_after](https://user-images.githubusercontent.com/74384669/121432754-ece4de00-c92f-11eb-9a66-6d82d486b7eb.PNG)


## Future Implementations

Validation - question types and responses (logic written in pseudocode under controller.js).

Verifying question types: Validate that question types are in strings.  If, for example, a question type is "mc" (multiple choice), make sure that the question has "options" as a key and an array of strings as the corresponding value.

Verifying responses: First, expect that the req.body.response is an object.  Then check if each key's corresponding value represents a valid id in the data store, meaning that the response is an answer to an existing question in the survey.  Optional: for every key that has an invalid id, remove that key-value pair.

Verifying response type: Example scenarios to determine whether questions can be added to survey
- If question type is date or textheck, check if each response is in a string or desired format (can use regex).  If not, question is not added.  
- If question type is "mc" (multiple choice) but has no options, question is not added.# Surveys_API
