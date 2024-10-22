const { readFile, writeFile } = require('fs');

const requestHandler = (req, res) => {
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    res.setHeader('Content-Type', 'text/html');

    const url = req.url;
    const method = req.method;

    if (url === '/message' && method === 'GET') {
        readFile('forMessagePage.txt', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Server error');
                return;
            }

            res.write(data);
            return res.end();
        });
    } else if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            writeFile('message.txt', message, (err) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Server error');
                    return;
                }

                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    } else if (url === '/') {
        readFile('forReadWriteMain.txt', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Server error');
                return;
            }

            res.write(data);
            return res.end();
        });
    }
};

module.exports = requestHandler;
