# MidiDrumHero config editor
# https://github.com/ejj28/mididrumhero

import Tkinter
import yaml

try:
	with open('config.yml') as f:
		configData = yaml.load(f, Loader=yaml.FullLoader)
		print configData
except:
	print "The config file either does not exist or is corrupt."

top = Tkinter.Tk()

def addPad():
	editPad()

def editPad():
	pass

def removePad():
	pass

drumColours = ["Red", "Yellow", "Blue", "Green", "Orange"]
drumColourSelectorVar = Tkinter.StringVar()
drumColourSelectorVar.set(drumColours[0])
drumColourSelector = Tkinter.OptionMenu(top, drumColourSelectorVar, "Red")

padsList = Tkinter.Listbox(top)

addPadButton = Tkinter.Button(top, text="Add pad", command=addPad)
removePadButton = Tkinter.Button(top, text="Remove pad", command=removePad)
editPadButton = Tkinter.Button(top, text="Edit pad", command=editPad)

drumColourSelector.pack()

padsList.pack()

addPadButton.pack()
removePadButton.pack()
editPadButton.pack()

top.mainloop()
