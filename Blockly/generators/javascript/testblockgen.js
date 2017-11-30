Blockly.JavaScript['check_right'] = function(block) {
  // Search the text for a substring.
  
  code = "openRight()";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['check_left'] = function(block) {
  // Search the text for a substring.
  
  code = "openLeft()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['check_front'] = function(block) {
  // Search the text for a substring.
  
  code = "openFront()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['check_back'] = function(block) {
  // Search the text for a substring.
  
  code = "openRear()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['outer_if'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'Condition', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_name = Blockly.JavaScript.statementToCode(block, 'Name');
  // TODO: Assemble JavaScript into code variable.
  var code = 'if ' + value_condition + ' {\n' + statements_name + '}\n';
  return code;//[code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['back_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "moveBackward();\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['forward_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "moveForward();\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['left_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "turnLeft();\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['right_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "turnRight();\n";
  return code;//[code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['start_here'] = function(block) {
  // Search the text for a substring.
  
  code = "//starting point\n";
  return code;
};