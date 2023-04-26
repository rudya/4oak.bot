const {
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const ytdl2 = require('youtube-dl-exec');
const fs = require('fs')

module.exports = class Player {
    constructor() {
        this.connection = null;
        this.audioPlayer = null;
        this.subscription = null;
    }
    destroy() {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
        if(this.connection) {
            this.connection.destroy();
        }
    }
    joinVoiceChannel(channel) {
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        this.connection.on('stateChange', (oldState, newState) => {
            console.log(oldState.status, newState.status)
            const oldNetworking = Reflect.get(oldState, 'networking');
            const newNetworking = Reflect.get(newState, 'networking');

            const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
                const newUdp = Reflect.get(newNetworkState, 'udp');
                clearInterval(newUdp?.keepAliveInterval);
            }

            oldNetworking?.off('stateChange', networkStateChangeHandler);
            newNetworking?.on('stateChange', networkStateChangeHandler);
        })
    }
    pause(state){
        if(state === 'on') {
            this.audioPlayer?.pause();
        } else {
            this.audioPlayer?.unpause();
        }
        console.log('player class: pause ' + state);
    }
    play(input, channel){
        if(!channel) {
            console.log('join a voice channel!');
            return;
        }
        if(!this.connection) {
            this.joinVoiceChannel(channel);
        }
        if(!this.audioPlayer) {
            this.audioPlayer = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            this.connection.subscribe(this.audioPlayer);
            this.audioPlayer.on('error', error => {
                console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
            });
            this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
                console.log('The audio player has started playing!');
            });
            this.audioPlayer.on(AudioPlayerStatus.Buffering, () => {
                console.log('The audio player has started buffering!');
            });
            this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
                console.log('The audio player has started idle!');
            });
            this.audioPlayer.on(AudioPlayerStatus.Paused, () => {
                console.log('The audio player has started puased!');
            });
            this.audioPlayer.on(AudioPlayerStatus.Autopaused, () => {
                console.log('The audio player has started autopuased!');
            });
        }

        const stream = ytdl(input, {
            filter: "audioonly",
            highWaterMark: 1<<62,
            liveBuffer: 1 << 62,
            bitrate: 128,
            dlChunkSize: 0,
        }).on('info', (info) => {
            console.log('playing ' + info.player_response.videoDetails.title);
        })
        const resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
        });
        this.audioPlayer.play(resource);
    }
}