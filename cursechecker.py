from __future__ import print_function
import os
import urllib
import requests
import json
import discord
import asyncio
import time
import sys

# This utility was created by Tom Harrison (tolly765)
# See the readme for instructions on how to set up the pack URLs
splitKey = ';'
data = {}
client = discord.Client()

try:
    os.makedirs('info')
    if not os.path.isfile(os.path.join("info", "svinfo.txt")):
        with open(os.path.join("info", "svinfo.txt"), "w") as svinfo_txt:
            blankinfo = "227724;FTBInfinity-3.0.1-1.7.10.zip;ftb-infinity-evolved"
            svinfo_txt.writelines(blankinfo)
except OSError:
    pass

# Check for config
if not os.path.isfile("curse_config.json"):
    # Create the configuration file as it doesn't exist yet
    cfgfile = open("curse_config.json", 'w')
    blankconfig = {
        "Bot":{
            "Token":"bottokenhere",
	    "Channel":"outputchannelhere"
	    }
        }
    json.dump(blankconfig, cfgfile, indent=4)
    sys.exit("Config file has been created. Please edit config before trying to use the bot. Exiting...")



# Config settings
with open('curse_config.json') as curse_config:
    config_data = json.load(curse_config)
discordchannel = config_data['Bot']['Channel']
discordtoken = config_data['Bot']['Token']

# Modpack check
async def modpack_check():
    await client.wait_until_ready()
    global data
    while True:
        lines = []
        print("Waiting...")
        time.sleep(10)
        print("Waiting done\n\n")
        with open(os.path.join('info','svinfo.txt'), "r") as file:
            # Take lines from text file
            lines = file.readlines()
        for key,line in enumerate(lines):
            # Strip line into segments and extract parts needed for URL parsing
            lineItem = line.split(splitKey)
            name = lineItem[0].rstrip()
            version = lineItem[1].rstrip()
            packname = lineItem[2].rstrip()
            print("Starting Debug:\n")
            print("Name: ", name, "\nVersion: ", version, "\nPack Name: ", packname)
            # Get the JSON from curse
            MOMIurl = 'https://api.cfwidget.com/modpacks/minecraft/' + name + "-" + packname + "/"
            MIMOurl = 'https://api.cfwidget.com/minecraft/modpacks/' + packname + "/"
            curseurl = "https://api.cfwidget.com/projects/" + name + "/"
            MOMIresponse = requests.get(MOMIurl)
            MIMOresponse = requests.get(MIMOurl)
            cresponse = requests.get(curseurl)
            MOMIstat = MOMIresponse.status_code
            MIMOstat = MIMOresponse.status_code
            crstat = cresponse.status_code
            print(MOMIurl)
            print("MO-MI Status code:", MOMIstat)
            print("=========================")
            print(MIMOurl)
            print("MI-MO Status code:", MIMOstat)
            print("=========================")
            print(curseurl)
            print("MI-MO Status code:", crstat)
            print("=========================")
            # Check if URLs return a 200 OK response (indicating the URL is correct)
            if MOMIstat == 200:
                print("Starting retrieval on MOMI URL")
                data = json.loads(MOMIresponse.text)
                print(data['files'][0]['name'])
                print("MOMI URL successful\n")
            elif MIMOstat == 200:
                print("Starting retrieval on MIMO URL")
                data = json.loads(MIMOresponse.text)
                print(data['files'][0]['name'])
                print("MIMO URL successful")
            elif crstat == 200:
                print("Starting retrieval on Project URL")
                data = json.loads(cresponse.text)
                print(data['files'][0]['name'])
                print("Project URL successful")
            else:
                print("One or both URLs failed. Check console for logs")
                sys.exit("Line " + lineItem + "has given an error")
                break
                
            if 'error' in data:
                print("Error: URL Specified does not exist in API database. Please try request again later")
            newVersion = data['files'][0]['name']
            msgIcon = data['thumbnail']
            if version != newVersion :
                # New version found, sending update message and updating local versions
                print("----------------------New version available!----------------------\n")            
                print(name + ": " + version + " --> " + newVersion)
                embedmessage=discord.Embed(color=0xff0000)
                embedmessage.set_author(name=data['title'] + " has an update!", icon_url=msgIcon)
                embedmessage.add_field(name='Old Version', value=version, inline=True)
                embedmessage.add_field(name='New Version', value=newVersion, inline=True)
                await client.send_message(discord.Object(id=discordchannel), embed=embedmessage)
                # Add a carriage return to all lines except for the very last one in the text file
                lines[key] = name+splitKey + newVersion+splitKey + packname
                if key < len(lines)-1:
                    lines[key] = lines[key] + "\r\n"
                # Write local copy of versions to file
                with open(os.path.join('info','svinfo.txt'), "w") as file:
                    file.writelines(lines)
        file.close()

@client.event
async def on_ready():
    print('-------------------')
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)
    print('-------------------')
    client.loop.create_task(modpack_check())

client.run(discordtoken)
