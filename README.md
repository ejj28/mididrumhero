# MidiDrumHero
 A bridge between E-Kits and Clone Hero

## Usage

### Installation
- [Download and install vJoy for Windows 10 Only](https://github.com/jshafer817/vJoy/releases)
- [Download and install vJoy for other Windows versions](https://github.com/shauleiz/vJoy/releases)
- [Download MidiDrumHero](https://github.com/ejj28/mididrumhero/releases/tag/v1.0.0) and install

### Usage
- Select your Midi device, click **Monitor** and hit your drum pads to find the Midi note values of the drum pads you would like to map
- Return to **Dashboard**, and for each pad, click the **New Drum Pad** button and enter:
    - The Midi note number of the pad
    - The button number the pad will show up as in Clone Hero's settings, it doesn't matter what number you use, as long as you use 1 to 8 and use a different number for each pad unless you want multiple pads to correspond to the same pad in-game
    - The velocity at which you would like to set the hit threshold at. A good default value is 10; if your drums are sensitive and are registering erroneous hits, adjust the sesitivity as needed.
- When done adding the pad, press the Save button
- To add more that 8 buttons (default 1-8), configure it in the "Configure vJoy" application installed with vJoy.

As soon as a Midi device has been selected, MidiDrumHero will begin reading drum hits from your E-Kit and sending them to Clone Hero. Simply map your drums in Clone Hero and play!

### Credits
Developed by [ejj28](https://github.com/ejj28) and [towner-10](https://github.com/towner-10)

#### Need help? Ping me (ejj28) on the Clone Hero Discord server

Feel free to fork this repo and create pull requests, contributions are always welcome!
