"use strict";
const path = require("path"),
    SizeAttributeToImg = require(path.join(__dirname, "..")),
    assert = require("assert"),
    cheerio = require("cheerio"),
    nock = require("nock");

describe("constructor", () => {
    const instance = new SizeAttributeToImg();
    it("constructor may be called without options", (done) => {
        assert(instance instanceof SizeAttributeToImg);
        done();
    });

    it("add width and height on base64 image", () => {
        return instance.add(
            "<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==\">"
        )
            .then(html => {
                const
                    $ = cheerio.load(html),
                    img = $("img")
                        .first();
                assert.equal(img.attr("width"), 1);
                assert.equal(img.attr("height"), 1);
                return html;
            });
    });


    it("add width and height on url image", () => {
        nock("http://example.com")
            .get("/foo.png")
            .replyWithFile(200, path.join(__dirname,
                "sample.png"), {
                "Content-Type": "image/png"
            });
        return instance
            .add(
                "<img src=\"http://example.com/foo.png\">"
            )
            .then(html => {
                const
                    $ = cheerio.load(html),
                    img = $("img")
                        .first();
                assert.equal(img.attr("width"), 15);
                assert.equal(img.attr("height"), 21);
                return html;
            });
    });
});
