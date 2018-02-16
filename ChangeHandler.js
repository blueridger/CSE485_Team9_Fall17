function ChangeHandler(gameEng)
{
  var gameEngine = gameEng;
  var MAX_LEVEL_OF_NESTING = 2;
  
  this.getBlockCount = function(workspace)
  {
    return workspace.getAllBlocks().length;
  }
  
  this.handleChanges = function (event, workspace)
  {
    gameEng.instructionsModified();
    if
    ((event instanceof Blockly.Events.BlockMove))
    {
      currentBlock = workspace.getBlockById(event.blockId);
      if(currentBlock != null && currentBlock.type == "outer_if")//block exists
      {
        //console.log("found the block");
        if(!handleChangesWorker(currentBlock, MAX_LEVEL_OF_NESTING))
        {
          console.log("deleting block");
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