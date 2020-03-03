# MidiDrumHero
 A bridge between E-Kits and Clone Hero

## Usage

### Installation
- [Download and install vJoy for Windows 10 Only](https://github.com/jshafer817/vJoy/releases)
- [Download and install vJoy for other Windows versions](https://github.com/shauleiz/vJoy/releases)
- [Download MidiDrumHero](https://github.com/ejj28/mididrumhero/releases/download/v1.0.0/mididrumhero_win64_v1.0.0.zip) and extract

### Configuring
- Use **monitor.exe** to find the Midi note values of the drum pads you would like to map
- Use **configure.exe** to add your pads. Upon first run you may get a warning about a config file not existing; this is fine, a new one will be created. For each pad, enter the proper Midi note number, the button number you would like to map the pad to, and the velocity at which you would like to set the hit threshold at. A good default value is 10; if your drums are sensitive and are registering erroneous hits, adjust the sesitivity as needed.
- When done adding/removing mappings, press the Save button

### Running
- Open **mididrumhero.exe**
- A list of detected Midi input devices will be shown; enter the number on the left of the device you would like to use
- MidiDrumHero will now convert your E-kit's Midi signals to gamepad button presses