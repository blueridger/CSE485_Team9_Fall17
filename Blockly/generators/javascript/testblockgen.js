Blockly.JavaScript['open_right'] = function(block) {
  // Search the text for a substring.
  
  code = "openRight()";
  //code += "highlightBlock('" + block.id + "');\n";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['open_left'] = function(block) {
  // Search the text for a substring.
  
  code = "openLeft()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['open_front'] = function(block) {
  // Search the text for a substring.
  
  code = "openFront()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['open_back'] = function(block) {
  // Search the text for a substring.
  
  code = "openRear()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};


///wall generators
Blockly.JavaScript['wall_right'] = function(block) {
  // Search the text for a substring.
  
  code = "!openRight()";
  //code += "highlightBlock('" + block.id + "');\n";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['wall_left'] = function(block) {
  // Search the text for a substring.
  
  code = "!openLeft()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['wall_front'] = function(block) {
  // Search the text for a substring.
  
  code = "!openFront()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['wall_back'] = function(block) {
  // Search the text for a substring.
  
  code = "!openRear()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['outer_if'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'Condition', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_name = Blockly.JavaScript.statementToCode(block, 'Name');
  // TODO: Assemble JavaScript into code variable.
  
  var code = '';
  code += "highlightBlock('" + block.id + "');\n";
  inputBlock = block.getInputTargetBlock("Condition");
  if(inputBlock != null)
  {
    code += "highlightBlock('" + inputBlock.id + "');\n";
  }
  code += 'if ' + value_condition + ' {\n' + statements_name + '}\n';
  
  return code;//[code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['back_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "moveBackward();\n";
  code += "highlightBlock('" + block.id + "');\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['forward_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "moveForward();\n";
  code += "highlightBlock('" + block.id + "');\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['left_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "turnLeft();\n";
  code += "highlightBlock('" + block.id + "');\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['right_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "turnRight();\n";
  code += "highlightBlock('" + block.id + "');\n";
  return code;//[code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};