# MidiDrumHero
# https://github.com/ejj28/mididrumhero

import pygame.midi
import time

print "\nMidiDrumHero Monitor by ejj28"
print "https://github.com/ejj28/mididrumhero\n"

def millis():
	return int(round(time.time() * 1000))

try:

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

	print "Please enter the number of the MIDI device to use:"
	userMidiSelection = int(raw_input())

	i = pygame.midi.Input(midiNumbers[userMidiSelection])

	print "MidiDrumHero is now listening for midi events"

	while True:
		if i.poll():
			midi_events = i.read(10)
			for x in midi_events:
				if x[0][2] != 0:
					print "Midi note " + str(x[0][1]) + " at velocity " + str(x[0][2])
except Exception as e:
	pygame.midi.quit()
	print e
	raw_input("An error has occurred. Press enter to exit.")
	exit()
finally:
	pygame.midi.quit()