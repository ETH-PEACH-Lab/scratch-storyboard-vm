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
const wrapInputBlock = (value, blocks, typeHint = 'text', knownVariables, parentId) => {
    const id = generateId();
    let block;

    const isVariable = knownVariables.find(v => v.name === value)
    if (isVariable) {
        return {name: 'VARIABLE', id: isVariable.id, value: isVariable.name, variableType: isVariable.variableType}
    } else {

        switch (typeHint) {
            case 'math_number':
                block = createBlock('math_number', {}, {
                    NUM: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'positive_number':
                block = createBlock('math_positive_number', {}, {
                    NUM: [value && value > 0, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'angle':
                block = createBlock('math_angle', {}, {
                    ANGLE: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;    
            case 'text':
                block = createBlock('text', {}, {
                    TEXT: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'color':
                block = createBlock('colour_picker', {}, {
                    COLOUR: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'key_option':
                block = createBlock('sensing_keyoptions', {}, {
                    KEY_OPTION: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'broadcast_menu':
                block = createBlock('event_broadcast_menu', {}, {
                    BROADCAST_OPTION: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'sound_menu':
                block = createBlock('sound_sounds_menu', {}, {
                    SOUND_MENU: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'touching_object_menu':
                block = createBlock('sensing_touchingobjectmenu', {}, {
                    TOUCHINGOBJECTMENU: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            case 'clone_option':
                block = createBlock('control_create_clone_of_menu', {}, {
                    CLONE_OPTION: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
            default:
                block = createBlock('text', {}, {
                    TEXT: [value, null]
                }, { id, shadow: true, parent: parentId });
                break;
        }    
    }

    blocks[id] = block;
    if (typeHint === 'math_number' && isNumber(value)) {
        return [4, id]; // 4 is the type for number literals in Scratch
    }
    if (typeHint === 'math_positive_number' && isNumber(value) && value > 0) {
        return [5, id]; // 5 is the type for positive number literals in Scratch
    }
    if (typeHint === 'angle' && isNumber(value)) {
        return [6, id]; // 6 is the type for angle literals in Scratch
    }
    if (typeHint === 'color') {
        return [7, id]; // 7 is the type for angle literals in Scratch
    }
    return [1, id];
};



/**
 * Parses a condition string and returns an object representing the parsed condition block.
 * @param {string} line - The condition string to parse.
 * @returns {object} Object representing the parsed condition block.
 */
const parseCondition = function (line, blocks, knownVariables, parentId) {
    line = line.trim();
    const id = generateId();
    let block;

    // Logical operators
    if (line.includes(' or ')) {
        const [left, right] = line.split(' or ');
        block = createBlock('operator_or', {
            OPERAND1: parseCondition(left, blocks, knownVariables, id),
            OPERAND2: parseCondition(right, blocks, knownVariables, id)
        });
    }

    if (line.includes(' and ')) {
        const [left, right] = line.split(' and ');
        block = createBlock('operator_and', {
            OPERAND1: parseCondition(left, blocks, knownVariables, id),
            OPERAND2: parseCondition(right, blocks, knownVariables, id)
        });
    }

    // Comparisons
    if (line.includes(' = ')) {
        const [left, right] = line.split(' = ');
        block = createBlock('operator_equals', {
            OPERAND1: wrapInputBlock(left, blocks, 'math_number', knownVariables, id),
            OPERAND2: wrapInputBlock(right, blocks, 'math_number', knownVariables, id)
        });
    }

    if (line.includes(' \> ')) {
        const [left, right] = line.split(' \> ');
        block = createBlock('operator_gt', {
            OPERAND1: wrapInputBlock(left, blocks, 'math_number', knownVariables, id),
            OPERAND2: wrapInputBlock(right, blocks, 'math_number', knownVariables, id)
        });
    }

    if (line.includes(' \< ')) {
        const [left, right] = line.split(' \< ');
        block = createBlock('operator_lt', {
            OPERAND1: wrapInputBlock(left, blocks, 'math_number', knownVariables, id),
            OPERAND2: wrapInputBlock(right, blocks, 'math_number', knownVariables, id)
        });
    }

    // Sensing blocks
    if (line.startsWith('key ') && line.includes(' pressed')) {
        const key = line.match(/key \[(.*) v\] pressed/)[1];
        block = createBlock('sensing_keypressed', {
            KEY_OPTION: wrapInputBlock(key, blocks, 'key_option', knownVariables, id)
        });
    }

    if (line.startsWith('touching color ')) {
        const target = line.match(/touching color \((.+)\)/);
        block = createBlock('sensing_touchingcolor', {
            COLOR: wrapInputBlock(target[1], blocks, 'color', knownVariables, id),
        });
    } else if (line.startsWith('touching ')) {
        const target = line.match(/touching \[(.*) v\]/)[1];
        block = createBlock('sensing_touchingobject', {
            TOUCHINGOBJECTMENU: wrapInputBlock(target, blocks, 'touching_object_menu', knownVariables, id)
        });
    }

    if (line.startsWith('not ')) {
        const inner = line.slice(4).trim();
        block = createBlock('operator_not', {
            OPERAND: parseCondition(inner, blocks, knownVariables, id)
        });
    }

    if (line.includes(' contains ')) {
        const target = line.match(/\((.+)\) contains \((.+)\)\?/);
        block = createBlock('operator_contains', {
            TEXT: wrapInputBlock(target[1], blocks, 'text', knownVariables, id),
            SUBSTRING: wrapInputBlock(target[2], blocks, 'text', knownVariables, id)
        });
    }

    if (line.includes(' is touching color ')) {
        const target = line.match(/color \((.+)\) is touching color \((.+)\)/);
        block = createBlock('sensing_coloristouchingcolor', {
            COLOR1: wrapInputBlock(target[1], blocks, 'color', knownVariables, id),
            COLOR2: wrapInputBlock(target[2], blocks, 'color', knownVariables, id)
        });
    }

    if (parentId) {
        block.parent = parentId;
    }

    blocks[id] = block;
    return [2, id];

};

const blockPatterns = [
    {
        match: /^say \[(.+)\]$/, // say [Hello!]
        opcode: 'looks_say',
        inputs: (match, blocks, knownVariables, parentId) => ({
            MESSAGE: wrapInputBlock(match[1], blocks, 'text', knownVariables, parentId)
        })
    },
    {
        match: /^think \[(.+)\]$/, // think [Hmm...]
        opcode: 'looks_think',
        inputs: (match, blocks, knownVariables, parentId) => ({
            MESSAGE: wrapInputBlock(match[1], blocks, 'text', knownVariables, parentId)
        })
    },
    {
        match: /^switch costume to \[(.+?)\]$/,
        opcode: 'looks_switchcostumeto',
        inputs: (match, blocks, knownVariables, parentId) => ({
            COSTUME: wrapInputBlock(match[1], blocks, 'costume', knownVariables, parentId)
        })
    },
    {
        match: /^change \[(.+?) v\] by \((.+?)\)$/,
        opcode: 'data_changevariableby',
        inputs: (match, blocks, knownVariables, parentId) => ({
            VALUE: wrapInputBlock(match[2], blocks, 'math_number', knownVariables, parentId)
        }),
        fields: (match, blocks, knownVariables, parentId) => ({
            // {name: 'VARIABLE', id: 'Al[:dHi#gFpqIbHw/e`g', value: 'Score', variableType: ''}
            VARIABLE: wrapInputBlock(match[1], blocks, 'data_variable', knownVariables, parentId)
        })
    },
    {
        match: /^set \[(.+?) v\] to \[(.+?)\]$/,
        opcode: 'data_setvariableto',
        inputs: (match, blocks, knownVariables, parentId) => ({
            VALUE: wrapInputBlock(match[2], blocks, 'math_number', knownVariables, parentId)
        }),
        fields: (match, blocks, knownVariables, parentId) => ({
            VARIABLE: wrapInputBlock(match[1], blocks, 'data_variable', knownVariables, parentId)
        })
    },
    {
        match: /^point in direction \((.+?)\)$/,
        opcode: 'motion_pointindirection',
        inputs: {},
        fields: (match, blocks, knownVariables) => ({
            STYLE: {name: 'STYLE', id: undefined, value: match[1]} // Default direction is left-right, don't rotate, all around
        })
    },
    {
        match: /^set x to \((.+?)\)$/,
        opcode: 'motion_setx',
        inputs: (match, blocks, knownVariables, parentId) => ({
            X: [1, wrapInputBlock(match[1], blocks, 'math_number', knownVariables, parentId)]
        })
    },
    {
        match: /^set y to \((.+?)\)$/,
        opcode: 'motion_sety',
        inputs: (match, blocks, knownVariables, parentId) => ({
            Y: [1, wrapInputBlock(match[1], blocks, 'math_number', knownVariables, parentId)]
        })
    },
    {
        match: /^change x by \((.+?)\)$/,
        opcode: 'motion_changex',
        inputs: (match, blocks, knownVariables, parentId) => ({
            DX: [1, wrapInputBlock(match[1], blocks, 'math_number', knownVariables, parentId)]
        })
    },
    {
        match: /^change y by \((.+?)\)$/,
        opcode: 'motion_changey',
        inputs: (match, blocks, knownVariables, parentId) => ({
            DY: [1, wrapInputBlock(match[1], blocks, 'math_number', knownVariables, parentId)]
        })
    },
    {
        match: /^go to \[(.+?)\]$/, // go to [random position]
        opcode: 'motion_goto',
        inputs: (match, blocks, knownVariables, parentId) => ({
            TO: [1, wrapInputBlock(match[1], blocks, 'position', knownVariables, parentId)]
        })
    },
    {
        match: /^go to x: \\((.+)\\) y: \\((.+)\\)$/, // go to x: (100) y: (200)
        opcode: 'motion_gotoxy',
        inputs: (match, blocks, knownVariables, parentId) => ({
            X: [1, wrapInputBlock(match[1], blocks, 'math_number', knownVariables, parentId)],
            Y: [1, wrapInputBlock(match[2], blocks, 'math_number', knownVariables, parentId)]
        })
    },
    {
        match: /^move \((.+)\) steps$/,
        opcode: 'motion_movesteps',
        inputs: (match, blocks, knownVariables, parentId) => ({
            STEPS: [1, wrapInputBlock(match[1], blocks, 'math_number', knownVariables, parentId)]
        })
    },   
    {
        match: /^turn (left|right) \((.+?)\) degrees$/,
        opcode: match => (match[1] === 'left' ? 'motion_turnleft' : 'motion_turnright'),
        inputs: (match, blocks, knownVariables, parentId) => ({
            DEGREES: wrapInputBlock(match[2], blocks, 'math_number', knownVariables, parentId)
        }),
        fields: (match, blocks, knownVariables, parentId) => ({
            DIRECTION: wrapInputBlock(match[1], blocks, 'math_number', knownVariables, parentId)
        })
    },
    {
        match: /^broadcast \[(.+?) v\]$/,
        opcode: 'event_broadcast',
        inputs: (match, blocks, knownVariables, parentId) => ({
            BROADCAST_INPUT: wrapInputBlock(match[1], blocks, "broadcast_menu", knownVariables, parentId)
        }),
    },
    {
        match: /^broadcast \[(.+?) v\] and wait$/,
        opcode: 'event_broadcastandwait',
        inputs: (match, blocks, knownVariables, parentId) => ({
            BROADCAST_INPUT: wrapInputBlock(match[1], blocks, "broadcast_menu", knownVariables, parentId)
        }),
    },
    {
        match: /^create clone of \[(.+?)\]$/,
        opcode: 'control_create_clone_of',
        inputs: (match, blocks, knownVariables, parentId) => ({
            CLONE_OPTION: [1, wrapInputBlock(match[1], blocks, 'clone_menu', knownVariables, parentId)]
        })
    },
    {
        match: /^delete this clone$/,
        opcode: 'control_delete_this_clone',
        inputs: (match, blocks, knownVariables, parentId) => ({})
    },
    {
        match: /^stop ((all|this script|other scripts in sprite))$/,
        opcode: 'control_stop',
        inputs: (match, blocks, knownVariables, parentId) => ({
            STOP_OPTION: ["all", wrapInputBlock(match[1], blocks, knownVariables, parentId)]
        })
    },
    {
        match: /^wait \((.+?)\) seconds$/,
        opcode: 'control_wait',
        inputs: (match, blocks, knownVariables, parentId) => ({
            DURATION: [1, wrapInputBlock(match[5], blocks, 'math_positive_number', knownVariables, parentId)]
        })
    },
    {
        match: /^wait until <(.+?)>$/,
        opcode: 'control_wait_until',
        inputs: (match, blocks, knownVariables, parentId) => ({
            CONDITION: parseCondition(match[1], blocks, knownVariables, parentId)
        })
    },
    {
        match: /^stop all sounds$/,
        opcode: 'sound_stopallsounds',
        inputs: (match, blocks, knownVariables) => ({})
    },
    {
        match: /^play sound \[(.+?) v\]$/,
        opcode: 'sound_play',
        inputs: (match, blocks, knownVariables, parentId) => ({
            SOUND_MENU: wrapInputBlock(match[1], blocks, "sound_menu", knownVariables, parentId)
        })
    },
    {
        match: /^play sound \\((.+) v\\) until done/,
        opcode: 'sound_playuntildone',
        inputs: (match, blocks, knownVariables, parentId) => ({
            SOUND_MENU: wrapInputBlock(match[1], blocks, "sound_menu", knownVariables, parentId)
        })
    },
    {
        match: /hide/,
        opcode: 'looks_hide',
        inputs: (match, blocks, knownVariables) => ({})
    },
    {
        match: /show/,
        opcode: 'looks_show',
        inputs: (match, blocks, knownVariables) => ({})
    },

];

/**
* Parses pseudo code into a structured format that can be used to create blocks in Scratch.
* @param {string}  code "pseudo code"
* @param {Array<object>}  globalVariables "global variables names and ids"
* @param {Array<object>}  localVariables "local variables names and ids"
* @param {Array<object>}  targets "targets names and ids"
* @returns {Array<object>} Array of script objects representing parsed blocks.
*/
const parsePseudoCode = function (code, globalVariables = [], localVariables = [], targets = []) {
    const knownVariables = [...globalVariables, ...localVariables];
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

                // If the context has children, wire them as a SUBSTACK
                if (context.children.length > 0) {
                    context.block.inputs.SUBSTACK = [2, context.children[0].id];
                    context.children[0].parent = context.block.id;
                    connectBlocks(context.children);
                }

                // Set the parent field for the closed control block***
                if (stack.length > 0) {
                    context.block.parent = stack[stack.length - 1].id;
                }

            }
            else {
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

            currentScript.blocks[id] = createBlock(blockType, inputs, fields, {
                id: id,
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
            stack[stack.length - 1]?.children.push(block);
            stack.push({ id, block, children: [] });
            matched = true;
        } else if (/^repeat\s*\((.+?)\)/.test(line)) {
            const match = line.match(/^repeat\s*\((.+?)\)/);
            const times = match[1];
            const id = generateId();
            const block = createBlock('control_repeat', { TIMES: [1, [10, times]] }, {}, { id });
            currentScript.blocks[id] = block;
            stack[stack.length - 1]?.children.push(block);
            stack.push({ id, block, children: [] });
            matched = true;
        } else if (/^repeat until\s*<(.+?)>/.test(line)) {
            const match = line.match(/^repeat until\s*<(.+?)>/);
            const conditionText = match[1];
            const id = generateId();
            const block = createBlock('control_repeat_until', {
                CONDITION: parseCondition(conditionText, currentScript.blocks, knownVariables, id)
            }, {}, { id });
            currentScript.blocks[id] = block;
            stack[stack.length - 1]?.children.push(block);
            stack.push({ id, block, children: [] });
            matched = true;
        } else if (line.startsWith('if')) {
            if (line.match(/if\s*<(.+?)>\s*then/)) {
                const id = generateId();
                const condition = line.match(/if\s*<(.+?)>\s*then/)[1];
                const block = createBlock('control_if', {
                    CONDITION: parseCondition(condition, currentScript.blocks, knownVariables, id)
                }, {}, { id });
                currentScript.blocks[id] = block;
                stack[stack.length - 1]?.children.push(block);
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
                    const id = generateId();
                    const opcode = typeof pattern.opcode === 'function' ? pattern.opcode(match) : pattern.opcode;
                    const inputs = pattern.inputs ? pattern.inputs(match, currentScript.blocks, knownVariables, id) : {};
                    const fields = pattern.fields ? pattern.fields(match, currentScript.blocks, knownVariables, id) : {};

                    currentScript.blocks[id] = createBlock(opcode, inputs, fields, {
                        id: id,
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
        console.log(Object.values(currentScript.blocks));
        console.log(stack.length);
        console.log(matched);
    }

    if (currentScript) {
        // Connect top-level blocks outside any control block
        // Only include blocks not already referenced in any inputs
        const usedBlockIds = new Set();

        // Collect all blocks referenced as inputs (e.g. SUBSTACKs or CONDITIONs)
        for (const block of Object.values(currentScript.blocks)) {
            for (const input of Object.values(block.inputs || {})) {
                if (Array.isArray(input) && typeof input[1] === 'string') {
                    usedBlockIds.add(input[1]);
                }
            }
        }

        const topLevelBlocks = Object.values(currentScript.blocks)
            .filter(b =>
                !usedBlockIds.has(b.id) &&
                !b.topLevel && !b.shadow &&
                b.id !== currentScript.topBlock &&
                !b.parent
            );

        connectBlocks(topLevelBlocks);

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
