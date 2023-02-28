/**
 * @AutoVersions
 * @version v1.2.0.1
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

const fs = require('fs');

let nodePath = process.argv[0];

let filePath = process.argv[2];

let updateVersion = function () {
    fs.readFile(filePath, 'utf8', function read(err, data) {
        if (err) throw err;

        //console.log(data); // содержание файла
        let fileContent = data.toString();
        if (!fileContent) return;
        let fileLines = fileContent.split('\n');

        let matcher = /(@\s?version\s?)(\d+\.\d+\.\d+\.\d+)/i;
        for (let i = 0; i < fileLines.length; i++) {
            if (i > 10) break;

            let curLine = fileLines[i];
            let matched = curLine.match(matcher);
            if (!matched || typeof matched[1] === 'undefined') continue;

            let version = matched[2];
            let partsStr = version.split('.', 4);
            let parts = [];
            parts[0] = +partsStr[0];
            parts[1] = +partsStr[1];
            parts[2] = +partsStr[2];
            parts[3] = +partsStr[3];

            parts[3]++;
            if (parts[3] > 100) {
                parts[3] = 0;
                parts[2]++;

                if (parts[2] > 100) {
                    parts[2] = 0;
                    parts[1]++;
                }
            }

            let nextVersion = parts.join('.');

            fileLines[i] = curLine.replace(matcher, '$1' + nextVersion);

            let updatedContent = fileLines.join('\n');
            fs.writeFile(filePath, updatedContent, 'utf8', function (err) {
                if (err) console.log(err);
            });
            break;
        }
    });
};

if (filePath) {
    fs.exists(filePath, function (exists) {
        //проверка есть ли файл
        if (!exists) return;
        updateVersion();
    });
}
