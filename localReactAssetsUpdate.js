/** Update assets path in index.html for local testing */

const fs = require('fs');

const localReactAssetsUpdate = function () {
    fs.readFile(__dirname + '/public/mix-manifest.json', 'utf8', function read(err, data) {
        if (err) throw err;

        let manifestData = JSON.parse(data.toString());
        if (!manifestData) {
            console.error("mix-manifest.json file not found. Can't update index.html assets");
            return;
        }

        fs.readFile(__dirname + '/public/index.html', 'utf8', function read(err, data) {
            if (err) throw err;

            let fileContent = data.toString();

            for (let assetName in manifestData) {
                let ext = assetName.split('.').pop();
                if (!ext) continue;

                let fileName = assetName.slice(0, assetName.length - ext.length - 1);
                let replace = fileName.split('/').join('\\/') + '[.a-z0-9]*\\.' + ext;
                let regExReplace = new RegExp(replace, 'g');
                fileContent = fileContent.replace(regExReplace, manifestData[assetName]);
            }

            fs.writeFile(__dirname + '/public/index.html', fileContent, 'utf8', function (err) {
                if (err) console.log('index.html assets updating error: ' + err);
            });

            console.error('index.html assets updated');
        });
    });
};

module.exports = localReactAssetsUpdate;
