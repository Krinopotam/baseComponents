/** Generate assets manifest for php */

const fs = require('fs');

const makePhpAssetsManifest = function () {
    fs.readFile(__dirname + '/public/mix-manifest.json', 'utf8', function read(err, data) {
        if (err) throw err;

        let manifestData = JSON.parse(data.toString());
        if (!manifestData) {
            console.error("mix-manifest.json file not found. Can't generate php assets manifest");
            return;
        }

        let text = '<?php \n    return [\n';
        for (let key in manifestData) {
            if (!manifestData.hasOwnProperty(key)) continue;
            text += '        "' + key + '"=>"' + manifestData[key] + '",\n';
        }
        text += '    ];';

        fs.writeFile(__dirname + '/app/mix-manifest.php', text, 'utf8', function (err) {
            if (err) console.error('Error writing mix-manifest.php!', err);
        });

        console.log('Php assets manifest generated');
    });
};

module.exports = makePhpAssetsManifest;
