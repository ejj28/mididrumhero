# MidiDrumHero
# https://github.com/ejj28/mididrumhero

import pyvjoy
import pygame.midi
import time

print "\nMidiDrumHero by ejj28"
print "https://github.com/ejj28/mididrumhero\n"


def millis():
	return int(round(time.time() * 1000))




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
	notes = [48,38,43,45,36]
	controllerMappings = [1,2,3,4,5]
	isMapped = [False,False,False,False,False]
	drumNames = ["red drum pad", "yellow drum pad", "blue drum pad", "green drum pad", "kick pedal"]

	for t in range(len(controllerMappings)):
		print "Please hit the " + drumNames[t]
		while isMapped[t] == False:
			if i.poll():
				midi_events = i.read(10)
				for x in midi_events:
					if x[0][2] > 10:
						notes[t] = x[0][1]
						isMapped[t] = True
						print "Mapped " + drumNames[t] + " to Midi note " + str(x[0][1])
						break
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

