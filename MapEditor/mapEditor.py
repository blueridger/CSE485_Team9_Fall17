from Tkinter import * 
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

	previousRobotItem = items[(robot[0],robot[1],'s')]
	if robot == battery:
		previousFill = BATTERY_FILL_COL
	else:
		previousFill = SQUARE_FILL_COL

	canv.itemconfig(previousRobotItem, fill=previousFill)
	canv.itemconfig(item, fill=ROBOT_FILL_COL)
	robot[0] = itemsIndexes[item][0]
	robot[1] = itemsIndexes[item][1]


def onRightDoubleClick(event):
	item = event.widget.find_closest(event.x, event.y)[0]
	print (item, "eke")
	print (itemsIndexes[item])
	previousBatteryItem = items[(battery[0],battery[1],'s')]

	if robot == battery:
		previousFill = ROBOT_FILL_COL
	else:
		previousFill = SQUARE_FILL_COL

	canv.itemconfig(previousBatteryItem, fill=previousFill)
	canv.itemconfig(item, fill=BATTERY_FILL_COL)
	battery[0] = itemsIndexes[item][0]
	battery[1] = itemsIndexes[item][1]



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
robot = [0,0]


BORD_FILL_COL = "#5e5e5e"
BORD_LINE_COL = "#383838"
WALL_OFF_COL = "#a4adc1"
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
			items[(x,y,'v')] = canv.create_polygon(render("vAct",r,l,t,sX_temp,sY_temp), fill=WALL_OFF_COL)
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
			print("uhhhhhhh")
			items[(x,y,'s')] = canv.create_rectangle(sX_temp, sY_temp, sX_temp+l-r-r, sY_temp+l-r-r, fill=BATTERY_FILL_COL, outline='')
			itemsIndexes[ items[(x,y,'s')] ] = [x,y,'s']
			canv.tag_bind( items[(x,y,'s')] , '<Double-Button-3>', onRightDoubleClick)
			canv.tag_bind( items[(x,y,'s')] , '<Double-Button-1>', onLeftDoubleClick)
			
		elif [x, y] == robot:
			items[(x,y,'s')] = canv.create_rectangle(sX_temp, sY_temp, sX_temp+l-r-r, sY_temp+l-r-r, fill=ROBOT_FILL_COL, outline='')
			itemsIndexes[ items[(x,y,'s')] ] = [x,y,'s']
			canv.tag_bind( items[(x,y,'s')] , '<Double-Button-3>', onRightDoubleClick)
			canv.tag_bind( items[(x,y,'s')] , '<Double-Button-1>', onLeftDoubleClick)

		else:
			print battery
			print (x,y)
			items[(x,y,'s')] = canv.create_rectangle(sX_temp, sY_temp, sX_temp+l-r-r, sY_temp+l-r-r, fill=SQUARE_FILL_COL, outline='')
			itemsIndexes[ items[(x,y,'s')] ] = [x,y,'s']
			canv.tag_bind( items[(x,y,'s')] , '<Double-Button-3>', onRightDoubleClick)
			canv.tag_bind( items[(x,y,'s')] , '<Double-Button-1>', onLeftDoubleClick)
		
		sX_temp += l
	sY_temp += l


# call 


#photo = PhotoImage(file = './pl-robot-animate.gif')

#canv.create_image(0,0, image=photo)


#canv.create_polygon(vertActive, fill="blue")
#canv.create_polygon(horizBorderTop, fill="blue")

#canv.tag_bind('obj2Tag', '<ButtonPress-1>', onObjectClick)   
canv.pack()
root.mainloop()