Welcome to the Maze Runner back end.

======Configurations=======
There are a number of settings which you can define that change the game experience. These are defined in Javascript files in the "Configurations" folder. You can easily edit existing config files or you can create a new one by making a copy of an existing config file.
- By default, opening the Index.html page will use the settings in the Default.js file--do NOT delete or rename this file, however you are free to edit it.
- To use a different config file, append a parameter to the url specifying the name of the file. For example, to use the settings in MySettings.js navigate to  www.myhostwebsite.com/Index.html?config=MySettings

======Maps=======
In the configuration file, you will notice you have the option to load Maps from json files. Put the json files into the "Maps" folder and add their relative paths into the config file, starting with "Maps/".