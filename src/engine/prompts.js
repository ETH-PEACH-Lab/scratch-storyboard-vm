const pseudoOpcode = require('./pseudo-opcode').default;

const understandingFeedbackPrompt = function (vm, language) {
    const prompt = `You are an assistant that gives structured feedback on a middle school students' Scratch projects.
You will be given a project description, a list of behaviors, and a reference project, basically a solution to the project the student should rebuild.
The project description and list of behaviors will be in ${language}.
Your task is to provide feedback on the project in ${language}, including:
1. On the description of the project.
2. On the list of global variables used in the project.
3. And for each sprite on a list of behaviors used in the project.
    
Here is the reference project the pseudo code of the sprites behavior.
${vm.referenceProjectPseudoCodeString}

Everything below is the students' project description and behaviors.
Project title: ${vm.storyboardOverall.title}
Overall project description: ${vm.storyboardOverall.description}
A list of global variables: ${vm.storyboardOverall.globalVariables}

The behavior names for each sprite:
${JSON.stringify(vm.runtime.targets.map(target => ({
        name: target.getName(),
        behaviors: target.sprite.behaviors.map(behavior => ({
            name: behavior.name
        }))
    })))}

First try to understand the reference project as it is a solution to the project (what is happening?). 
But don't state what you have understood it in the feedback neither that you have access to the pseudocode.
Then based on the students' project description and the solution give feedback on the students' description.
The point of this feedback is to help the student plan the project and understand the missing parts before starting to implement it. 
Don't be too long, but be specific and clear.
`.trim();

        return prompt;
    }

const planningFeedbackPrompt = function (vm, language) {

        const prompt = `You are an assistant that gives structured feedback on students' Scratch projects.
You will be given a project description, a list of behaviors, and a reference project.
The project description and list of behaviors will be in ${language}.
Your task is to provide feedback on the project in ${language}, including:
1. On the description of the project.
2. On the list of global variables used in the project.
3. And for each sprite on a list of behaviors used in the project, 
including their descriptions and any related sprites or blocks.

Here is the reference project pseudo code from each sprite:
${vm.referenceProjectPseudoCodeString}

You have given feedback on the project description and the behaviors in the previous step. Now the student is ready to plan the project.
Which means they are further describing the behaviors with variables, related sprites, sounds, costumes. 
The variables were selected from a predefined list including the global variables and the sprite variables like x, y coordinates.
The related sprites were also selected from a predefined list of sprites that are part of the project, excluding the sprite this behavior belongs to.
The point of this feedback is to help the student plan the project and understand the missing parts before starting to implement it.

Everything below is the students' project description and behaviors.
The project title: ${vm.storyboardOverall.title}
The overall project description:
${vm.storyboardOverall.description}
The global variables comma-separated: ${vm.storyboardOverall.globalVariables}

The sprite behaviors:
${JSON.stringify(vm.runtime.targets.map(target => ({
        name: target.getName(),
        behaviors: target.sprite.behaviors.map(behavior => ({
            name: behavior.name,
            description: behavior.description,
            variables: behavior.variables,
            relatedSprites: behavior.relatedSprites,
            relatedBlocks: behavior.relatedBlocks
        }))
    })))}
    
The feedback should be structured as follows:
{
    "overallDescriptionFeedback": "correctness and completeness of the overall project description.",
    "globalVariablesFeedback": "correctness and completeness of the global variables.",
    "sprites": [
        {
            "name": "Sprite name",
            "behaviors": [
                {
                    "name": "Behavior name",
                    "feedback": {
                        "variables": "correctness and completeness of the behavior variables.",    
                        "description": "correctness and completeness of the behavior description.",  
                        "sounds": "correctness and completeness of the sounds.",
                        "costumes": "correctness and completeness of the costumes.",
                        "relatedSprites": "correctness and completeness of the related sprites.",
                    }
                }
            ]
            
        }
    ]
}

Always add the feedback in the corresponding field of the sprite and behavior. If there is no behavior for a specific sprite do not make it up. 
Only give feedback in the json feedback structure with double quotes with the keys mentioned above. 
And for the fields like relatedSprites and variables give feedback about completeness and correctness do not list the individual items in the list.
`.trim();

        if (vm.feedbacks.length > 0) {
            const matches = vm.feedbacks.filter(item => item.type === 'understanding');
            const lastMatch = matches.at(-1);
            const lastResponse = lastMatch ? lastMatch.response : '';
            if (lastMatch && lastResponse) {

                const lastPrompt = lastMatch ? lastMatch.prompt : '';
                const memory = `The last prompt including the last state of the description was 
                ${lastPrompt}. 
                And the last feedback response was: ${lastResponse}`;
                const finalPrompt = prompt + memory;
                return finalPrompt;
            }
        }

        return prompt;
    }

const statusFeedbackPrompt = function (feedback) {
        const prompt = `
Based on the following feedback, state if the corresponding components of the sprite and behavior are Complete, Incomplete or NeedsImprovement

here is the feedback: ${feedback}

The output should look like this, but have the sprite names from the project and feedback above:

{
    "overallDescriptionFeedback": "NeedsImprovement",
    "globalVariablesFeedback": "Complete",
    "sprites": [
        {
            "name": "Sprite name 1",
            "behaviors": [
                { 
                    "name": "Behavior name 1",
                    "feedback": {
                        "description": "NeedsImprovement",
                        "variables": "Complete",
                        "sounds": "Complete",
                        "costumes": "Complete",
                        "relatedSprites": "Incomplete"
                    }
                } 
            ]
        },
        {
            "name": "Sprite name 2",
            "behaviors": [
                { 
                    "name": "Behavior name 3",
                    "feedback": {
                        "description": "NeedsImprovement",
                        "variables": "Incomplete",
                        "sounds": "Complete",
                        "costumes": "Complete",
                        "relatedSprites": "Complete"
                    }
                } 
            ]
        }
    ]
}

Based on the given feedback make a prediction of the status of the component for all sprites and all behaviors and all fields. 
If there is no behavior for a specific sprite do not make it up. And for the fields like relatedSprites and variables also only select the status whether the list is Complete or Incomplete or NeedsImprovement if a wrong option was selected.
`.trim();
        return prompt;
    }

const rewritingPrompt = function (vm, behaviorIndex) {
        return `You are an assistant that rewrites students project descriptions of a sprite's behavior to a more detailed. 
        Try to guess what the students mean. This description will be used to translate into a pseudo code of executable Scratch 3.0 blocks.
        Here is the one behavior description for the sprite ${vm.editingTarget.getName()}:
        ${vm.editingTarget.sprite.behaviors[behaviorIndex].description}

        You can start with 'oh you mean' or 'oh du meinst' if ${vm.getLocale().language === 'de'} and then rewrite the description.
    `;
    }

const goodEnoughPrompt = (vm, id) => {
        return `You are an expert in programming education. Given a student's natural language plan for a Scratch project, your job is to judge whether this plan is specific enough to generate Scratchblocks without additional clarification.
The plan should include concrete, observable actions (e.g., motion, events, conditions, interactions) and ideally specify agents, targets, and conditions. 
Please return:
is_specific: true or false
explanation: a short sentence explaining your reasoning
clarification: as the student to clarify the plan if it is not specific enough.
description: the original student plan rewritten if the is_specific is true.

If an example plan is
Student plan:
"The bowl should pick up the red apple."
Then the response should be
{
  "is_specific": false,
  "explanation": "The plan lacks concrete actions like movement direction, sensing, or interaction triggers; 'pick up' is ambiguous in Scratch.",
  "clarification": "Please specify how the bowl should pick up the apple, e.g., 'move to the apple and use a grabbing action'.",
  "description": ""
}

if the student plan is good enough, then the response should be
{
  "is_specific": true,
  "explanation": "The plan includes specific actions and conditions that can be directly translated into Scratch blocks.",
  "clarification": "",
  "description": "Move the bowl left and right until it touches the red apple, then hide the apple."
}
  
Here are some more examples of too vague and good plans:

too vague plans:
"The bowl should pick up the red apple."
"The cat should get to the finish line."
"Make the character dance when it wins."
"It should look happy when things go well."
"The cat kills the enemy."

good plans:
"Move the bowl to the right until it touches the red apple, then hide the apple."
"When the green flag is clicked, make the sprite say 'Hello!' for 2 seconds."
"If the score is greater than 10, play a sound and show the you win sprite."
"Repeat 5 times: move 10 steps, then turn 15 degrees."
"If the character is touching the red apple, change score by 1 and hide the apple."

The student's language has this language code ${vm.getLocale().language}. Explanation, clarification, and description should be in the same language.

Student plan for the sprite ${vm.editingTarget.getName()}:
 "${vm.editingTarget.comments[id].text}"
`;
    }    

const translationPrompt = function (vm) {
        return `You are an assistant that translates project descriptions and sprite behaviors to a Scratch 3.0 project json.
The project description and sprite behaviors are in ${vm.getLocale().language} and need to be translated to English.

Here is the project title:
${vm.storyboardOverall.title}

Here is the overall project description (How the game works (rules, win/loss condition, scoring, levels?)):
${vm.storyboardOverall.description}

Here are the global variables comma-separated that might be used for the win/loss conditions:
${vm.storyboardOverall.globalVariables}

Here are the list of behaviors (movement, interaction, control) for each sprite:
${JSON.stringify(vm.runtime.targets.map(target => ({
    name: target.getName(),
    behaviors: target.sprite.behaviors.map(behavior => ({
        name: behavior.name,
        description: behavior.description,
        variables: behavior.variables,
        sounds: behavior.sounds,
        costumes: behavior.costumes,
        relatedSprites: behavior.relatedSprites
    }))
})))}

Based on the description of the sprites behaviors, create pseudo code for each sprite that can be used to create a Scratch 3.0 project.

Here is the complete list of pseudo code blocks. Only use these pseudo code blocks to create the Scratch 3.0 project:
${JSON.stringify(Object.values(pseudoOpcode).map(block => ({
    opcode: block.opcode,
    pseudocode: block.pseudocode
})), null, 2)}

Here is an example of pseudo code for the behavior 'jumping on space key pressed' and 'reset score points and moving to starting position on green flag clicked' for Cat:

**Cat**

when [space v] key pressed
repeat (10)
    change y by (10)
end
repeat (10)
    change y by (-10)
end
change [Score v] by (1)

when @greenFlag clicked
go to x: (-180) y: (-130)
set [Score v] to [0]

The description of the project might be in a different language. This is the language code ${vm.getLocale().language}. If it is not English be aware to translate names to the target names, especially the sprite names.
The pseudo must be in the same format as the example above. Between every new group of blocks starting with 'when', after to block of lines there must be a new line.
Variables, sprite, costume and sound names should always be in round brackets () and no need to put the code in backticks or any other formatting.
Anything in brackets should either be a variable mentioned like a name or a number or a string where it makes sense. Escape < and >, if you want to use them as greater or smaller than.
`.trim();
    }    

const pseudocodePrompt = function (vm, behavior) {
        return `You are an assistant that generates Scratch 3.0 blocks pseudo code based on a behavior description of a sprite.
Here is a behavior description of sprite ${vm.editingTarget.getName()}:
${behavior.description}
    
Here is the complete list of pseudo code blocks that can be used to create the pseudo code for this behavior:
${JSON.stringify(Object.values(pseudoOpcode).map(block => ({
    opcode: block.opcode,
    pseudocode: block.pseudocode
})), null, 2)}

Do not write any text before or after the pseudo code, just the pseudo code blocks in the format of the example below. Start a new package of blocks/lines with a when block.
Here is an example of pseudo code for the behavior 'jumping on space key pressed' and 'reset score points and moving to starting position on green flag clicked':

when [space v] key pressed
repeat (10)
    change y by (10)
end
repeat (10)
    change y by (-10)
end
change [Punkte v] by (1)

when @greenFlag clicked
go to x: (-180) y: (-130)
set [Punkte v] to [0]
`;
    }     

module.exports = {
    understandingFeedbackPrompt,
    planningFeedbackPrompt,
    statusFeedbackPrompt,
    goodEnoughPrompt,
    rewritingPrompt,
    translationPrompt, 
    pseudocodePrompt
};    