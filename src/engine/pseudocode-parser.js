/**
 * Creates a block object for Scratch VM.
 * @param {string} opcode - The opcode of the block.
 * @param {object} [inputs={}] - The inputs for the block.
 * @param {object} [fields={}] - The fields for the block.
 * @param {object} [extra={}] - Any extra properties for the block.
 * @returns {object} The block object.
 */
const createBlock = function (opcode, inputs = {}, fields = {}, extra = {}) {
    return {
        opcode,
        next: null,
        parent: null,
        inputs,
        fields,
        ...extra
    };
};

/**
 * Connects an array of block objects by setting their 'next' and 'parent' properties.
 * @param {Array<object>} blocks - The array of block objects to connect.
 * @returns {Array<object>} The connected array of block objects.
 */
const connectBlocks = function (blocks) {
    for (let i = 0; i < blocks.length - 1; i++) {
        blocks[i].next = blocks[i + 1].id;
        blocks[i + 1].parent = blocks[i].id;
    }
    return blocks;
};


/**
 * Generates a random 8-character string ID.
 * @returns {string} The generated ID.
 */
const generateId = function () {
    return Math.random().toString(36)
        .substr(2, 20);
};

const isNumber = val => /^-?\d+(\.\d+)?$/.test(val);
const wrapInput = val => (isNumber(val) ? [1, parseFloat(val)] : [1, val]);

/**
 * Parses a condition string and returns an object representing the parsed condition block.
 * @param {string} line - The condition string to parse.
 * @returns {object} Object representing the parsed condition block.
 */
const parseCondition = function (line) {
    line = line.trim();

    // Logical operators
    if (line.includes(' or ')) {
        const [left, right] = line.split(' or ');
        return createBlock('operator_or', {
            OPERAND1: parseCondition(left),
            OPERAND2: parseCondition(right)
        });
    }

    if (line.includes(' and ')) {
        const [left, right] = line.split(' and ');
        return createBlock('operator_and', {
            OPERAND1: parseCondition(left),
            OPERAND2: parseCondition(right)
        });
    }

    // Comparisons
    if (line.includes(' = ')) {
        const [left, right] = line.split(' = ');
        return createBlock('operator_equals', {
            OPERAND1: wrapInput(left),
            OPERAND2: wrapInput(right)
        });
    }

    if (line.includes(' \> ')) {
        const [left, right] = line.split(' \> ');
        return createBlock('operator_gt', {
            OPERAND1: wrapInput(left),
            OPERAND2: wrapInput(right)
        });
    }

    if (line.includes(' \< ')) {
        const [left, right] = line.split(' \< ');
        return createBlock('operator_lt', {
            OPERAND1: wrapInput(left),
            OPERAND2: wrapInput(right)
        });
    }

    // Sensing blocks
    if (line.startsWith('key ') && line.includes(' pressed')) {
        const key = line.match(/key \[(.*)\] pressed/)[1];
        return createBlock('sensing_keypressed', {
            KEY_OPTION: [1, key]
        });
    }

    if (line.startsWith('touching color ')) {
        const target = line.match(/touching color \((.+)\)/);
        return createBlock('sensing_touchingcolor', {
            COLOR: wrapInput(target[1]),
        });
    } else if (line.startsWith('touching ')) {
        const target = line.match(/touching \[(.*)\]/)[1];
        return createBlock('sensing_touchingobject', {
            TOUCHINGOBJECTMENU: [1, target]
        });
    }

    if (line.startsWith('not ')) {
        const inner = line.slice(4).trim();
        return createBlock('operator_not', {
            OPERAND: parseCondition(inner)
        });
    }

    if (line.includes(' contains ')) {
        const target = line.match(/\((.+)\) contains \((.+)\)\?/);
        return createBlock('operator_contains', {
            TEXT: wrapInput(target[1]),
            SUBSTRING: wrapInput(target[2])
        });
    }

    if (line.includes(' is touching color ')) {
        const target = line.match(/color \((.+)\) is touching color \((.+)\)/);
        return createBlock('sensing_coloristouchingcolor', {
            COLOR1: wrapInput(target[1]),
            COLOR2: wrapInput(target[2])
        });
    }

};

const blockPatterns = [
    {
        match: /^say \[(.+)\]$/, // say [Hello!]
        opcode: 'looks_say',
        inputs: match => ({
            MESSAGE: wrapInput(match[1])
        })
    },
    {
        match: /^think \[(.+)\]$/, // think [Hmm...]
        opcode: 'looks_think',
        inputs: match => ({
            MESSAGE: wrapInput(match[1])
        })
    },
    {
        match: /^switch costume to \[(.+?)\]$/,
        opcode: 'looks_switchcostumeto',
        inputs: match => ({
            COSTUME: [1, match[1]]
        })
    },
    {
        match: /^change \[(.+?) v\] by \((.+?)\)$/,
        opcode: 'data_changevariableby',
        inputs: match => ({
            VALUE: wrapInput(match[2])
        }),
        fields: match => ({
            VARIABLE: [match[1], match[1]]
        })
    },
    {
        match: /^set \[(.+?) v\] to \[(.+?)\]$/,
        opcode: 'data_setvariableto',
        inputs: match => ({
            VALUE: wrapInput(match[2])
        }),
        fields: match => ({
            VARIABLE: [match[1], match[1]]
        })
    },
    {
        match: /^set x to \((.+?)\)$/,
        opcode: 'motion_setx',
        inputs: match => ({
            X: [1, parseFloat(match[1])]
        })
    },
    {
        match: /^set y to \((.+?)\)$/,
        opcode: 'motion_sety',
        inputs: match => ({
            Y: [1, parseFloat(match[1])]
        })
    },
    {
        match: /^change x by \((.+?)\)$/,
        opcode: 'motion_changex',
        inputs: match => ({
            X: [1, parseFloat(match[1])]
        })
    },
    {
        match: /^change y by \((.+?)\)$/,
        opcode: 'motion_changey',
        inputs: match => ({
            Y: [1, parseFloat(match[1])]
        })
    },
    {
        match: /^go to \[(.+?)\]$/, // go to [random position]
        opcode: 'motion_goto',
        inputs: match => ({
            TO: [1, match[1]]
        })
    },
    {
        match: /^go to x: \\((.+)\\) y: \\((.+)\\)$/, // go to x: (100) y: (200)
        opcode: 'motion_gotoxy',
        inputs: match => ({
            X: [1, match[1]],
            Y: [1, match[2]]
        })
    },
    {
        match: /^move \((.+)\) steps$/,
        opcode: 'motion_movesteps',
        inputs: match => ({
            STEPS: wrapInput(match[1])
        })
    },
    {
        match: /^turn (left|right) \((.+?)\) degrees$/,
        opcode: match => (match[1] === 'left' ? 'motion_turnleft' : 'motion_turnright'),
        inputs: match => ({
            DEGREES: wrapInput(match[2])
        }),
        fields: match => ({
            DIRECTION: [match[1], match[1]]
        })
    },
    {
        match: /^broadcast \[(.+?) v\]$/,
        opcode: 'event_broadcast',
        inputs: match => ({
            BROADCAST_INPUT: [1, match[1]]
        }),
        fields: match => ({
            BROADCAST_OPTION: [match[1], match[1]]
        })
    },
    {
        match: /^broadcast \[(.+?) v\] and wait$/,
        opcode: 'event_broadcastandwait',
        inputs: match => ({
            BROADCAST_INPUT: [1, match[1]]
        }),
        fields: match => ({
            BROADCAST_OPTION: [match[1], match[1]]
        })
    },
    {
        match: /^create clone of \[(.+?)\]$/,
        opcode: 'control_create_clone_of',
        inputs: match => ({
            CLONE_OPTION: [1, match[1]]
        })
    },
    {
        match: /^delete this clone$/,
        opcode: 'control_delete_this_clone'
    },
    {
        match: /^stop ((all|this script|other scripts in sprite))$/,
        opcode: 'control_stop',
        inputs: match => ({
            STOP_OPTION: ["all", match[1]]
        })
    },
    {
        match: /^wait \((.+?)\) seconds$/,
        opcode: 'control_wait',
        inputs: match => ({
            DURATION: [1, parseFloat(match[1])]
        })
    },
    {
        match: /^wait until <(.+?)>$/,
        opcode: 'control_wait_until',
        inputs: match => ({
            CONDITION: [2, parseCondition(match[1])]
        })
    },
    {
        match: /^stop all sounds$/,
        opcode: 'sound_stopallsounds'
    },
    {
        match: /^play sound \[(.+?) v\]$/,
        opcode: 'sound_play',
        inputs: match => ({
            SOUND_MENU: [1, match[1]] // match[1] actually id of child: sound_sounds_menu child with name of the sound
        })
    },
    {
        match: /^play sound \\((.+) v\\) until done/,
        opcode: 'sound_playuntildone',
        inputs: match => ({
            SOUND_MENU: [1, match[1]] // sound_sounds_menu child with name of the sound
        })
    },
    {
        match: /hide/,
        opcode: 'looks_hide',
        inputs: match => ({})
    },
    {
        match: /show/,
        opcode: 'looks_show',
        inputs: match => ({})
    },
    {
        match: /([-+]?\d*\.?\d+)/,
        opcode: 'math_number',
        fields: match => ({
            NUM: [1, parseFloat(match[0])]
        }),
    }
];

/**
* Parses pseudo code into a structured format that can be used to create blocks in Scratch.
* @param {string}  code "pseudo code"
* @returns {Array<object>} Array of script objects representing parsed blocks.
*/
const parsePseudoCode = function (code) {
    const lines = code.split('\n').map(line => line.trim())
        .filter(Boolean);
    const stack = [];
    const scripts = [];

    let currentScript = null;
    let matched = true;

    for (let line of lines) {
        console.log(line)
        if (line === 'end') {
            if (matched && stack.length > 0) {
                const context = stack.pop();
                const childBlocks = connectBlocks(context.children);
                currentScript.blocks[context.id] = context.block;
                currentScript.blocks[context.id].inputs.SUBSTACK = [2, childBlocks[0]];
                for (let i = 0; i < childBlocks.length; i++) {
                    currentScript.blocks[childBlocks[i].id] = childBlocks[i];
                }
                stack[stack.length - 1]?.children.push(context.block);
            } else {
                console.warn('At least one line did not match before "end"');
                return [];
            }
            if (!matched) {
                console.warn(`Unhandled line: "${line}"`);
            }
        } else if (line.startsWith('when')) {
            if (currentScript) scripts.push(currentScript);
            currentScript = {
                topBlock: generateId(),
                blocks: {}
            };

            const id = currentScript.topBlock;
            let blockType = '';
            let fields = {};
            let inputs = {};

            // Match different kinds of 'when' blocks
            if (line === 'when @greenFlag clicked' || line === 'when green flag clicked') {
                blockType = 'event_whenflagclicked';
            } else if (line === 'when this sprite clicked') {
                blockType = 'event_whenthisspriteclicked';
            } else if (/when backdrop switches to \[(.+?)\]/.test(line)) {
                const match = line.match(/when backdrop switches to \[(.+?)\]/);
                blockType = 'event_whenbackdropswitchesto';
                fields = { BACKDROP: [match[1], null] };
            } else if (/when I receive \[(.+?)\]/.test(line)) {
                const match = line.match(/when I receive \[(.+?)\]/);
                blockType = 'event_whenbroadcastreceived';
                fields = { BROADCAST_OPTION: [match[1], null] };
            } else if (/when \[(.+?)\] key pressed/.test(line)) {
                const match = line.match(/when \[(.+?)\] key pressed/);
                blockType = 'event_whenkeypressed';
                fields = { KEY_OPTION: [match[1], null] };
            } else if (/when \[(.+?)\] > \((.+?)\)/.test(line)) {
                const match = line.match(/when \[(.+?)\] > \((.+?)\)/);
                blockType = 'event_whengreaterthan';
                fields = { WHENGREATERTHANMENU: [match[1], null] };
                inputs = { VALUE: [1, [10, match[2]]] }; // assuming type 10 is number literal
            } else {
                console.warn(`Unrecognized when block: "${line}"`);
                matched = false;
            }

            currentScript.blocks[id] = createBlock(blockType, fields, inputs, { id }, {
                shadow: false,
                topLevel: true,
                x: 100,
                y: 150
            });
            matched = true;
        } else if (line === 'forever') {
            const id = generateId();
            const block = createBlock('control_forever', {}, {}, { id });
            currentScript.blocks[id] = block;
            stack.push({ id, block, children: [] });
            matched = true;
        } else if (/^repeat\s*\((.+?)\)/.test(line)) {
            const match = line.match(/^repeat\s*\((.+?)\)/);
            const times = match[1];
            const id = generateId();
            const block = createBlock('control_repeat', { TIMES: [1, [10, times]] }, {}, { id });
            currentScript.blocks[id] = block;
            stack.push({ id, block, children: [] });
            matched = true;
        } else if (/^repeat until\s*<(.+?)>/.test(line)) {
            const match = line.match(/^repeat until\s*<(.+?)>/);
            const conditionText = match[1];
            const id = generateId();
            const conditionBlock = parseCondition(conditionText);
            const block = createBlock('control_repeat_until', {
                CONDITION: [2, conditionBlock]
            }, {}, { id });
            currentScript.blocks[id] = block;
            stack.push({ id, block, children: [] });
            matched = true;
        } else if (line.startsWith('if')) {
            if (line.match(/if\s*<(.+?)>\s*then/)) {
                const condition = line.match(/if\s*<(.+?)>\s*then/)[1];
                const conditionBlock = parseCondition(condition);
                const conditionId = generateId();
                const id = generateId();
                const block = createBlock('control_if', {
                    CONDITION: [2, conditionId]
                }, {}, { id });
                currentScript.blocks[id] = block;
                currentScript.blocks[conditionId] = conditionBlock;
                stack.push({ id, block, children: [] });
                matched = true;
            } else {
                console.warn(`Unrecognized if condition: "${line}"`);
                matched = false;
            }
        } else if (line.startsWith('else')) {
            if (stack.length > 0) {
                const context = stack[stack.length - 1];
                if (context.block.opcode === 'control_if') {
                    // Create if-else block
                    const id = generateId();
                    const ifElseBlock = createBlock('control_if_else', {}, {}, { id });

                    // Transfer the CONDITION and SUBSTACK from the original 'if'
                    ifElseBlock.inputs.CONDITION = context.block.inputs.CONDITION;
                    ifElseBlock.inputs.SUBSTACK = context.block.inputs.SUBSTACK;

                    // Replace the old block in the parent context
                    const parentContext = stack[stack.length - 1];
                    parentContext.children = parentContext.children.map(child =>
                        child === context.block ? ifElseBlock : child
                    );

                    // Push context to fill SUBSTACK2 (the else body)
                    stack.push({
                        id,
                        block: ifElseBlock,
                        children: []
                    });
                    matched = true;
                } else {
                    console.warn('Else without matching if block');
                    matched = false;
                }
            } else {
                console.warn('Else without any if block in stack');
                matched = false;
            }
        } else if (line.startsWith('go to [random position')) {
            const id = generateId();
            currentScript.blocks[id] = createBlock('motion_goto', {
                TO: [1, 'random position']
            }, {}, { id });
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else {
            for (const pattern of blockPatterns) {
                const match = line.match(pattern.match);
                if (match) {
                    console.log(`Matched pattern: ${pattern.opcode}`);
                    const id = generateId();
                    const opcode = typeof pattern.opcode === 'function' ? pattern.opcode(match) : pattern.opcode;
                    const inputs = pattern.inputs ? pattern.inputs(match) : {};
                    const fields = pattern.fields ? pattern.fields(match) : {};

                    currentScript.blocks[id] = createBlock(opcode, inputs, fields, { id }, {
                        shadow: false,
                        topLevel: false
                    });
                    stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
                    matched = true;
                    break;
                }    
                matched = false; 
            }
        }
        console.log(matched);
    }

    if (currentScript) {
        // Connect top-level blocks outside any control block
        const topLevelBlocks = Object.values(currentScript.blocks)
            .filter(b => !b.parent && !b.topLevel && !b.shadow);

        const connectedTopLevel = connectBlocks(topLevelBlocks);
        for (const block of connectedTopLevel) {
            currentScript.blocks[block.id] = block;
        }

        // Attach first to event block
        const topEvent = currentScript.blocks[currentScript.topBlock];
        if (topLevelBlocks.length > 0) {
            topEvent.next = topLevelBlocks[0].id;
            topLevelBlocks[0].parent = topEvent.id;
        }

        scripts.push(currentScript);
    }
    return scripts;
};

module.exports = parsePseudoCode;
