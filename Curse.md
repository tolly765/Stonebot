# Curse scraper

This utility provides near real-time updates to a specified discord channel.
Before running the program, install discord.py through pip3 (sudo apt-get install pip3/sudo yum install python3 python3-wheel)

### Setup
#### Bot
The first time that the program is run, it will generate a blank config file and exit.
You must fill in both the discord token and the channel ID before the program will function correctly.
Also, if there is no svinfo file detected, it will automatically create one that watches over FTB Infinity Evolved.

#### Packs to watch
In order to tell the program what to look for, you must edit your svinfo.txt file accordingly. The current way of modifying this file is to 
find the ID (if it has one), latest file version and curse identifier.

##### Obtaining details for the svinfo file
Go to the curseforge project page and take the last part of the URL. From there, go to https://api.cfwidget.com/ and append the URL you took
to the end of the link. (for example, with ATM3 you take /minecraft/modpacks/all-the-mods-3 from 
https://www.curseforge.com/minecraft/modpacks/all-the-mods-3 and add it onto the end of the URL).
**IF THE URL REDIRECTS, USE THE NEW ONE!**

From there, you will be presented with a JSON output. Depending on how the URL is presented to you at the top of the output, you will need
to take certain steps. 

If your URL redirects to a project page (like ATM3):
- Disregard the ID and take the last part of the URL (all-the-mods-3).
- Find the first name value in files (this is your current version of the pack) and note down the **exact** value. 
From there, you can edit your svinfo file.

If your URL redirects to either a modpacks/minecraft or minecraft/modpacks page (this will be most FTB owned packs):
- Take note of the ID at the top of the page
- Find the first name value in files (this is your current version of the pack) and note down the **exact** value.
- Look at the URL on the second line and take note of the very last part of the URL (the same you used to get to the API page)
From there, you can edit your svinfo file.

##### Editing your svinfo file
- WIP -