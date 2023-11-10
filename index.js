const TelegramBot = require('node-telegram-bot-api'),
    fs = require("fs"),
    { Key, telegramSettings, PathData} = require("./lib/config"),
    SecuritySystem = require('./lib/security'),
    DataHandler = require("./lib/datahander"),
    Admin = require('./lib/admin')
    client = new TelegramBot(Key, {
        polling: true,
})

global.XMLHttpRequest = require('xhr2');
SecuritySystem.getUdata();

setInterval(() => SecuritySystem.getDataAuth_user(), 30000)

client.on('message', async function (msg) {
    console.log(msg)
    if (!msg.text || msg.text.startsWith('/')){
        if (msg.text === '/logrender') {
            await client.sendDocument(msg.chat.id.toString(), DataHandler.getRenderLog(msg.from.username, msg.from.id, msg.message_id, getDate()))
        } else if (msg.text === '/getbanlist') {
            /** works */
            SecuritySystem.isAdmin(msg.from.username, async function (result) {
                if (result === true)
                    try {
                        await client.sendMessage(msg.chat.id, Admin._getbanlist().content.toString())
                    } catch (e) {
                        try {
                            await client.sendDocument(msg.chat.id, Admin._getbanlist().path)
                        } catch (e) {
                            await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении файла')
                        }
                    }
            })
        } else if (msg.text === '/getmemberslist') {
            SecuritySystem.isAdmin(msg.from.username, async function (result) {
                if (result === true)
                    try {
                        await client.sendMessage(msg.chat.id, Admin._getmemberslist().content.toString())
                    } catch (e) {
                        try {
                            await client.sendDocument(msg.chat.id, Admin._getmemberslist().path)
                        } catch (e) {
                            await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении файла')
                        }
                    }
            })
        } else if (msg.text === '/getlog') {
            /** works */
            SecuritySystem.isAdmin(msg.from.username, async function (result) {
                if (result === true)
                    try {
                        let date = new Date()
                        await client.sendDocument(msg.chat.id, `${PathData.path_to_logs}/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.txt`);
                    } catch (e) {
                        await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении файла')
                    }
            })
        } else if (msg.text === '/getadminslist') {
            /** works */
            SecuritySystem.isAdmin(msg.from.username, async function (result) {
                if (result === true)
                    try {
                        await client.sendMessage(msg.chat.id, Admin._getadminlist().content.toString())
                    } catch (e) {
                        try {
                            await client.sendDocument(msg.chat.id, Admin._getadminlist().path)
                        } catch (e) {
                            await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении файла')
                        }
                    }
            })
        } else if (msg.text === '/getfileslist') {
            /** works */
            SecuritySystem.isAdmin(msg.from.username, async function (result) {
                if (result === true)
                    try {
                        await client.sendMessage(msg.chat.id, Admin._getfilelist().content.toString())
                    } catch (e) {
                        await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении данных')
                    }
            })
        } else if (msg.text === '/help') {
            await client.sendMessage(msg.chat.id, Admin._help())
        } else if (msg.text === '/cls') {
            SecuritySystem.isAdmin(msg.from.username, function (result) {
                if (result === true)
                    console.clear();
            })
        } else if (msg.text === '/ref') {
            await SecuritySystem.isAdmin(msg.from.username, async function (result) {
                if (result === true) {
                    await Admin._refresh_data();
                    await client.sendMessage(msg.chat.id, 'Информация обновлена');
                }
            })
        } else if (msg.text === '/shutdown') {
            await SecuritySystem.isAdmin(msg.from.username, async function (result) {
                if (result === true)
                    process.exit();
            })
        }
        else if (msg.text === '/start'){
            await DataHandler.responseRenderer('/start', async function (d) {
                if (isKeyBoard(await d)) {
                    client.sendMessage(msg.chat.id, msg.text, await d)
                        .then(() => client.deleteMessage(msg.chat.id, msg.message_id))
                        .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                }
            })
        }
    } else {
        try {
            SecuritySystem.isAdmin(msg.from.username, async function (result) { /** works */
                if (result === true){
                    try {
                        await client.sendMessage(msg.chat.id, ` \`${msg.video.file_id}\` ID видео, для вставки в поле с видео`);
                    } catch (e) {
                    }
                }
                try {
                    let filepath = `./lib/storage/files/${msg.document.file_name}`;
                    fs.writeFile(filepath, '-', {}, function () {
                    })
                    let fileWriter = fs.createWriteStream(filepath);
                    const getReadStreamPromise = () => {
                        return new Promise((resolve, reject) => {
                            const stream = client.getFileStream(msg.document.file_id);
                            stream.on('data', (chunk) => {
                                fileWriter.write(chunk);
                            })
                            stream.on('error', (err) => {
                                reject(err);
                            })
                            stream.on('end', () => {
                                client.sendMessage(msg.chat.id, `Файл успешно сохранен, имя файла: ${msg.document.file_name}`)
                                resolve();
                            })
                        })
                    }
                    await getReadStreamPromise();
                } catch (e) {
                }
            })
            SecuritySystem.isBanned(msg.from.username, async function (result) {
                if (result === true) {
                    /** works */
                    try{
                        console.trace(`USER ${msg.from.username} is banned, history will be cleared`)
                        await client.sendMessage(msg.chat.id, `_banned ${msg.from.username}`)
                        setTimeout(async () => {
                            let k = 0;
                            for (let i = 0; i <= 200; i++) {
                                try {
                                    k = msg.message_id - i
                                    await client.deleteMessage(msg.chat.id, k)
                                } catch (e) {
                                }
                            }
                        }, 2000)
                    }catch (e) {

                    }
                } else {
                    try {
                        JSON.parse(SecuritySystem.getDataAuth_user())
                        for (const u of JSON.parse(SecuritySystem.getDataAuth_user())) {
                            if (msg.from.username === u) {
                                /** works */
                                await DataHandler.logger(
                                    msg.from,
                                    msg.from.username,
                                    msg.text,
                                    !0
                                )
                                console.log(true)
                                await DataHandler.responseRenderer(msg.text, async function (d) {
                                    if (isKeyBoard(await d)) {
                                        try {
                                            client.sendMessage(msg.chat.id, msg.text, await d)
                                                .then(() => client.deleteMessage(msg.chat.id, msg.message_id))
                                                .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                                        }catch (e) {

                                        }
                                    } else {
                                        try {
                                            if (await d.split('').length > 4090){
                                                let a = d.split(' ');
                                                const midIndex = Math.floor(a.length / 2);
                                                const firstPart = a.slice(0, midIndex).join(' ');
                                                const secondPart = a.slice(midIndex).join(' ');
                                                try {
                                                    try {
                                                        await client.sendMessage(msg.chat.id, firstPart, {
                                                            parse_mode: telegramSettings.parse_mode,
                                                        }).then(async () => await client.sendMessage(msg.chat.id, secondPart, {
                                                            parse_mode: telegramSettings.parse_mode,
                                                        }))
                                                    }catch (e) {
                                                        await client.sendMessage(msg.chat.id, firstPart)
                                                            .then(async () => await client.sendMessage(msg.chat.id, secondPart))
                                                    }
                                                }catch (e) {
                                                    console.log(e)
                                                    await client.sendMessage(msg.chat.id, 'Wow, looks like your message contains more than 8200 symbols!\n you need to cut it', {
                                                        parse_mode: telegramSettings.parse_mode,
                                                    })
                                                }
                                            }else {
                                                try {
                                                    await client.sendMessage(msg.chat.id, await d, {
                                                        parse_mode: telegramSettings.parse_mode,
                                                    })
                                                }catch (e) {
                                                    await client.sendMessage(msg.chat.id, await d)
                                                }
                                            }
                                        }catch (e) {
                                            await client.sendMessage(msg.chat.id, await d)
                                        }
                                        try {
                                            await DataHandler.callMediaFromRenderer(msg.text, async function (res) {
                                                try {
                                                    if (Array.isArray(res)) {
                                                        for (const el of res) {
                                                            try {
                                                                await client.sendVideo(msg.chat.id, el.trim(), {
                                                                    reply_to_message_id: msg.from.message_id
                                                                });
                                                            } catch (e) {
                                                                await client.sendVideo(msg.chat.id, el, {
                                                                    reply_to_message_id: msg.from.message_id
                                                                });
                                                            }
                                                        }
                                                    } else {
                                                        await client.sendVideo(msg.chat.id, res??res[0], {
                                                            reply_to_message_id: msg.from.message_id
                                                        });
                                                    }
                                                } catch (e) {

                                                }
                                            })
                                        } catch (e) {
                                        }
                                        try {
                                            await DataHandler.callFileFromRenderer(msg.text, async function (res) {
                                                try {
                                                    if (Array.isArray(res)) {
                                                        for (const el of res) {
                                                            try {
                                                                await client.sendDocument(msg.chat.id, `${PathData.path_to_files}${el.trim()}`)
                                                            } catch (e) {
                                                                await client.sendDocument(msg.chat.id, `${PathData.path_to_files}${el}`)
                                                            }
                                                        }
                                                    } else {
                                                        await client.sendDocument(msg.chat.id, res??res[0])
                                                    }
                                                } catch (e) {
                                                }
                                            })
                                        } catch (e) {

                                        }
                                    }
                                })
                                break;
                            }
                        }
                    } catch (e) {
                    }
                }
            })
        }
        catch (e) {

        }
    }
})

function isKeyBoard (raw) { /** works */
    try {
        if (raw !== 'Promise { <pending> }'){
            JSON.stringify(raw).toString()
            if (JSON.stringify(raw).startsWith('{'))
                return true
            else
                return false
        }
    }catch (e) {
        return false
    }
}

function getDate() {
    let a = new Date();
    return `date: ${a.getFullYear()}|${a.getMonth()}|${a.getDay()} time: ${a.getHours()}:${a.getMinutes()}:${a.getSeconds()}`;
}