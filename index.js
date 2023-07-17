"use strict";

// Dependencies
const stringSimilarity = require("string-similarity")
const fs = require("fs")

// Variables
const args = process.argv.slice(2)

var dataSets = {
    xss: JSON.parse(fs.readFileSync("./datasets/xss.json", "utf8")),
    sql: JSON.parse(fs.readFileSync("./datasets/sql.json", "utf8")),
    nosql: JSON.parse(fs.readFileSync("./datasets/nosql.json", "utf8")),
    xxe: JSON.parse(fs.readFileSync("./datasets/xxe.json", "utf8")),
    crlf: JSON.parse(fs.readFileSync("./datasets/crlf.json", "utf8")),
    traversal: JSON.parse(fs.readFileSync("./datasets/traversal.json", "utf8")),
    fileInclusion: JSON.parse(fs.readFileSync("./datasets/file-inclusion.json", "utf8")),
    xpath: JSON.parse(fs.readFileSync("./datasets/xpath.json", "utf8")),
    others: JSON.parse(fs.readFileSync("./datasets/others.json", "utf8"))
}

var result = {
    xss: {
        detected: false,
        rating: 0
    },
    sql: {
        detected: false,
        rating: 0
    },
    nosql: {
        detected: false,
        rating: 0
    },
    xxe: {
        detected: false,
        rating: 0
    },
    crlf: {
        detected: false,
        rating: 0
    },
    traversal: {
        detected: false,
        rating: 0
    },
    fileInclusion: {
        detected: false,
        rating: 0
    },
    xpath: {
        detected: false,
        rating: 0
    },
    others: {
        detected: false,
        rating: 0
    }
}

// Functions
function detections(string){
    const xss = stringSimilarity.findBestMatch(string, dataSets.xss)
    const sql = stringSimilarity.findBestMatch(string, dataSets.sql)
    const nosql = stringSimilarity.findBestMatch(string, dataSets.nosql)
    const xxe = stringSimilarity.findBestMatch(string, dataSets.xxe)
    const crlf = stringSimilarity.findBestMatch(string, dataSets.crlf)
    const traversal = stringSimilarity.findBestMatch(string, dataSets.traversal)
    const fileInclusion = stringSimilarity.findBestMatch(string, dataSets.fileInclusion)
    const xpath = stringSimilarity.findBestMatch(string, dataSets.xpath)
    const others = stringSimilarity.findBestMatch(string, dataSets.others)

    return {
        xss: xss.bestMatch,
        sql: sql.bestMatch,
        nosql: nosql.bestMatch,
        xxe: xxe.bestMatch,
        crlf: crlf.bestMatch,
        traversal: traversal.bestMatch,
        fileInclusion: fileInclusion.bestMatch,
        xpath: xpath.bestMatch,
        others: others.bestMatch
    }
}

function detect(string){
    try{
        const detectionsResult = detections(string)
    
        result.xss.rating = detectionsResult.xss.rating
        result.sql.rating = detectionsResult.sql.rating
        result.nosql.rating = detectionsResult.nosql.rating
        result.xxe.rating = detectionsResult.xxe.rating
        result.crlf.rating = detectionsResult.crlf.rating
        result.traversal.rating = detectionsResult.traversal.rating
        result.fileInclusion.rating = detectionsResult.fileInclusion.rating
        result.xpath.rating = detectionsResult.xpath.rating
        result.others.rating = detectionsResult.others.rating

        if(result.xss.rating > 0.3) result.xss.detected = true
        if(result.sql.rating > 0.2) result.sql.detected = true
        if(result.nosql.rating > 0.2) result.nosql.detected = true
        if(result.xxe.rating > 0.2) result.xxe.detected = true
        if(result.crlf.rating > 0.2) result.crlf.detected = true
        if(result.traversal.rating > 0.2) result.traversal.detected = true
        if(result.fileInclusion.rating > 0.2) result.fileInclusion.detected = true
        if(result.xpath.rating > 0.2) result.xpath.detected = true
        if(result.others.rating > 0.2) result.others.detected = true

        return result
    }catch(err){
        return err
    }
}

// Main
if(!args.length) return console.log("Usage: node index.js <link>")

console.log(detect(args[0]))