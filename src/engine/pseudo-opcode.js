const pseudoOpcode = {
    // Motion blocks
    motion_movesteps: {
        opcode: 'motion_movesteps',
        pseudocode: 'move (STEPS) steps',
        regex: '^move \\((.+)\\) steps$',
        category: 'motion',
        inputs: {
            STEPS: 'number'
        }
    },
    motion_turncw: {
        opcode: 'motion_turncw',
        pseudocode: 'turn cw (DEGREES) degrees',
        regex: '^turn cw \\((.+)\\) degrees$',
        category: 'motion',
        inputs: {
            DEGREES: 'number'
        }
    },
    motion_turnccw: {
        opcode: 'motion_turnccw',
        pseudocode: 'turn ccw (DEGREES) degrees',
        regex: '^turn ccw \\((.+)\\) degrees$',
        category: 'motion',
        inputs: {
            DEGREES: 'number'
        }
    },
    motion_goto: {
        opcode: 'motion_goto',
        pseudocode: 'go to (TARGET v)',
        regex: '^go to \\((.+) v\\)$',
        category: 'motion',
        inputs: {
            TARGET: 'string' // menu: "mouse-pointer", "random position", "sprite name"
        }
    },
    motion_gotoxy: {
        opcode: 'motion_gotoxy',
        pseudocode: 'go to x: (X) y: (Y)',
        regex: '^go to x: \\((.+)\\) y: \\((.+)\\)$',
        category: 'motion',
        inputs: {
            X: 'number',
            Y: 'number'
        }
    },
    motion_glideto: {
        opcode: 'motion_glideto',
        pseudocode: 'glide (SECS) secs to (TARGET v)',
        regex: '^glide \\((.+)\\) secs to \\((.+) v\\)$',
        category: 'motion',
        inputs: {
            SECS: 'number',
            TARGET: 'string' // menu: "mouse-pointer", "random position", "sprite name"
        }
    },
    motion_glidesecstoxy: {
        opcode: 'motion_glidesecstoxy',
        pseudocode: 'glide (SECS) secs to x: (X) y: (Y)',
        regex: '^glide \\((.+)\\) secs to x: \\((.+)\\) y: \\((.+)\\)$',
        category: 'motion',
        inputs: {
            SECS: 'number',
            X: 'number',
            Y: 'number'
        }
    },
    motion_pointindirection: {
        opcode: 'motion_pointindirection',
        pseudocode: 'point in direction (DIRECTION v)',
        regex: '^point in direction \\((.+) v\\)$',
        category: 'motion',
        inputs: {
            DIRECTION: 'number' // angle in degrees
        }
    },
    motion_pointtowards: {
        opcode: 'motion_pointtowards',
        pseudocode: 'point towards (TARGET v)',
        regex: '^point towards \\((.+) v\\)$',
        category: 'motion',
        inputs: {
            TARGET: 'string' // menu: "mouse-pointer", "random position", "sprite name"
        }
    },
    motion_changexby: {
        opcode: 'motion_changexby',
        pseudocode: 'change x by (X)',
        regex: '^change x by \\((.+)\\)$',
        category: 'motion',
        inputs: {
            X: 'number'
        }
    },
    motion_setx: {
        opcode: 'motion_setx',
        pseudocode: 'set x to (X)',
        regex: '^set x to \\((.+)\\)$',
        category: 'motion',
        inputs: {
            X: 'number'
        }
    },
    motion_changeyby: {
        opcode: 'motion_changeyby',
        pseudocode: 'change y by (Y)',
        regex: '^change y by \\((.+)\\)$',
        category: 'motion',
        inputs: {
            Y: 'number'
        }
    },
    motion_sety: {
        opcode: 'motion_sety',
        pseudocode: 'set y to (Y)',
        regex: '^set y to \\((.+)\\)$',
        category: 'motion',
        inputs: {
            Y: 'number'
        }
    },
    motion_ifonedgebounce: {
        opcode: 'motion_ifonedgebounce',
        pseudocode: 'if on edge, bounce',
        regex: '^if on edge, bounce$',
        category: 'motion',
        blockType: 'command',
        inputs: {}
    },
    motion_setrotationstyle: {
        opcode: 'motion_setrotationstyle',
        pseudocode: 'set rotation style to (STYLE v)',
        regex: '^set rotation style to \\((.+) v\\)$',
        category: 'motion',
        inputs: {
            STYLE: 'string' // menu: "left-right", "don't rotate", "all around"
        }
    },
    motion_xposition: {
        opcode: 'motion_xposition',
        pseudocode: 'x position',
        regex: '^x position$',
        category: 'motion',
        blockType: 'reporter',
        inputs: {}
    },
    motion_yposition: {
        opcode: 'motion_yposition',
        pseudocode: 'y position',
        regex: '^y position$',
        category: 'motion',
        blockType: 'reporter',
        inputs: {}
    },


    // Looks blocks
    looks_say: {
        opcode: 'looks_say',
        pseudocode: 'say (MESSAGE)',
        regex: '^say \\((.+)\\)$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            MESSAGE: 'string'
        }
    },
    looks_sayforsecs: {
        opcode: 'looks_sayforsecs',
        pseudocode: 'say (MESSAGE) for (SECS) seconds',
        regex: '^say \\((.+)\\) for \\((.+)\\) seconds$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            MESSAGE: 'string',
            SECS: 'number'
        }
    },
    looks_think: {
        opcode: 'looks_think',
        pseudocode: 'think (MESSAGE)',
        regex: '^think \\((.+)\\)$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            MESSAGE: 'string'
        }
    },
    looks_thinkforsecs: {
        opcode: 'looks_thinkforsecs',
        pseudocode: 'think (MESSAGE) for (SECS) seconds',
        regex: '^think \\((.+)\\) for \\((.+)\\) seconds$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            MESSAGE: 'string',
            SECS: 'number'
        }
    },
    looks_switchcostumeto: {
        opcode: 'looks_switchcostumeto',
        pseudocode: 'switch costume to (COSTUME v)',
        regex: '^switch costume to \\((.+) v\\)$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            COSTUME: 'string'
        }
    },
    looks_nextcostume: {
        opcode: 'looks_nextcostume',
        pseudocode: 'next costume',
        regex: '^next costume$',
        category: 'looks',
        blockType: 'command',
        inputs: {}
    },
    looks_switchbackdropto: {
        opcode: 'looks_switchbackdropto',
        pseudocode: 'switch backdrop to (BACKDROP v)',
        regex: '^switch backdrop to \\((.+) v\\)$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            BACKDROP: 'string' // menu: backdrop names
        }
    },
    looks_nextbackdrop: {
        opcode: 'looks_nextbackdrop',
        pseudocode: 'next backdrop',
        regex: '^next backdrop$',
        category: 'looks',
        blockType: 'command',
        inputs: {}
    },
    looks_changesizeby: {
        opcode: 'looks_changesizeby',
        pseudocode: 'change size by (SIZE)',
        regex: '^change size by \\((.+)\\)$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            SIZE: 'number' // change in percentage
        }
    },
    looks_setsizeto: {
        opcode: 'looks_setsizeto',
        pseudocode: 'set size to (SIZE)%',
        regex: '^set size to \\((.+)\\)%$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            SIZE: 'number' // size in percentage
        }
    },
    looks_changeeffectby: {
        opcode: 'looks_changeeffectby',
        pseudocode: 'change (EFFECT v) effect by (VALUE)',
        regex: '^change \\((.+) v\\) effect by \\((.+)\\)$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            EFFECT: 'string', // menu: "color", "fisheye", "whirl", "pixelate", "mosaic", "brightness", "ghost"
            VALUE: 'number'
        }
    },
    looks_seteffectto: {
        opcode: 'looks_seteffectto',
        pseudocode: 'set (EFFECT v) effect to (VALUE)',
        regex: '^set \\((.+) v\\) effect to \\((.+)\\)$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            EFFECT: 'string', // menu: "color", "fisheye", "whirl", "pixelate", "mosaic", "brightness", "ghost"
            VALUE: 'number'
        }
    },
    looks_cleargraphiceffects: {
        opcode: 'looks_cleargraphiceffects',
        pseudocode: 'clear graphic effects',
        regex: '^clear graphic effects$',
        category: 'looks',
        blockType: 'command',
        inputs: {}
    },
    looks_show: {
        opcode: 'looks_show',
        pseudocode: 'show',
        regex: '^show$',
        category: 'looks',
        blockType: 'command',
        inputs: {}
    },
    looks_hide: {
        opcode: 'looks_hide',
        pseudocode: 'hide',
        regex: '^hide$',
        category: 'looks',
        blockType: 'command',
        inputs: {}
    },
    looks_gotofrontback: {
        opcode: 'looks_gotofrontback',
        pseudocode: 'go to (LAYER v) layer',
        regex: '^go to \\((front|back) v\\) layer$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            LAYER: 'string' // menu: "front", "back"
        }
    },
    looks_godirectionlayers: { // don't know correct opcode name
        opcode: 'looks_godirectionlayers',
        pseudocode: 'go (DIRECTION v) (STEPS) layers',
        regex: '^go \\((forward|backward) v\\) \\((.+)\\) layers$',
        category: 'looks',
        blockType: 'command',
        inputs: {
            LAYER: 'string' // menu: "front", "back"
        }
    },
    looks_costumenumbername: {
        opcode: 'looks_costumenumbername',
        pseudocode: 'costume (COSTUME_NUMBER v) name',
        regex: '^costume \\((number|name) v\\) name$',
        category: 'looks',
        blockType: 'reporter',
        inputs: {
            COSTUME_NUMBER: 'number' // costume index starting from 1
        }
    },
    looks_backdropnumbername: {
        opcode: 'looks_backdropnumbername',
        pseudocode: 'backdrop (BACKDROP_NUMBER v) name',
        regex: '^backdrop \\((number|name) v\\) name$',
        category: 'looks',
        blockType: 'reporter',
        inputs: {
            BACKDROP_NUMBER: 'number' // backdrop index starting from 1
        }
    },

    // Sound blocks
    sound_playuntildone: {
        opcode: 'sound_playuntildone',
        pseudocode: 'play sound (SOUND v) until done',
        regex: '^play sound \\((.+) v\\) until done$',
        category: 'sound',
        blockType: 'command',
        inputs: {
            SOUND: 'string' // menu: sound names
        }
    },
    sound_play: {
        opcode: 'sound_play',
        pseudocode: 'play sound (SOUND v)',
        regex: '^play sound \\((.+) v\\)$',
        category: 'sound',
        blockType: 'command',
        inputs: {
            SOUND: 'string' // menu: sound names
        }
    },
    sound_stopallsounds: {
        opcode: 'sound_stopallsounds',
        pseudocode: 'stop all sounds',
        regex: '^stop all sounds$',
        category: 'sound',
        blockType: 'command',
        inputs: {}
    },
    sound_changesoundeffectby: {
        opcode: 'sound_changesoundeffectby',
        pseudocode: 'change (EFFECT v) effect by (VALUE)',
        regex: '^change \\((.+) v\\) effect by \\((.+)\\)$',
        category: 'sound',
        blockType: 'command',
        inputs: {
            EFFECT: 'string', // menu: "pitch", "pan left/right
            VALUE: 'number'
        }
    },
    sound_setsoundeffectto: {
        opcode: 'sound_setsoundeffectto',
        pseudocode: 'set (EFFECT) effect to (VALUE)',
        regex: '^set \\((.+)\\) effect to \\((.+)\\)$',
        category: 'sound',
        blockType: 'command',
        inputs: {
            EFFECT: 'string', // menu: "pitch", "pan left/right
            VALUE: 'number'
        }
    },
    sound_clearsoundeffects: {
        opcode: 'sound_clearsoundeffects',
        pseudocode: 'clear sound effects',
        regex: '^clear sound effects$',
        category: 'sound',
        blockType: 'command',
        inputs: {}
    },
    sound_changevolumeby: {
        opcode: 'sound_changevolumeby',
        pseudocode: 'change volume by (VOLUME)',
        regex: '^change volume by \\((.+)\\)$',
        category: 'sound',
        blockType: 'command',
        inputs: {
            VOLUME: 'number'
        }
    },
    sound_setsoundlevelto: {
        opcode: 'sound_setsoundlevelto',
        pseudocode: 'set volume to (VOLUME)%',
        regex: '^set volume to \\((.+)\\)%$',
        category: 'sound',
        blockType: 'command',
        inputs: {
            VOLUME: 'number' // volume in percentage
        }
    },
    sound_volume: {
        opcode: 'sound_volume',
        pseudocode: 'volume',
        regex: '^volume$',
        category: 'sound',
        blockType: 'reporter',
        inputs: {}
    },

    // Event blocks
    event_whenflagclicked: {
        opcode: 'event_whenflagclicked',
        pseudocode: 'when green flag clicked',
        regex: '^when green flag clicked$',
        category: 'event',
        blockType: 'hat',
        inputs: {}
    },
    event_whenkeypressed: {
        opcode: 'event_whenkeypressed',
        pseudocode: 'when (KEY v) key pressed',
        regex: '^when key \\((.+)\\) pressed$',
        category: 'event',
        blockType: 'hat',
        inputs: {
            KEY: 'string' // menu: "space", "up arrow", "down arrow", "left arrow", "right arrow", etc.
        }
    },
    event_whenthisspriteclicked: {
        opcode: 'event_whenthisspriteclicked',
        pseudocode: 'when this sprite clicked',
        regex: '^when this sprite clicked$',
        category: 'event',
        blockType: 'hat',
        inputs: {}
    },
    event_whenbackdropswitchesto: {
        opcode: 'event_whenbackdropswitchesto',
        pseudocode: 'when backdrop switches to (BACKDROP)',
        regex: '^when backdrop switches to \\((.+)\\)$',
        category: 'event',
        blockType: 'hat',
        inputs: {
            BACKDROP: 'string' // menu: backdrop names
        }
    },
    event_whengreaterthan: {
        opcode: 'event_whengreaterthan',
        pseudocode: 'when [(loudness|time) v] \> (VALUE)',
        regex: '^when \[(loudness|timer) v\\] \> \\((.+)\\)$',
        category: 'event',
        blockType: 'hat',
        inputs: {
            VARIABLE: 'string', // menu: variable names
            VALUE: 'number' // threshold value
        }
    },
    event_whenbroadcastreceived: {
        opcode: 'event_whenbroadcastreceived',
        pseudocode: 'when I receive (BROADCAST v)',
        regex: '^when I receive \\((.+) v\\)$',
        category: 'event',
        blockType: 'hat',
        inputs: {
            BROADCAST: 'string' // menu: broadcast names
        }
    },
    event_broadcast: {
        opcode: 'event_broadcast',
        pseudocode: 'broadcast (BROADCAST v)',
        regex: '^broadcast \\((.+) v\\)$',
        category: 'event',
        blockType: 'command',
        inputs: {
            BROADCAST: 'string' // menu: broadcast names
        }
    },
    event_broadcastandwait: {
        opcode: 'event_broadcastandwait',
        pseudocode: 'broadcast (BROADCAST v) and wait',
        regex: '^broadcast \\((.+) v\\) and wait$',
        category: 'event',
        blockType: 'command',
        inputs: {
            BROADCAST: 'string' // menu: broadcast names
        }
    },

    // Control blocks
    control_wait: {
        opcode: 'control_wait',
        pseudocode: 'wait (DURATION) seconds',
        regex: '^wait \\((.+)\\) seconds$',
        category: 'control',
        blockType: 'command',
        inputs: {
            DURATION: 'number'
        }
    },
    control_repeat: {
        opcode: 'control_repeat',
        pseudocode: 'repeat (TIMES)',
        regex: '^repeat \\((.+)\\)$',
        category: 'control',
        blockType: 'c-block',
        inputs: {
            TIMES: 'number'
        }
    },
    control_forever: {
        opcode: 'control_forever',
        pseudocode: 'forever',
        regex: '^forever$',
        category: 'control',
        blockType: 'c-block',
        inputs: {}
    },
    control_if: {
        opcode: 'control_if',
        pseudocode: 'if <CONDITION> then',
        regex: '^if <(.+)> then$',
        category: 'control',
        blockType: 'c-block',
        inputs: {
            CONDITION: 'boolean'
        }
    },
    control_if_else: {
        opcode: 'control_if_else',
        pseudocode: 'if <CONDITION> then { ... } else { ... }',
        regex: '^if <(.+)> then \\{.*\\} else \\{.*\\}$',
        category: 'control',
        blockType: 'c-block',
        inputs: {
            CONDITION: 'boolean'
        }
    },
    control_wait_until: {
        opcode: 'control_wait_until',
        pseudocode: 'wait until <CONDITION>',
        regex: '^wait until <(.+)>$',
        category: 'control',
        blockType: 'command',
        inputs: {
            CONDITION: 'boolean'
        }
    },
    control_repeat_until: {
        opcode: 'control_repeat_until',
        pseudocode: 'repeat until <CONDITION>',
        regex: '^repeat until <(.+)> \\{.*\\}$',
        category: 'control',
        blockType: 'c-block',
        inputs: {
            CONDITION: 'boolean'
        }
    },
    control_stop: {
        opcode: 'control_stop',
        pseudocode: 'stop (STOP_OPTION v)',
        regex: '^stop \\((all|this script|other scripts in sprite) v\\)$',
        category: 'control',
        blockType: 'command',
        inputs: {
            STOP_OPTION: 'string' // menu: "all", "this script", "other scripts in sprite"
        }
    },
    control_start_as_clone: {
        opcode: 'control_start_as_clone',
        pseudocode: 'when I start as a clone',
        regex: '^when I start as a clone$',
        category: 'control',
        blockType: 'hat',
        inputs: {}
    },
    control_create_clone_of: {
        opcode: 'control_create_clone_of',
        pseudocode: 'create clone of (CLONE_OPTION v)',
        regex: '^create clone of \\((.+) v\\)$',
        category: 'control',
        blockType: 'command',
        inputs: {
            CLONE_OPTION: 'string' // menu: "_myself_" or sprite name
        }
    },

    control_delete_this_clone: {
        opcode: 'control_delete_this_clone',
        pseudocode: 'delete this clone',
        regex: '^delete this clone$',
        category: 'control',
        blockType: 'command',
        inputs: {}
    },

    // Sensing blocks
    sensing_touchingobject: {
        opcode: 'sensing_touchingobject',
        pseudocode: 'touching (TOUCHING_OPTION v)?',
        regex: '^touching \\((.+) v\\)?$',
        category: 'sensing',
        blockType: 'boolean',
        inputs: {
            TOUCHING_OPTION: 'string' // menu: "mouse-pointer", "edge", "sprite name"
        }
    },
    sensing_touchingcolor: {
        opcode: 'sensing_touchingcolor',
        pseudocode: 'touching color (COLOR)?',
        regex: '^touching color \\((.+)\\)?$',
        category: 'sensing',
        blockType: 'boolean',
        inputs: {
            COLOR: 'color' // color picker
        }
    },
    sensing_coloristouchingcolor: {
        opcode: 'sensing_coloristouchingcolor',
        pseudocode: 'color (COLOR1) is touching color (COLOR2)?',
        regex: '^color \\((.+)\\) is touching color \\((.+)\\)?$',
        category: 'sensing',
        blockType: 'boolean',
        inputs: {
            COLOR1: 'color', // color picker
            COLOR2: 'color' // color picker
        }
    },
    sensing_distance: {
        opcode: 'sensing_distance',
        pseudocode: 'distance to (TARGET v)',
        regex: '^distance to \\((.+) v\\)$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {
            TARGET: 'string' // menu: "mouse-pointer", "sprite name"
        }
    },
    sensing_askandwait: {
        opcode: 'sensing_askandwait',
        pseudocode: 'ask (QUESTION) and wait',
        regex: '^ask \\((.+)\\) and wait$',
        category: 'sensing',
        blockType: 'command',
        inputs: {
            QUESTION: 'string' // question to ask the user
        }
    },
    sensing_answer: {
        opcode: 'sensing_answer',
        pseudocode: 'answer',
        regex: '^answer$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_keypressed: {
        opcode: 'sensing_keypressed',
        pseudocode: 'key (KEY v) pressed?',
        regex: '^key \\((.+) v\\) pressed\\?$',
        category: 'sensing',
        blockType: 'boolean',
        inputs: {
            KEY: 'string' // menu: "space", "up arrow", "down arrow", "left arrow", "right arrow", etc.
        }
    },
    sensing_keyoptions: {
        opcode: 'sensing_keyoptions',
        pseudocode: 'key options',
        regex: '^key options$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_mousedown: {
        opcode: 'sensing_mousedown',
        pseudocode: 'mouse down?',
        regex: '^mouse down\\?$',
        category: 'sensing',
        blockType: 'boolean',
        inputs: {}
    },
    sensing_mousex: {
        opcode: 'sensing_mousex',
        pseudocode: 'mouse x',
        regex: '^mouse x position$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_mousey: {
        opcode: 'sensing_mousey',
        pseudocode: 'mouse y',
        regex: '^mouse y position$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_setdragmode: {
        opcode: 'sensing_setdragmode',
        pseudocode: 'set drag mode to (MODE)',
        regex: '^set drag mode to \\((.+)\\)$',
        category: 'sensing',
        blockType: 'command',
        inputs: {
            MODE: 'string' // menu: "draggable", "not draggable"
        }
    },
    sensing_loudness: {
        opcode: 'sensing_loudness',
        pseudocode: 'loudness',
        regex: '^loudness$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_timer: {
        opcode: 'sensing_timer',
        pseudocode: 'timer',
        regex: '^timer$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_resettimer: {
        opcode: 'sensing_resettimer',
        pseudocode: 'reset timer',
        regex: '^reset timer$',
        category: 'sensing',
        blockType: 'command',
        inputs: {}
    },
    sensing_of: {
        opcode: 'sensing_of',
        pseudocode: '(PROPERTY) of (TARGET)',
        regex: '^\\((.+)\\) of \\((.+)\\)$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {
            PROPERTY: 'string', // menu: "x position", "y position", "direction", "costume #", "size", etc.
            TARGET: 'string' // menu: "this sprite", "stage", or sprite names
        }
    },
    sensing_current: {
        opcode: 'sensing_current',
        pseudocode: 'current (PROPERTY)',
        regex: '^current \\((.+)\\)$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {
            PROPERTY: 'string' // menu: "year", "month", "date", "day of week", "hour", "minute", "second"
        }
    },
    sensing_username: {
        opcode: 'sensing_username',
        pseudocode: 'username',
        regex: '^username$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_loudness: {
        opcode: 'sensing_loudness',
        pseudocode: 'loudness',
        regex: '^loudness$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {}
    },
    sensing_current: {
        opcode: 'sensing_current',
        pseudocode: 'current (PROPERTY)',
        regex: '^current \\((.+)\\)$',
        category: 'sensing',
        blockType: 'reporter',
        inputs: {
            PROPERTY: 'string' // menu: "year", "month", "date", "day of week", "hour", "minute", "second"
        }
    },

    // Operators blocks
    operator_add: {
        opcode: 'operator_add',
        pseudocode: '(NUM1) + (NUM2)',
        regex: '^\\((.+)\\) \\+ \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            NUM1: 'number',
            NUM2: 'number'
        }
    },
    operator_subtract: {
        opcode: 'operator_subtract',
        pseudocode: '(NUM1) - (NUM2)',
        regex: '^\\((.+)\\) - \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            NUM1: 'number',
            NUM2: 'number'
        }
    },
    operator_multiply: {
        opcode: 'operator_multiply',
        pseudocode: '(NUM1) * (NUM2)',
        regex: '^\\((.+)\\) \\* \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            NUM1: 'number',
            NUM2: 'number'
        }
    },
    operator_divide: {
        opcode: 'operator_divide',
        pseudocode: '(NUM1) / (NUM2)',
        regex: '^\\((.+)\\) / \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            NUM1: 'number',
            NUM2: 'number'
        }
    },
    operator_random: {
        opcode: 'operator_random',
        pseudocode: 'pick random (NUM1) to (NUM2)',
        regex: '^pick random \\((.+)\\) to \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            NUM1: 'number',
            NUM2: 'number'
        }
    },
    operator_lt: {
        opcode: 'operator_lt',
        pseudocode: '(NUM1) \< (NUM2)?',
        regex: '^\\((.+)\\) \< \\((.+)\\)$',
        category: 'operators',
        blockType: 'boolean',
        inputs: {
            NUM1: 'number',
            NUM2: 'number'
        }
    },
    operator_equals: {
        opcode: 'operator_equals',
        pseudocode: '(VALUE1) = (VALUE2)?',
        regex: '^\\((.+)\\) = \\((.+)\\)$',
        category: 'operators',
        blockType: 'boolean',
        inputs: {
            VALUE1: 'string', // can be number or string
            VALUE2: 'string' // can be number or string
        }
    },
    operator_gt: {
        opcode: 'operator_gt',
        pseudocode: '(NUM1) \> (NUM2)?',
        regex: '^\\((.+)\\) \> \\((.+)\\)$',
        category: 'operators',
        blockType: 'boolean',
        inputs: {
            NUM1: 'number',
            NUM2: 'number'
        }
    },
    operator_and: {
        opcode: 'operator_and',
        pseudocode: '<CONDITION1> and <CONDITION2>',
        regex: '^<(.+)> and <(.+)>$',
        category: 'operators',
        blockType: 'boolean',
        inputs: {
            CONDITION1: 'boolean',
            CONDITION2: 'boolean'
        }
    },
    operator_or: {
        opcode: 'operator_or',
        pseudocode: '<CONDITION1> or <CONDITION2>',
        regex: '^<(.+)> or <(.+)>$',
        category: 'operators',
        blockType: 'boolean',
        inputs: {
            CONDITION1: 'boolean',
            CONDITION2: 'boolean'
        }
    },
    operator_not: {
        opcode: 'operator_not',
        pseudocode: 'not <CONDITION>',
        regex: '^not <(.+)>$',
        category: 'operators',
        blockType: 'boolean',
        inputs: {
            CONDITION: 'boolean'
        }
    },
    operator_join: {
        opcode: 'operator_join',
        pseudocode: 'join (TEXT1) and (TEXT2)',
        regex: '^join \\((.+)\\) and \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            TEXT1: 'string',
            TEXT2: 'string'
        }
    },
    operator_letter_of: {
        opcode: 'operator_letter_of',
        pseudocode: 'letter (INDEX) of (TEXT)',
        regex: '^letter \\((.+)\\) of \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            INDEX: 'number', // index starting from 1
            TEXT: 'string' // text to extract letter from
        }
    },
    operator_length: {
        opcode: 'operator_length',
        pseudocode: 'length of (TEXT)',
        regex: '^length of \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            TEXT: 'string' // text to measure length of
        }
    },
    operator_contains: {
        opcode: 'operator_contains',
        pseudocode: '(TEXT) contains (SUBSTRING)?',
        regex: '^\\((.+)\\) contains \\((.+)\\)\\?$',
        category: 'operators',
        blockType: 'boolean',
        inputs: {
            TEXT: 'string', // text to search in
            SUBSTRING: 'string' // substring to search for
        }
    },
    operator_mod: {
        opcode: 'operator_mod',
        pseudocode: '(NUM1) mod (NUM2)',
        regex: '^\\((.+)\\) mod \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            NUM1: 'number', // dividend
            NUM2: 'number' // divisor
        }
    },
    operator_round: {
        opcode: 'operator_round',
        pseudocode: 'round (NUMBER)',
        regex: '^round \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            NUMBER: 'number' // number to round
        }
    },
    operator_mathop: {
        opcode: 'operator_mathop',
        pseudocode: '(OPERATION) of (NUMBER)',
        regex: '^\\((abs|floor|ceiling|sqrt|sin|cos|tan|ln|log|e\\^|10\\^)\\) of \\((.+)\\)$',
        category: 'operators',
        blockType: 'reporter',
        inputs: {
            OPERATION: 'string', // menu: "abs", "floor", "ceiling", "sqrt", "sin", "cos", "tan", "ln", "log", "e^", "10^"
            NUMBER: 'number' // number to apply operation on
        }
    },
    // Variables blocks
    data_variable: {
        opcode: 'data_variable',
        pseudocode: 'variable (NAME)',
        regex: '^variable <(.+)>$',
        category: 'variables',
        blockType: 'reporter',
        inputs: {
            NAME: 'string' // variable name
        }
    },
    data_setvariableto: {
        opcode: 'data_setvariableto',
        pseudocode: 'set [NAME v] to (VALUE)',
        regex: '^set \\[(.+) v\\] to \\((.+)\\)$',
        category: 'variables',
        blockType: 'command',
        inputs: {
            NAME: 'string', // variable name
            VALUE: 'string' // value to set the variable to
        }
    },
    data_changevariableby: {
        opcode: 'data_changevariableby',
        pseudocode: 'change [NAME v] by (VALUE)',
        regex: '^change \\[(.+) v\\] by \\((.+)\\)$',
        category: 'variables',
        blockType: 'command',
        inputs: {
            NAME: 'string', // variable name
            VALUE: 'number' // value to change the variable by
        }
    },
    data_showvariable: {
        opcode: 'data_showvariable',
        pseudocode: 'show variable [NAME v]',
        regex: '^show variable \\[(.+) v\\]$',
        category: 'variables',
        blockType: 'command',
        inputs: {
            NAME: 'string' // variable name
        }
    },
    data_hidevariable: {
        opcode: 'data_hidevariable',
        pseudocode: 'hide variable [NAME v]',
        regex: '^hide variable \\[(.+)\\]$',
        category: 'variables',
        blockType: 'command',
        inputs: {
            NAME: 'string' // variable name
        }
    },
    math_number: {
        opcode: 'math_number',
        pseudocode: '(NUMBER)',
        regex: '^\\((.+)\\)$',
        category: 'math',
        blockType: 'reporter',
        inputs: {
            NUMBER: 'number' // number value
        }
    }
};

export default pseudoOpcode;
