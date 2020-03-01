# MidiDrumHero
# https://github.com/ejj28/mididrumhero

import pyvjoy
import pygame.midi
import time
import json

print "\nMidiDrumHero by ejj28"
print "https://github.com/ejj28/mididrumhero\n"

def millis():
	return int(round(time.time() * 1000))

configException = False

configData = []

try:
	with open("config.json", "r") as read_file:
		configData = json.load(read_file)
except IOError:
	print "The config file does not exist. Please run the configuration utility to create one.\n"
	configException = True
except ValueError:
	print "The config file is corrupt. Please run the configuration utility to recreate it.\n"
	configException = False
	
try:

	vController = pyvjoy.VJoyDevice(1)

	pygame.midi.init()

	midiNumbers = []

	print "Detected MIDI input devices:"

	count = 0
	for i in range( pygame.midi.get_count() ):
		r = pygame.midi.get_device_info(i)
		if r[2]:
			print str(count) + ": " + str(r[1])
			midiNumbers.append(i)
			count += 1

	print "Please enter the ID of the MIDI device to use:"
	userMidiSelection = int(raw_input())

	i = pygame.midi.Input(midiNumbers[userMidiSelection])

	print "Normal mode (n or leave blank) or monitor midi mode (m)?"
	mode = raw_input()

	lastHitTime = [0,0,0,0,0]
	states = [False, False, False, False, False]
	notes = [[],[],[],[],[]]
	controllerMappings = [0,0,0,0,0]
	isMapped = [False,False,False,False,False]
	drumNames = ["red drum pad", "yellow drum pad", "blue drum pad", "green drum pad", "kick pedal"]

	# assign buttons from config
	controllerMappings[0] = configData["drums"]["red"]["button"]
	controllerMappings[1] = configData["drums"]["yellow"]["button"]
	controllerMappings[2] = configData["drums"]["blue"]["button"]
	controllerMappings[3] = configData["drums"]["green"]["button"]
	controllerMappings[4] = configData["drums"]["orange"]["button"]

	for i in range(len(configData["drums"]["red"]["pads"])):
		notes[0].append(configData["drums"]["red"]["pads"][i]["midi"])

	print "MidiDrumHero is now translating your E-Kit to Clone Hero"

	while True:
		if i.poll():
			midi_events = i.read(10)
			for x in midi_events:
				
				for b in range(len(notes)):
					if x[0][1] == notes[b] and x[0][2] > 10 and states[b] == False:
						#print "ON, " + str(x[0][1])
						#print x
						vController.set_button(controllerMappings[b], 1)
						lastHitTime[b] = millis()
						states[b] = True
				
		for y in range(len(states)):
			if states[y] == True and millis() >= lastHitTime[y] + 50:
				vController.set_button(controllerMappings[y], 0)
				states[y] = False
					
except:
	pygame.midi.quit()

