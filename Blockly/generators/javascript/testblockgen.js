/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 *
'use strict';

goog.provide('Blockly.JavaScript.variables');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};
*/

Blockly.JavaScript['check_right'] = function(block) {
  // Search the text for a substring.
  
  code = "checkRightFunc()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['check_left'] = function(block) {
  // Search the text for a substring.
  
  code = "checkLeftFunc()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['check_front'] = function(block) {
  // Search the text for a substring.
  
  code = "checkFrontFunc()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['check_back'] = function(block) {
  // Search the text for a substring.
  
  code = "checkBackFunc()";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['outer_if'] = function(block) {
  var value_condition = Blockly.JavaScript.valueToCode(block, 'Condition', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_name = Blockly.JavaScript.statementToCode(block, 'Name');
  // TODO: Assemble JavaScript into code variable.
  var code = 'if ' + value_condition + ' \n{\n' + statements_name + '}\n';
  return code;
};

Blockly.JavaScript['back_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "backFunc();\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['forward_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "forwardFunc();\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['left_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "leftFunc();\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['right_statement'] = function(block) {
  // Search the text for a substring.
  
  code = "rightFunc();\n";
  return code;//[code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['start_here'] = function(block) {
  // Search the text for a substring.
  
  code = "//starting point\n";
  return code;
};