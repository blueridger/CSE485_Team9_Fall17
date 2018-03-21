(function()
{
      
      
      
      //inject the blockly canvas into the blocklyDiv
      blocklyWorkspace = Blockly.inject('blocklyDiv',
        {
          media: 'Blockly/media/',
          toolbox: document.getElementById('toolbox')
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
