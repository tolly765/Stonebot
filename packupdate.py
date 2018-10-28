from __future__ import print_function
from discord_hooks import Webhook

import os
import urllib
import requests
import json
import asyncio
import time
import sys

# Check for configs
if not os.path.isfile("curse_config.json"):
    # Create the configuration file as it doesn't exist yet
    cfgfile = open("curse_config.json", 'w')
    blankconfig = {
        "hook":"hookurl"
    }
    json.dump(blankconfig, cfgfile, indent=4)
    sys.exit("Config file has been created. Please edit the config before trying to use the bot. Exiting...")
    
if not os.path.isfile("packs.json"):
    # Create the configuration file as it doesn't exist yet
    packfile = open("packs.json", 'w')
    blankpackfile = {
        "examplepack": {
            "id": "227724",
            "slug": "ftb-infinity-evolved",
            "version": "FTBInfinity-3.0.1-1.7.10.zip"
        }
    }
    json.dump(blankpackfile, packfile, indent=4)
    sys.exit("Example pack file has been created. Please edit the file before trying to use the bot. Exiting...")


# Config settings
with open('curse_config.json') as curse_config:
    config_data = json.load(curse_config)
hookurl = config_data['hook']


while True:
    # Packs
    with open('packs.json', 'r') as pack_config:
        pack_data = json.load(pack_config)

    for pack in pack_data.items():
        name = pack[1]['id']
        packname = pack[1]['slug']
        version = pack[1]['version']

        # Get the JSON from curse
        MOMIurl = 'https://api.cfwidget.com/modpacks/minecraft/' + name + "-" + packname + "/"
        MIMOurl = 'https://api.cfwidget.com/minecraft/modpacks/' + packname + "/"
        curseurl = "https://api.cfwidget.com/projects/" + name + "/"
        
        data = {}
        
        print("checking " + name + " " + packname)
        if name != "null":
            print("trying MOMI")
            MOMIresponse = requests.get(MOMIurl)
            if MOMIresponse.status_code != 200:
                print("trying MIMO")
                MIMOresponse = requests.get(MIMOurl)
                
                if MIMOresponse.status_code != 200:
                    print("trying curse last")
                    cresponse = requests.get(curseurl)
                    
                    if cresponse.status_code != 200:
                        print("All URLs failed for " + name + " " + packname)
                    else:
                        data = json.loads(cresponse.text)
                else:
                    data = json.loads(MIMOresponse.text)
            else:
                data = json.loads(MOMIresponse.text)
        else:
            print("trying MIMO")
            MIMOresponse = requests.get(MIMOurl)
            if MIMOresponse.status_code != 200:
                print("All URLs failed for " + name + " " + packname)
            else:
                data = json.loads(MIMOresponse.text)

        if 'error' in data:
            print("Error: URL Specified does not exist in API database. Please try request again later")
        
        newVersion = data['files'][0]['name']
        
        if version != newVersion:
            msgIcon = data['thumbnail']
            # New version found, sending update message and updating local versions
            print("----------------------New version available!----------------------\n")            
            print(name + ": " + version + " --> " + newVersion)

            embed = Webhook(hookurl,color=123123)           
            embed.set_author(name=data['title'] + " has an update!", icon=msgIcon)
            embed.add_field(name='Old Version', value=version)
            embed.add_field(name='New Version', value=newVersion)
            embed.set_footer(ts=True)
            embed.post()

            # Setting new version for json
            pack_data[pack[0]]['version'] = newVersion
            
            # Write json to file
            with open('packs.json', 'w') as new_pack_config:
                json.dump(pack_data, new_pack_config, indent=4, sort_keys=True)
                new_pack_config.close()
    
    time.sleep(600)