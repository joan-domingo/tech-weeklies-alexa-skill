# Futurice Tech Weeklies Alexa Skill

## Skill Architecture
Each skill consists of two basic parts, a front end and a back end.
The front end is the voice interface, or VUI.
The voice interface is configured through the voice interaction model and can be found in the models folder.
The back end is where the logic of your skill resides. It's in the lambda folder.

## Skill Setup
This project was set up using the AWS ASK Command Line Interface (ASK-CLI).

## Deploy
* BE or Lambda function: it's build and deployed after each push on master with the help of
[Github Actions](.github/workflows/deployLambdaFunction.yml)
* FE or interaction models: `ask deploy -t model --force`
* Skill schema:  `ask deploy -t skill --force`

*IMPORTANT:* This project uses Typescript and needs to be compiled to Javascript before deploying to Lambda.
That's why only Github Actions will successfully deploy. Avoid `ask deploy` commands if you want to update
the Lambda Function.

## Simulate
Simulate the Alexa skill using `ask dialog --locale en-US` command.

## Debug
Find debug info [here](https://developer.amazon.com/blogs/alexa/post/77c8f0b9-e9ee-48a9-813f-86cf7bf86747/setup-your-local-environment-for-debugging-an-alexa-skill)

---

## Additional Resources

### Community
* [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/165/index.html) - Join the conversation!
* [Hackster.io](https://www.hackster.io/amazon-alexa) - See what others are building with Alexa.

### Tutorials & Guides
* [Voice Design Guide](https://developer.amazon.com/designing-for-voice/) - A great resource for learning conversational and voice user interface design.
* [Codecademy: Learn Alexa](https://www.codecademy.com/learn/learn-alexa) - Learn how to build an Alexa Skill from within your browser with this beginner friendly tutorial on Codecademy!

### Documentation
* [Official Alexa Skills Kit Node.js SDK](https://www.npmjs.com/package/ask-sdk) - The Official Node.js SDK Documentation
*  [Official Alexa Skills Kit Documentation](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html) - Official Alexa Skills Kit Documentation
