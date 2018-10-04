"use strict";
const cheerio = require("cheerio"),
    PQueue = require("p-queue"),
    Promise = require("bluebird"),
    getImageSize = require("image-size"),
    got = require("got");

class SizeAttributeToImg {
    constructor(options) {
        this.options = {};
        Object.assign(
            this.options, {
                htmlParserOptions: {
                    decodeEntities: false
                },
                queueOptions: {
                    concurrency: 1
                }
            },
            options
        );
    }

    add(html) {
        const $ = cheerio.load(html, this.options.htmlParserOptions),
            hasBody = html.indexOf("<body>") > -1,
            self = this;
        const queue = [];
        $("img")
            .each((index, img) => {
                queue.push(() => {
                    const $img = $(img);
                    return self
                        .getSize($img)
                        .then(sizes => {
                            $img.attr("width", sizes[0]);
                            $img.attr("height", sizes[1]);
                            return $img;
                        });
                });
            });
        return (new PQueue(this.options.queueOptions))
            .addAll(queue)
            .then(() => {
                return !hasBody ? $("body")
                    .html() : $.html();
            });
    }

    getSize($img) {
        return this.getImageBuffer($img)
            .then(buffer => {
                const sizes = getImageSize(buffer);
                return [sizes.width, sizes.height];
            });
    }

    getImageBuffer($img) {
        const src = $img.attr("src"),
            match = src.match(/data:([^;]+);base64,(.*)/);
        if (match) {
            return Promise.resolve(new Buffer(match[2], "base64"));
        }
        return got(src)
            .then(response => {
                return Buffer.from(response.body, "binary");
            });
    }

}

module.exports = SizeAttributeToImg;
