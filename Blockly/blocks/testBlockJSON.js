

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
  "type": "outer_if",
  "message0": "Condition %1 Statements %2",
  "args0": [
    {
      "type": "input_value",
      "name": "Condition",
      "check": "Boolean"
    },
    {
      "type": "input_statement",
      "name": "Name",
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
  "nextStatement": 'back_statement',
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "inner_if",
  "message0": "Condition %1 Statements %2",
  "args0": [
    {
      "type": "input_value",
      "name": "Condition",
      "check": "Boolean"
    },
    {
      "type": "input_statement",
      "name": "Name",
      "check": [
        "back_statement",
        "left_statement",
        "right_statement",
        "forward_statement"
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
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
  "colour": 60,
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
  "colour": 60,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "start_here",
  "message0": "Start Here",
  "nextStatement": null,
  "colour": 60,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "check_left",
  "message0": "Check Left",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "check_right",
  "message0": "Check Right",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "check_front",
  "message0": "Check Front",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "check_back",
  "message0": "Check Back",
  "output": null,
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}
]);