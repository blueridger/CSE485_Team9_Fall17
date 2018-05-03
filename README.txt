Welcome to the Maze Runner back end.

======Configurations=======
There are a number of settings which you can define that change the game experience. These are defined in Javascript files in the "Configurations" folder. You can easily edit existing config files or you can create a new one by making a copy of an existing config file.
 - By default, opening the Index.html page will use the settings in the Default.js file--do NOT delete or rename this file, however you are free to edit it.
 - To use a different config file, append a parameter to the url specifying the name of the file. For example, to use the settings in MySettings.js navigate to  www.myhostwebsite.com/Index.html?config=MySettings

File properties:
 - debug: if true, a right-wall crawling algorithm will be loaded automatically, and debugging information will be logged to the browser console.
 - mapSource: if null, map will be randomly generated. An array of strings containing the path from the root will load map files in order.
 - numberOfLevels: the number of levels before the game is won. This will only be used if mapSource is null.
 - enableWhile: whether while loops will appear in the toolbox.
 - enableDoWhile: whether do-while loops will appear in the toolbox.
 - enableIfElse: whether if-else structures will appear in the toolbox.
 - maxLevelOfNesting: the depth of structures that can be nested by the user. 1 means no nesting of structures is allowing.

======Maps=======
In the configuration file, you will notice you have the option to load Maps from json files. Put the json files into the "Maps" folder and add their relative paths into the config file, starting with "Maps/".

File properties:
 - width: width of map (number of tiles)
 - height: height of map (number of tiles)
 - verticalWalls: a boolean array representing the vertical walls, not including the outside border walls, where true is a present wall. Walls are read left to right, in rows top to bottom.
 - horizontalWalls: a boolean array representing the horizontal walls, not including the outside border walls, where true is a present wall. Walls are read left to right, in rows top to bottom.
 - playerPosition: array containing the initial x (horizontal) and y (vertical) position of the robot
 - playerDirection: initial direction of the player, where 0 is North, 1 is East, etc.
 - batteryPosition: initial position of the battery, stored like that of the player.
 - batterySize: number of actions/checks allowed by the robot before the battery dies and the level is lost.