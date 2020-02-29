# MidiDrumHero
# https://github.com/ejj28/mididrumhero

import pyvjoy
import pygame.midi
import time
import yaml

defaultConfig = {'configVerion': '1.0', 'drums': {'blue': {'button': 3, 'pads': [{'sensitivity': 10, 'midi': 45}]}, 'orange': {'button': 5, 'pads': [{'sensitivity': 10, 'midi': 36}]}, 'green': {'button': 4, 'pads': [{'sensitivity': 10, 'midi': 43}]}, 'red': {'button': 1, 'pads': [{'sensitivity': 10, 'midi': 38}]}, 'yellow': {'button': 2, 'pads': [{'sensitivity': 10, 'midi': 48}]}}}

print "\nMidiDrumHero by ejj28"
print "https://github.com/ejj28/mididrumhero\n"


def millis():
	return int(round(time.time() * 1000))


firstRun = False

try:
	with open('config.yml') as file:
		configData = yaml.load(file, Loader=yaml.FullLoader)
		
		print configData
except:
	print "The config file either does not exist or is corrupt. This is normal if this is your first time running MidiDrumHero. A new config file will be created.\n"
	with open('config.yml', 'w') as file:
		yaml.dump(defaultConfig, file)
		configData = yaml.load(file, Loader=yaml.FullLoader)
		print configData
		firstRun = True

	
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

					
except KeyboardInterrupt:
	pygame.midi.quit()

