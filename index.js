import express from "express"
import path from "path"
import fs from "fs"

const app = express();
const dirname = path.dirname(new URL(import.meta.url).pathname);

app.use('/src', express.static('src'));
app.use('/public', express.static('public'));
app.use('/modules', express.static('modules'));

app.get('/*', (req, res) => {
    const filePath = path.resolve(dirname, 'public', "index.html");
    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server error');
        return;
    }
    res.sendFile(filePath);
});

const port = process.env.npm_config_port || 8001;
app.listen(port, () => {
    console.log(`server started at port ${port}`);
});