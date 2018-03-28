var ASUmaroon = '#8c1d40'
var ASUgold = '#ffc627'
var ROBOmaroon = '#900101'
var ROBOgold = '#eee70b'

Blockly.defineBlocksWithJsonArray([{
  "type": "condition_to_check",
  "message0": "checktrue",
  "inputsInline": true,
  "output": "Boolean",
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "if",
  "message0": "If %1 Then %2",
  "args0": [
    {
      "type": "input_value",
      "name": "Condition",
      "check": "Boolean"
    },
    {
      "type": "input_statement",
      "name": "Statement",
      "check": [
        "right_statement",
        "back_statement",
        "left_statement",
        "inner_if",
        "forward_statement"
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  //"inputsInline": true,
  "colour": ASUmaroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "if_else",
  "message0": "If %1 Then %2 Else %3",
  "args0": [
    {
      "type": "input_value",
      "name": "Condition",
      "check": "Boolean"
    },
    {
      "type": "input_statement",
      "name": "True"
    },
    {
      "type": "input_statement",
      "name": "False"
    }
  ],
  "colour": 0,
  "tooltip": "",
  "helpUrl": "",
  "previousStatement": null,
  "nextStatement": null
},
{
  "type": "while",
  "message0": "While %1 Do %2",
  "args0": [
    {
      "type": "input_value",
      "name": "Condition",
      "check": "Boolean"
    },
    {
      "type": "input_statement",
      "name": "Statement"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  //"inputsInline": true,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "do_while",
  "message0": "Do %1 While %2",
  "args0": [
    {
      "type": "input_statement",
      "name": "Statement",
      "check": [
        "right_statement",
        "back_statement",
        "left_statement",
        "inner_if",
        "forward_statement"
      ]
    },
    {
      "type": "input_value",
      "name": "Condition",
      "check": "Boolean"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  //"inputsInline": true,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "back_statement",
  "message0": "Go Back",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 60,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "forward_statement",
  "message0": "Go Forward",
  "previousStatement": null,
  "nextStatement": null,
  "colour": ASUgold,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "left_statement",
  "message0": "Turn Left",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 60,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "right_statement",
  "message0": "Turn Right",
  "previousStatement": null,
  "nextStatement": null,
  "colour": ROBOgold,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_left",
  "message0": "Open Left",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_right",
  "message0": "Open Right",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_front",
  "message0": "Open Front",
  "output": null,
  "colour": ROBOmaroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_back",
  "message0": "Open Back",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_left",
  "message0": "Wall Left",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_right",
  "message0": "Wall Right",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_front",
  "message0": "Wall Front",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_back",
  "message0": "Wall Back",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}
]);