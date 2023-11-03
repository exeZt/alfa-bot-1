const defaultPath = `${__dirname}/storage/`, // Относительный путь к хранилищу
Key = "6622325045:AAGvsTESM1g0b0DRbkXt5Wg42R7foGsizHE", // ключ telegram
telegramSettings = {
    parse_mode: "HTML" // Markdown || MarkdownV2 || HTML
},
NetworkDataId = {
    table_data: "1hVpfy4j9G35SGKNaSq8iO9PVz63DSAJlPUfOY7y8UxM", // ID листа с данными
    table_auth: "1XUd9d4_YWI5SjY2z40TtAlUgDRe9KbAkHKCuPMwgUzI" // ID листа с доступом
},
PathData = {
    path_to_local: `${defaultPath}localData/`, // Относительный путь к данным
    path_to_auth: `${defaultPath}auth/`, // Относительный путь к данным с доступом
    path_to_logs: `${defaultPath}logs/`, // Относительный путь к логам
    path_to_files: `${defaultPath}files/`, // Относительный путь к файлам
},
AuthLists = {
    path_to_admins: `${PathData.path_to_auth}admins_users_data.json`,
    path_to_members: `${PathData.path_to_auth}users_data.json`,
    path_to_members_s: `${PathData.path_to_auth}users_data_s.json`,
    path_to_banned: `${PathData.path_to_auth}banned_users_data.json`
},
HelpList = [
    "/cls : очистка консоли",
    "/ref : команда обновления (листы доступа, листы рендера)",
    "/logrender : отправляет файл рендера(все данные используемые в данный момент)",
    "/getlog : отправляет сегодняшний файл лога",
    "/getbanlist : отправляет сообщением/файлом лист забанненых людей",
    "/getmemberslist : отправляет сообщением/файлом лист пользователей",
    "/getadminslist : отправляет сообщением/файлом лист админов",
    "/getfileslist : отправляет список файлов (презентации к продуктам и т.п.)",
    "/test : команда для теста отдельной функции"
];

module.exports = {
    NetworkDataId,
    PathData,
    HelpList,
    AuthLists,
    Key,
    telegramSettings,
};