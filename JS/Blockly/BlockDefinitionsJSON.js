var gold = '#ffc627'
var maroon = '#900101'

Blockly.defineBlocksWithJsonArray([
{
  "type": "if",
  "message0": "If %1 Then %2",
  "enableContextMenu" : false,
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
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "if_else",
  "enableContextMenu" : false,
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
  "colour": maroon,
  "tooltip": "",
  "helpUrl": "",
  "previousStatement": null,
  "nextStatement": null
},
{
  "type": "while",
  "enableContextMenu" : false,
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
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "do_while",
  "enableContextMenu" : false,
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
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "back_statement",
  "enableContextMenu" : false,
  "message0": "Go Back",
  "previousStatement": null,
  "nextStatement": null,
  "colour": gold,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "forward_statement",
  "enableContextMenu" : false,
  "message0": "Go Forward",
  "previousStatement": null,
  "nextStatement": null,
  "colour": gold,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "left_statement",
  "enableContextMenu" : false,
  "message0": "Turn Left",
  "previousStatement": null,
  "nextStatement": null,
  "colour": gold,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "right_statement",
  "enableContextMenu" : false,
  "message0": "Turn Right",
  "previousStatement": null,
  "nextStatement": null,
  "colour": gold,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_left",
  "enableContextMenu" : false,
  "message0": "Open Left",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_right",
  "enableContextMenu" : false,
  "message0": "Open Right",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_front",
  "enableContextMenu" : false,
  "message0": "Open Front",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "open_back",
  "enableContextMenu" : false,
  "message0": "Open Back",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_left",
  "enableContextMenu" : false,
  "message0": "Wall Left",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_right",
  "enableContextMenu" : false,
  "message0": "Wall Right",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_front",
  "enableContextMenu" : false,
  "message0": "Wall Front",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_back",
  "enableContextMenu" : false,
  "message0": "Wall Back",
  "output": null,
  "colour": maroon,
  "tooltip": "",
  "helpUrl": ""
}
]);