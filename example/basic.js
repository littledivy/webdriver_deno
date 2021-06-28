import { Driver } from "../driver.js";

const driver = new Driver("http://localhost:4444/");
await driver.startSession();

console.log(await driver.execute("return 1 + 1"));
