from Tkinter import * 
from PIL import ImageTk, Image
from time import sleep

def onMouseClick(event):
	item = event.widget.find_closest(event.x, event.y)[0]
	print(item)
	print (itemsIndexes[item])
	if (itemsIndexes[item])[3] == False:
		canv.itemconfig(item, fill=WALL_ON_COL)
		itemsIndexes[item][3] = True
   	else:
   		canv.itemconfig(item, fill=WALL_OFF_COL)
   		itemsIndexes[item][3] = False


def onLeftDoubleClick(event):
	item = event.widget.find_closest(event.x, event.y)[0]
	print (item)
	print (itemsIndexes[item])

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
	print (item, "eke")
	print (itemsIndexes[item])

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



def render(type, r, l, t, sX, sY):
	output = {"vAct" : (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l, sX-r, sY+l-t, sX-r, sY+t),
				"hAct" : (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY, sX+l-t, sY+r, sX+t, sY+r),
				"vBordL" : (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l), 
				"hBordB" : (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY), 
				"vBordR" : (sX, sY, sX-r, sY+t, sX-r, sY+l-t, sX, sY+l),
				"hBordT" : (sX, sY, sX+t, sY+r, sX+l-t, sY+r, sX+l, sY)}

	return output[type]

x_cells = 7
y_cells = 7

battery = [x_cells-1, y_cells-1]
robot = [1,1]


BORD_FILL_COL = "#5e5e5e"
BORD_LINE_COL = "#383838"
WALL_OFF_COL = "#e2e2e2"
WALL_ON_COL = "#1b4263"
SQUARE_FILL_COL = "#e2e2e2"
ROBOT_FILL_COL = "#f28e24"
BATTERY_FILL_COL = "#1d84e5"

menuHeight = 70
r = 10
l = 100
t = 10
sX = 11 + menuHeight
sY = 12 



vertActive = (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l, sX-r, sY+l-t, sX-r, sY+t)
horizActive = (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY, sX+l-t, sY+r, sX+t, sY+r)

vertBorderLeft = (sX, sY, sX+r, sY+t, sX+r, sY+l-t, sX, sY+l)
horizBorderBottom = (sX, sY, sX+t, sY-r, sX+l-t, sY-r, sX+l, sY)

vertBorderRight = (sX, sY, sX-r, sY+t, sX-r, sY+l-t, sX, sY+l)
horizBorderTop = (sX, sY, sX+t, sY+r, sX+l-t, sY+r, sX+l, sY)

windowSize = [x_cells*l+r+r+menuHeight, y_cells*l+r+r]

root = Tk()
canv = Canvas(root, width=windowSize[0], height=windowSize[1], background=SQUARE_FILL_COL)

items = {}
itemsIndexes = {}
# put in horizontal items
sX_temp = sX
sY_temp = sY
for y in range(0, y_cells+1):
	sX_temp = sX
	for x in range(0, x_cells):
		
		if y == 0:
			canv.create_polygon(render("hBordT",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)
		elif y == y_cells:
			canv.create_polygon(render("hBordB",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)
		else:
			items[(x,y,'h')] = canv.create_polygon(render("hAct",r,l,t,sX_temp,sY_temp), fill=WALL_OFF_COL)
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
			canv.create_polygon(render("vBordL",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)
		elif x == x_cells:
			canv.create_polygon(render("vBordR",r,l,t,sX_temp,sY_temp), fill=BORD_FILL_COL, outline=BORD_LINE_COL)
		else:
			items[(x,y,'v')] = canv.create_polygon(render("vAct",r,l,t,sX_temp,sY_temp), fill=WALL_OFF_COL, outline=BORD_LINE_COL)
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
			print battery
			print (x,y)
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
robotImage = ImageTk.PhotoImage(robotImage)
canv.create_image(robotImageCoords, image=robotImage, anchor=NW, tags='robotImage')

# place robot image
batteryImageCoords = sX + l*battery[0]+21, sY + l*battery[1]+20
batteryImage = Image.open('battery.png')
batteryImage = batteryImage.resize( (60,60), Image.ANTIALIAS)
batteryImage = ImageTk.PhotoImage(batteryImage)
canv.create_image(batteryImageCoords, image=batteryImage, anchor=NW, tags='batteryImage')


canv.pack()
root.mainloop()