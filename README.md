## [WebDriver](https://www.w3.org/TR/webdriver/) Client for [Deno](https://deno.land/)

Compatible with spec-compliant backends like
[_GeckoDriver_](https://github.com/mozilla/geckodriver/),
[_ChromeDriver_](https://sites.google.com/a/chromium.org/chromedriver/),
[_SafariDriver_](https://developer.apple.com/documentation/webkit/testing_with_webdriver_in_safari)
etc.

```javascript
import { Driver } from "./driver.js";

const driver = new Driver("http://127.0.0.1:4444/");

await driver.startSession();
await driver.execute("return 1 + 1"); // { value: 2 }
await driver.navigate("https://github.com/");
```

```shell
deno run --allow-net example/basic.js
```
