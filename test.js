import fs from "fs";

fs.readdir("./build/font", (err, files) => {
    files.forEach(file => {
        // console.log(`"/font/${file}",`);
    });
});

fs.readdir("./build/images", (err, files) => {
    files.forEach(file => {
        // console.log(`"/images/${file}",`);
    });
});