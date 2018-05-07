from Tkinter import *
import Tkinter, Tkconstants, tkFileDialog
from PIL import ImageTk, Image
from time import sleep
import json

def onMouseClick(event):
	item = event.widget.find_closest(event.x, event.y)[0]
	#print(item)
	#print (itemsIndexes[item])
	if (itemsIndexes[item])[3] == False:
		canv.itemconfig(item, fill=WALL_ON_COL)
		itemsIndexes[item][3] = True
	else:
		canv.itemconfig(item, fill=WALL_OFF_COL)
		itemsIndexes[item][3] = False


def onLeftDoubleClick(event):
	item = event.widget.find_closest(event.x, event.y)[0]
	#print (item)
	#print (itemsIndexes[item])

	prevRobotCoords = (robot[0],robot[1])
	
	previousRobotItem = items[(robot[0],robot[1],'s')]
	if robot == battery:
		previousFill = BATTERY_FILL_COL
	else:
		previousFill = SQUARE_FILL_COL

	canv.itemconfig(previousRobotItem, fill=previousFill)
	canv.itemconfig(item, fill=ROBOT_FILL_COL)
	robot[0] = itemsIndexes[item][0]
	robot[1] = itemsIndexes[item][1]

	robotImageTranslation = l*(robot[0]-prevRobotCoords[0]), l*(robot[1]-prevRobotCoords[1])
	canv.move('robotImage', robotImageTranslation[0], robotImageTranslation[1])


def onRightDoubleClick(event):
	item = event.widget.find_closest(event.x, event.y)[0]
	#print (item, "eke")
	#print (itemsIndexes[item])

	prevBatteryCoords = (battery[0],battery[1])

	previousBatteryItem = items[(battery[0],battery[1],'s')]

	if robot == battery:
		previousFill = ROBOT_FILL_COL
	else:
		previousFill = SQUARE_FILL_COL

	canv.itemconfig(previousBatteryItem, fill=previousFill)
	canv.itemconfig(item, fill=BATTERY_FILL_COL)
	battery[0] = itemsIndexes[item][0]
	battery[1] = itemsIndexes[item][1]

	batteryImageTranslation = l*(battery[0]-prevBatteryCoords[0]), l*(battery[1]-prevBatteryCoords[1])
	canv.move('batteryImage', batteryImageTranslation[0], batteryImageTranslation[1])


def graphicFormula(type, r, l, t, sX, sY):
	output = {"vAct" : (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l, sX-r, sY+l-t, sX-r, sY+t),
				"hAct" : (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY, sX+l-t, sY+r, sX+t, sY+r),
				"vBordL" : (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l), 
				"hBordB" : (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY), 
				"vBordR" : (sX, sY, sX-r, sY+t, sX-r, sY+l-t, sX, sY+l),
				"hBordT" : (sX, sY, sX+t, sY+r, sX+l-t, sY+r, sX+l, sY)}

	return output[type]


def onLoadButtonClick(event):
	items.clear()
	itemsIndexes.clear()
	canv.delete("all")

	root.filename = None
	while root.filename is None:
		try:
			# connect
			root.filename = tkFileDialog.askopenfilename(initialdir = "/",title = "Select file",filetypes = (("JSON files","*.json"),("all files","*.*")))
			loadFromFile(root.filename)
		except:
			root.filename = None
			pass



	
	beet = mapData[0]["width"]
	yeet = mapData[0]["height"]
	print mapData[0]["playerPosition"][0]
	robot[0] = mapData[0]["playerPosition"][0]
	robot[1] = mapData[0]["playerPosition"][1]

	battery[0] = mapData[0]["batteryPosition"][0]
	battery[1] = mapData[0]["batteryPosition"][1]
	print battery, robot
	renderBoard(canv, beet, yeet)


def loadFromFile(path):
	with open(path) as f:
		mapData[0] = json.load(f)




def renderBoard(canvas, width, height):

	sX_temp = sX
	sY_temp = sY
	x_cells = width
	y_cells = height

	root.geometry( str(x_cells*l+r+r+menuWidth) +"x" + str(y_cells*l+r+r) )
	for y in range(0, y_cells+1):
		sX_temp = sX
		for x in range(0, x_cells):
			print x*y
			
			if y == 0:
				canv.create_polygon(graphicFormula("hBordT",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)
			elif y == y_cells:
				canv.create_polygon(graphicFormula("hBordB",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)

			elif len( mapData[0] ) > 0 and mapData[0]["horizontalWalls"][x + (y-1)*x_cells] == True:
				items[(x,y,'h')] = canv.create_polygon(graphicFormula("hAct",r,l,t,sX_temp,sY_temp), fill=WALL_ON_COL)
				itemsIndexes[ items[(x,y,'h')] ] = [x,y,'h',True]
				canv.tag_bind( items[(x,y,'h')] , '<Button-1>', onMouseClick)

			else:
				items[(x,y,'h')] = canv.create_polygon(graphicFormula("hAct",r,l,t,sX_temp,sY_temp), fill=WALL_OFF_COL)
				itemsIndexes[ items[(x,y,'h')] ] = [x,y,'h',False]
				canv.tag_bind( items[(x,y,'h')] , '<Button-1>', onMouseClick)

			sX_temp += l
		sY_temp += l

	sX_temp = sX
	sY_temp = sY
	for y in range(0, y_cells):
		sX_temp = sX
		for x in range(0, x_cells+1):
			
			if x == 0:
				canv.create_polygon(graphicFormula("vBordL",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)
			elif x == x_cells:
				canv.create_polygon(graphicFormula("vBordR",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)
			elif len( mapData[0] ) > 0 and mapData[0]["verticalWalls"][x-1 + (y)*(x_cells-1)] == True:
				items[(x,y,'v')] = canv.create_polygon(graphicFormula("vAct",r,l,t,sX_temp,sY_temp), fill=WALL_ON_COL)
				itemsIndexes[ items[(x,y,'v')] ] = [x,y,'v',True]
				canv.tag_bind( items[(x,y,'v')] , '<Button-1>', onMouseClick)
			else:
				items[(x,y,'v')] = canv.create_polygon(graphicFormula("vAct",r,l,t,sX_temp,sY_temp), fill=WALL_OFF_COL, outline=BORD_LINE_COL)
				itemsIndexes[ items[(x,y,'v')] ] = [x,y,'v',False]
				canv.tag_bind( items[(x,y,'v')] , '<Button-1>', onMouseClick)

			sX_temp += l
		sY_temp += l


	sX_temp = sX + r
	sY_temp = sY + r
	for y in range(0, y_cells):
		sX_temp = sX + r
		for x in range(0, x_cells):
			if [x, y] == battery:
				items[(x,y,'s')] = canv.create_rectangle(sX_temp, sY_temp, sX_temp+l-r-r, sY_temp+l-r-r, fill=BATTERY_FILL_COL, outline=BORD_LINE_COL)
				itemsIndexes[ items[(x,y,'s')] ] = [x,y,'s']
				canv.tag_bind( items[(x,y,'s')] , '<Double-Button-3>', onRightDoubleClick)
				canv.tag_bind( items[(x,y,'s')] , '<Double-Button-1>', onLeftDoubleClick)
				
			elif [x, y] == robot:
				items[(x,y,'s')] = canv.create_rectangle(sX_temp, sY_temp, sX_temp+l-r-r, sY_temp+l-r-r, fill=ROBOT_FILL_COL, outline=BORD_LINE_COL)
				itemsIndexes[ items[(x,y,'s')] ] = [x,y,'s']
				canv.tag_bind( items[(x,y,'s')] , '<Double-Button-3>', onRightDoubleClick)
				canv.tag_bind( items[(x,y,'s')] , '<Double-Button-1>', onLeftDoubleClick)

			else:
				#print battery
				#print (x,y)
				items[(x,y,'s')] = canv.create_rectangle(sX_temp, sY_temp, sX_temp+l-r-r, sY_temp+l-r-r, fill=SQUARE_FILL_COL, outline=BORD_LINE_COL)
				itemsIndexes[ items[(x,y,'s')] ] = [x,y,'s']
				canv.tag_bind( items[(x,y,'s')] , '<Double-Button-3>', onRightDoubleClick)
				canv.tag_bind( items[(x,y,'s')] , '<Double-Button-1>', onLeftDoubleClick)
			
			sX_temp += l
		sY_temp += l


	# place robot image
	robotImageCoords = sX + l*robot[0]+16, sY + l*robot[1]+16
	robotImage = Image.open('small-robot.png')
	robotImage = robotImage.resize( (70,70), Image.ANTIALIAS)
	items[(0,0,'robotImage')] = robotImage = ImageTk.PhotoImage(robotImage)
	canv.create_image(robotImageCoords, image=robotImage, anchor=NW, tags='robotImage')
	print "yeayeet"

	# place robot image
	batteryImageCoords = sX + l*battery[0]+21, sY + l*battery[1]+20
	batteryImage = Image.open('battery.png')
	batteryImage = batteryImage.resize( (60,60), Image.ANTIALIAS)
	items[(0,0,'batteryImage')] = batteryImage = ImageTk.PhotoImage(batteryImage)
	canv.create_image(batteryImageCoords, image=batteryImage, anchor=NW, tags='batteryImage')

	#place menu buttons
	loadButton = canv.create_rectangle(r, r, menuWidth, menuWidth, fill=BATTERY_FILL_COL, outline=BORD_LINE_COL)
	canv.tag_bind( loadButton, '<Button-1>', onLoadButtonClick)








BORD_FILL_COL = "#5e5e5e"
BORD_LINE_COL = "#383838"
WALL_OFF_COL = "#e2e2e2"
WALL_ON_COL = "#1b4263"
SQUARE_FILL_COL = "#e2e2e2"
ROBOT_FILL_COL = "#f28e24"
BATTERY_FILL_COL = "#1d84e5"

DEFAULT_WIDTH = 5
DEFAULT_HEIGHT = 5

menuWidth = 70
r = 12
l = 100
t = r
sX = r-1 + menuWidth
sY = r 

x_cells = DEFAULT_WIDTH
y_cells = DEFAULT_HEIGHT

battery = [x_cells-1, y_cells-1]
robot = [1,1]

mapData = [{}]

vertActive = (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l, sX-r, sY+l-t, sX-r, sY+t)
horizActive = (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY, sX+l-t, sY+r, sX+t, sY+r)

vertBorderLeft = (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l)
horizBorderBottom = (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY)

vertBorderRight = (sX, sY, sX-r, sY+t, sX-r, sY+l-t, sX, sY+l)
horizBorderTop = (sX, sY, sX+t, sY+r, sX+l-t, sY+r, sX+l, sY)

windowSize = [x_cells*l+r+r+menuWidth, y_cells*l+r+r]

root = Tk()
canv = Canvas(root, width=windowSize[0], height=windowSize[1], background=SQUARE_FILL_COL)


items = {}
itemsIndexes = {}
# put in horizontal items

renderBoard(canv, x_cells, y_cells)



canv.pack(fill="both", expand=True)
root.mainloop()