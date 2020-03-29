# MidiDrumHero
 A bridge between E-Kits and Clone Hero

## Usage

### Installation
- [Download and install vJoy for Windows 10 Only](https://github.com/jshafer817/vJoy/releases)
- [Download and install vJoy for other Windows versions](https://github.com/shauleiz/vJoy/releases)
- [Download MidiDrumHero](https://github.com/ejj28/mididrumhero/releases/download/v1.2.0/mididrumhero-1.2.0.zip) and extract

### Configuring
- Use **monitor.exe** to find the Midi note values of the drum pads you would like to map
- Use **configure.exe** to add your pads. Upon first run you may get a warning about a config file not existing; this is fine, a new one will be created. For each pad, enter:
    - The midi note number of the pad
    - The button number the pad will show up as in Clone Hero's settings, it doesn't matter what number you use, as long as you use 1 to 8 and use a different number for each pad unless you want multiple pads to correspond to the same pad in-game
    - The velocity at which you would like to set the hit threshold at. A good default value is 10; if your drums are sensitive and are registering erroneous hits, adjust the sesitivity as needed.
- When done adding/removing mappings, press the Save button

### Running
- Open **mididrumhero.exe**
- A list of detected Midi input devices will be shown; enter the number on the left of the device you would like to use
- MidiDrumHero will now convert your E-kit's Midi signals to gamepad button presses

#### Need help? Ping me (ejj28) on the Clone Hero Discord server

### Information for Developers
If you're running mididrumhero from source, you'll need to take the `utils` folder found inside the `pyvjoy` folder included in this repo and put it in `C:\\Python27\Lib\site-packages\pyvjoy`.

Feel free to fork this repo and create pull requests, contributions are always welcome!
