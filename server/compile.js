const express = require("express")
const { exec } = require('child_process');
const fs = require("fs");
const path = require("path");
const app = express();

const genSourceFile = require("./generateSourceFile")

// get java compiler
const dir = path.join(__dirname, "executable")
const getCompiler = () => {
    return new Promise((res, rej) => {
        fs.readdir(dir, (err, data) => {
            err && rej(err)
            res({ java: data[0], javac: data[1] })
        })
    })
}

const compileJavaCode = async (code, ext, cb) => {
    let { fileDir, fileName } = genSourceFile(code, ext);

    let { java, javac } = await getCompiler()
    let command = `cd ${path.join(__dirname, "temp")} & ${java} ${fileName}`

    // execute the command
    let output = {};
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output["errorMsg"] = `${err}`;
            output["filename"] = fileName;
            return cb(output)
        }
        else if (stderr) {
            output["stderr"] = `${stderr}`;
            output["filepath"] = fileDir;
            return cb(output)
        }
        else {
            output["output"] = stdout;
            output["filename"] = fileName;
            output["filepath"] = fileDir;
            cb(output)
        }
    })
}


const compileJavaCodeWithInput = async (code, ext, input, cb) => {
    let { fileDir, fileName } = genSourceFile(code, ext);
    let { java, javac } = await getCompiler()

    // If an input is passed, create a new input.txt file
    // this would be where the user input would recide
    // which would then be compiled later on

    let dir = path.join(__dirname, "/temp");
    let inputFilePath = `${dir}/input.txt`

    // create the file and store the data within it
    fs.writeFile(inputFilePath, input, (err, result) => {
        if (err) {
            throw Error("Error creating input file")
        }

        // else if everything went well
        // compile the java file along with the input.txt

        // execute the command
        // cd ${path.join(__dirname, "temp")} & ${javac} ${fileName} && 

        let command = `cd ${dir} && ${java} Main < input.txt`
        let output = {};

        exec(command, (err, stdout, stderr) => {
            console.log(stdout)
            if (err) {
                output["errorMsg"] = `${err}`;
                output["filename"] = fileName;
                return cb(output)
            }
            else if (stderr) {
                output["stderr"] = `${stderr}`;
                output["filepath"] = fileDir;
                return cb(output)
            }
            else {
                output["output"] = stdout;
                output["filename"] = fileName;
                output["filepath"] = fileDir;
                cb(output)
            }
        })

    })
}

module.exports = {
    compileJavaCode,
    compileJavaCodeWithInput
}