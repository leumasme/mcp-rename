const fs = require("fs")
const glob = require("glob")

let fields = Object.fromEntries(fs.readFileSync("./data/fields.csv", "utf8").split("\n").map(e => {
    let [searge, name, side, desc] = e.split(",")
    return [searge, { name, side, desc }]
}))
let methods = Object.fromEntries(fs.readFileSync("./data/methods.csv", "utf8").split("\n").map(e => {
    let [searge, name, side, desc] = e.split(",")
    return [searge, { name, side, desc }]
}))
let params = Object.fromEntries(fs.readFileSync("./data/params.csv", "utf8").split("\n").map(e => {
    let [param, name, side] = e.split(",")
    return [param, { name, side }]
}))

glob("./input/**/*.java", (err, files) => {
    for (let fname of files) {
        
        console.log(`Processing ${fname}`)
        let file = fs.readFileSync(fname, "utf8")
        file = file.replace(/field_[0-9]+_[a-zA-Z]+/g, (s) => fields[s].name)
        file = file.replace(/func_[0-9]+_[a-zA-Z]+/g, (s) => methods[s].name)
        file = file.replace(/p_i?[0-9]+_[0-9]+_/g, (s) => params[s].name)
        console.log(`Processed ${fname}`)

        // remove ./input/ from start
        fname = fname.replace("./input/", "")

        // remove file name from end
        let directory = fname.substring(0, fname.lastIndexOf("/"))

        // Ensure output directory exists
        fs.mkdirSync(`./output/${directory}`,  { recursive: true })

        fs.writeFileSync(`./output/${fname}`, file)
    }
})