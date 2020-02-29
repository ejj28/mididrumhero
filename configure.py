# MidiDrumHero config editor
# https://github.com/ejj28/mididrumhero

import Tkinter
import yaml

try:
	with open('sampleconfig.yml') as f:
		configData = yaml.load(f, Loader=yaml.FullLoader)
		print configData
except:
	print "The config file either does not exist or is corrupt."

top = Tkinter.Tk()

values = []



def addPad():
	values.append({"midi": midiNumEntry.get(), "velocity": velocityEntry.get(), "button": buttonNumEntry.get()})
	padsList.insert(Tkinter.END, values[len(values) - 1])
def removePad():
	del(values[padsList.curselection()[0]])
	padsList.delete(padsList.curselection()[0])

def save():
	pass


drumsLabel = Tkinter.Label(top, text="Assigned drum pads")
velocityLabel = Tkinter.Label(top, text="Trigger velocity")
padLabel = Tkinter.Label(top, text="Midi number")
buttonNumLabel = Tkinter.Label(top, text="Button number")



padsList = Tkinter.Listbox(top, width=35)

addPadButton = Tkinter.Button(top, text="Add", command=addPad)
removePadButton = Tkinter.Button(top, text="Remove", command=removePad)
saveButton = Tkinter.Button(top, text="Save", command=save)


velocityEntry = Tkinter.Entry(top)
buttonNumEntry = Tkinter.Entry(top)
midiNumEntry = Tkinter.Entry(top)




padsList.grid(row=4,column=1)



midiNumEntry.grid(row=6,column=0)
velocityEntry.grid(row=6,column=1)
buttonNumEntry.grid(row=6,column=2)


addPadButton.grid(row=7,column=1)
removePadButton.grid(row=9,column=1)
saveButton.grid(row=10,column=1)



drumsLabel.grid(row=2, column=1)
velocityLabel.grid(row=5, column=0)
padLabel.grid(row=5, column=1)
buttonNumLabel.grid(row=5, column=2)

top.mainloop()
