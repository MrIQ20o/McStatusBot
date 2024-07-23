const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const axios = require('axios');
const { token, serverIP, serverPort } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const updateStatus = async () => {
        try {
            const response = await axios.get(`https://api.mcstatus.io/v2/status/java/${serverIP}:${serverPort}`);
            console.log(response.data); // برای نمایش اطلاعات دریافتی در کنسول
            if (response.data && response.data.players && response.data.players.online !== undefined) {
                const playersOnline = response.data.players.online;
                const playersMax = response.data.players.max;
                client.user.setPresence({
  activities: [{ name: `${playersOnline} Players`, type: ActivityType.Watching }],
  status: 'idle',
})
                console.log(`Updated status to: watching ${playersOnline}/${playersMax} players`);
            } else {
                // console.error('Unexpected response format:', response.data);
                client.user.setPresence({
  activities: [{ name: `Server's offline`, type: ActivityType.Watching }],
  status: 'online',
})
            }
        } catch (error) {
            // console.error('Error fetching server status:', error);
            client.user.setPresence({
  activities: [{ name: `Server's offline`, type: ActivityType.Watching }],
  status: 'online',
})
        }
    };

    updateStatus();
    setInterval(updateStatus, 60000);  // به‌روزرسانی هر 60 ثانیه
});

client.login(token);