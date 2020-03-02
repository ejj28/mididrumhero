import sys
from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need fine tuning.
build_exe_options = {"packages": ["os"], "excludes": ["tkinter", "numpy"]}

executables = [
    Executable('mididrumhero.py'),
    Executable('monitor.py'),
	Executable('configure.py', base="Win32GUI")
	]

setup(  name = "MidiDrumHero",
        version = "1.2",
        description = "A bridge between E-Kits and Clone Hero",
        options = {"build_exe": build_exe_options},
        executables = executables)