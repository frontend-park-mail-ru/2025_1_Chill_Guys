import express from "express"
import path from "path"
import fs from "fs"

const app = express();
const dirname = path.dirname(new URL(import.meta.url).pathname);

app.use('/src', express.static('src'));

app.use('/public',express.static('public'));

app.get('/', (req, res) => {
    const filePath = path.resolve(dirname, 'public', "index.html");
    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server error');
        return;
    }
    res.sendFile(filePath);
});

app.listen(8001, () => {
    console.log("server start");
});