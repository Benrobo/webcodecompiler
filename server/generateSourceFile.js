const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid")


const genSourceFile = (code, extension) => {
    // check if temp folder is available
    // cause that were all java files would be created 

    const dir = path.join(__dirname, "/temp")

    if (!fs.existsSync(dir)) {
        // if it doesnt create one
        fs.mkdirSync(dir)
    }
    // generate random id
    // const fileName = `${uuid().replace("-", "").slice(0, 10)}.${extension}`
    const fileName = `Main.${extension}`
    const fileDir = path.join(dir, fileName)
    // const url = new (fileDir)

    // write data to the newly created file
    fs.writeFile(fileDir, code, (err, data) => {
        if (err) {
            throw new Error(err);
        }

        return fileDir
    })

    return { fileDir, fileName }
}

module.exports = genSourceFile