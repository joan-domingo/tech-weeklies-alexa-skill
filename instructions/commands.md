https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html

→ ask deploy

That command will take care of everything required to create a skill, create a lambda function and link them together. It also updates .ask/config file with the skill ID and lambda function information. So next time the tool would know which skill and which lambda function to update. Because of that, we can use the same command to redeploy our skill.

If we change only the implementation inside index.js we can deploy only lambda function by targeting it:

→ ask deploy -t lambda

→ ask dialog

Your skill is now deployed and enabled in the development stage. Try simulate your Alexa skill skill using "ask dialog" command.
