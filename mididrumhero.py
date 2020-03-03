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
	print "The config file does not exist. Please run the configuration utility to create one."
	configException = True
except ValueError:
	print "The config file is corrupt. Please run the configuration utility to recreate it."
	configException = True

if configException == True:
	raw_input("Press enter to exit.")
	exit()

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

	lastHitTime = []
	states = []

	mapLength = len(configData)

	for c in configData:
		lastHitTime.append(0)
		states.append(False)

	print "MidiDrumHero is now translating your E-Kit to Clone Hero"

	while True:

		if i.poll():
			
			midi_events = i.read(10)
			
			for x in midi_events:
				if x[0][0] != 248 and x[0][2] != 0:
					for b in range(len(configData)):
						if x[0][1] == configData[b]["midi"] and x[0][2] > configData[b]["velocity"] and states[b] == False:
							vController.set_button(configData[b]["button"], 1)
							lastHitTime[b] = millis()
							states[b] = True
							
		
		for y in range(len(configData)):
			if states[y] == True and millis() >= lastHitTime[y] + 50:
				vController.set_button(configData[y]["button"], 0)
				states[y] = False
					
finally:
	pygame.midi.quit()

