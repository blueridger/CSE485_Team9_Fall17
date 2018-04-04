(function()
{
  var toolbox = `<xml><category name="Logic">
        <block type="if"></block>`;
  if (blocklyCustomSettings && blocklyCustomSettings.enableIfElse)
    toolbox += '<block type="if_else"></block>';
  toolbox += `<block type="open_right"></block>
      <block type="open_left"></block>
      <block type="open_front"></block>
      <block type="open_back"></block>
      <block type="wall_right"></block>
      <block type="wall_left"></block>
      <block type="wall_front"></block>
      <block type="wall_back"></block>
    </category>
    <category name="Actions">
      <block type="back_statement"></block>
      <block type="forward_statement"></block>
      <block type="left_statement"></block>
      <block type="right_statement"></block>
    </category>`;
  if (blocklyCustomSettings && (blocklyCustomSettings.enableDoWhile || blocklyCustomSettings.enableWhile)) {
    toolbox += '<category name="Loops">';
    if (blocklyCustomSettings && blocklyCustomSettings.enableWhile)
      toolbox += '<block type="while"></block>';
    if (blocklyCustomSettings && blocklyCustomSettings.enableDoWhile)
      toolbox += '<block type="do_while"></block>';
    toolbox += '</category>';
  }
  toolbox += "</xml>";
  console.log(toolbox);
  
  //inject the blockly canvas into the blocklyDiv
  blocklyWorkspace = Blockly.inject('blocklyDiv',
    {
      media: 'Blockly/media/',
      toolbox: toolbox
    }
  );
    
  //variable defining the default blocks to load on start up.
  var workspaceBlocks = document.getElementById("workspaceBlocks"); 

  /* Load blocks to workspace. */
  Blockly.Xml.domToWorkspace(workspaceBlocks , blocklyWorkspace);
  
  //Change listener for the workspace
  blocklyWorkspace.addChangeListener(function(event) 
    {
    
      if (!(event instanceof Blockly.Events.Ui)
        && !(event instanceof Blockly.Events.BlockCreate)
        && !(event instanceof Blockly.Events.BlockChange)) 
      {
        //pass it to another object to handle changes
        GAME_ENGINE.blocklyChangeHandler.handleChanges(event, blocklyWorkspace);
        
        //generate code from the recently changed blockly workspace
        GAME_ENGINE.generateCodeAndLoadIntoInterpreter();
        
        //dump the current instance of the interpreter. This guarantees that code execution will start that the beginning
        GAME_ENGINE.removeInterpreter();
      }
    }
  );
})();
