function ChangeHandler(gameEng)
{
  var gameEngine = gameEng;
  var MAX_LEVEL_OF_NESTING = blocklyCustomSettings.maxLevelOfNesting;
  
  if(MAX_LEVEL_OF_NESTING == null)
  {
    MAX_LEVEL_OF_NESTING = 2;
  }
  
  this.getBlockCount = function(workspace)
  {
    debug("Block count: " + workspace.getAllBlocks().length);
    return workspace.getAllBlocks().length;
  }
  
  this.handleChanges = function (event, workspace)
  {
    gameEng.instructionsModified();
    if
    ((event instanceof Blockly.Events.BlockMove))
    {
      currentBlock = workspace.getBlockById(event.blockId);
      if(currentBlock != null && (currentBlock.type == "if" || currentBlock.type == "while" || currentBlock.type == "do_while" || currentBlock.type == "if_else"))//block exists
      {
        //console.log("found the block");
        if(!handleChangesWorker(currentBlock, MAX_LEVEL_OF_NESTING))
        {
          debug("deleting block");
          currentBlock.dispose(true);
        }
      }
    }
  }
  
  function handleChangesWorker(block, nestingLevel)
  {
    parentBlock = block.getSurroundParent();
    //console.log("nestingLevel: " + nestingLevel);
       
    if(nestingLevel < 1)
    {
      return false; //nesting is bad
    }
    else
    {
      if(parentBlock == null)
      {
        return true;//the nesting is good
      }
      else
      {
        return handleChangesWorker(parentBlock,(nestingLevel - 1));
      }
    }
  }
  
  
}