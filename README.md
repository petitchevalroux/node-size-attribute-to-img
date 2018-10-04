# node-size-attribute-to-img
Add width and height attribute to img html tag.

Support base64 Data-URI and https? src attribute
## Usage
```javascript
const SizeAttributeToImg = require("@petitchevalroux/size-attribute-to-img"),
converter = new SizeAttributeToImg();
converter
    .add("<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==\">")
    .then(html=>{
        console.log(html);
    })
```
Output
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==" width="1" height="1">
```
