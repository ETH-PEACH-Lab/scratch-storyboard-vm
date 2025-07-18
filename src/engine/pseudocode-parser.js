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

    if (line.includes(' > ')) {
        const [left, right] = line.split(' > ');
        return createBlock('operator_gt', {
            OPERAND1: wrapInput(left),
            OPERAND2: wrapInput(right)
        });
    }

    if (line.includes(' < ')) {
        const [left, right] = line.split(' < ');
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

    if (line.startsWith('touching ')) {
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
        match: /^change \[(.+?) v\] by \[(.+?)\]$/,
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
        match: /^go to \[(.+?)\]$/, // go to [random position]
        opcode: 'motion_goto',
        inputs: match => ({
            TO: [1, match[1]]
        })
    },
    {
        match: /^move \((.+?)\) steps$/,
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
        match: /^switch costume to \[(.+?)\]$/,
        opcode: 'looks_switchcostumeto',
        inputs: match => ({
            COSTUME: [1, match[1]]
        })
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
    let matched = false;

    for (const line of lines) {
        if (line.startsWith('when')) {
            if (currentScript) scripts.push(currentScript);
            currentScript = {
                topBlock: generateId(),
                blocks: {}
            };

            const id = currentScript.topBlock;
            currentScript.blocks[id] = createBlock('event_whenflagclicked', {}, {}, {id}, {
                shadow: false,
                topLevel: true,
                x: 100,
                y: 150
            });
            matched = true;
        } else if (line === 'forever') {
            const id = generateId();
            const block = createBlock('control_forever', {}, {}, {id});
            stack.push({id, block, children: []});
            matched = true;
        } else if (line.startsWith('if')) {
            if (line.match(/if\s*<(.+?)>\s*then/)) {
                const condition = line.match(/if\s*<(.+?)>\s*then/)[1]; // check this property
                const conditionBlock = parseCondition(condition);
                const id = generateId();
                const block = createBlock('control_if', {
                    CONDITION: [2, conditionBlock]
                }, {}, {id});
                stack.push({id, block, children: []});
                matched = true;
            } else {
                console.warn(`Unrecognized if condition: "${line}"`);
                matched = false;
            }
        } else if (line.startsWith('wait until')) {
            const condition = line.match(/wait until\s*<(.+?)>/)[1];
            const conditionBlock = parseCondition(condition);
            const id = generateId();
            currentScript.blocks[id] = createBlock('control_wait_until', {
                CONDITION: [2, conditionBlock]
            }, {}, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line.startsWith('change') || line.startsWith('set')) {
            const match = line.match(/(change|set) \[(.+?) v\] (to|by) \[(.+?)\]/);
            if (match) {
                const [, action, variable, _operation, value] = match;
                const opcode = (action === 'change') ? 'data_changevariableby' : 'data_setvariableto';
                const id = generateId();
                currentScript.blocks[id] = createBlock(opcode, {
                    VALUE: [1, parseFloat(value)]
                }, {
                    VARIABLE: [variable, variable]
                }, {id});
                stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
                matched = true;
            }
        } else if (line.startsWith('key')) {
            // handled inside if
        } else if (line.startsWith('touching')) {
            // handled inside if
        } else if (line.startsWith('go to [random position')) {
            const id = generateId();
            currentScript.blocks[id] = createBlock('motion_goto', {
                TO: [1, 'random position']
            }, {}, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line.startsWith('set x to') || line.startsWith('set y to')) {
            const match = line.match(/set (x|y) to \((.+?)\)/);
            const axis = match[1];
            const value = parseFloat(match[2]);
            const opcode = axis === 'x' ? 'motion_setx' : 'motion_sety';
            const id = generateId();
            currentScript.blocks[id] = createBlock(opcode, {
                [axis.toUpperCase()]: [1, value]
            }, {}, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line.startsWith('change x by') || line.startsWith('change y by')) {
            const match = line.match(/change (x|y) by \((.+?)\)/);
            const axis = match[1];
            const value = parseFloat(match[2]);
            const opcode = axis === 'x' ? 'motion_changexby' : 'motion_changeyby';
            const id = generateId();
            currentScript.blocks[id] = createBlock(opcode, {
                [axis.toUpperCase()]: [1, value]
            }, {}, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line.startsWith('wait (')) {
            const match = line.match(/wait \((.+?)\) seconds/);
            const value = parseFloat(match[1]);
            const id = generateId();
            currentScript.blocks[id] = createBlock('control_wait', {
                DURATION: [1, value]
            }, {}, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line === 'hide' || line === 'show') {
            const opcode = line === 'hide' ? 'looks_hide' : 'looks_show';
            const id = generateId();
            currentScript.blocks[id] = createBlock(opcode, {}, {}, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line.startsWith('play sound')) {
            const match = line.match(/play sound \[(.+?) v\] until done/);
            const sound = match[1];
            const id = generateId();
            currentScript.blocks[id] = createBlock('sound_playuntildone', {}, {
                SOUND_MENU: [sound, sound]
            }, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line.startsWith('stop')) {
            const id = generateId();
            currentScript.blocks[id] = createBlock('control_stop', {
                STOP_OPTION: ['all', 'all']
            }, {}, {id});
            stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
            matched = true;
        } else if (line === 'end') {
            if (matched) {
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
        } else {
            matched = false;
            for (const pattern of blockPatterns) {
                const match = line.match(pattern.match);
                if (match) {
                    const id = generateId();
                    const opcode = typeof pattern.opcode === 'function' ? pattern.opcode(match) : pattern.opcode;
                    const inputs = pattern.inputs ? pattern.inputs(match) : {};
                    const fields = pattern.fields ? pattern.fields(match) : {};

                    currentScript.blocks[id] = createBlock(opcode, inputs, fields, {id}, {shadow: false,
                        topLevel: false});

                    stack[stack.length - 1]?.children.push(currentScript.blocks[id]);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                console.warn(`Unhandled line: "${line}"`);
            }
        }
    }

    if (currentScript) scripts.push(currentScript);
    return scripts;
};

module.exports = parsePseudoCode;
