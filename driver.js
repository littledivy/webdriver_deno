// Copyright (c) 2020 Divy Srivastava

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software
// is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function _fromSession(proto, action) {
  return new URL(`/session/${proto.session?.sessionId}/${action}`, proto.url);
}

const spec = [
  // https://www.w3.org/TR/webdriver/#new-session
  {
    name: "startSession",
    action: "",
    url: function (proto) {
      return new URL("/session", proto.url);
    },
    method: "POST",
    body: {
      capabilities: {
        alwaysMatch: {
          // Tell Chrome's webdriver to follow W3C spec
          "goog:chromeOptions": {
            w3c: true,
          },
        },
      },
    },
    dispose: async function (proto, response) {
      const session = await response.json();
      proto.session = session.value;
    },
  },

  // https://www.w3.org/TR/webdriver/#navigate-to
  {
    name: "navigate",
    action: "url",
    url: _fromSession,
    method: "POST",
    body: function (url) {
      return { url };
    },
  },

  // https://www.w3.org/TR/webdriver/#execute-script
  {
    name: "execute",
    action: "execute/sync",
    url: _fromSession,
    method: "POST",
    body: function (script, ...args) {
      return { script, args };
    },
  },
];

function mixinDriver(proto) {
  const mixin = {};
  for (const method of spec) {
    mixin[method.name] = {
      value: async function (...args) {
        const body = (typeof method.body == "function")
          ? method.body(...args)
          : method.body;
        const response = await fetch(method.url(this, method.action), {
          method: method.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (typeof method.dispose == "function") {
          await method.dispose(this, response);
        } else {
          return response.json();
        }
      },
    };
  }
  Object.defineProperties(proto.prototype, mixin);
}

export class Driver {
  url;
  session;

  constructor(url) {
    this.url = url;
  }

  get browser() {
    return this.session?.capabilities["browserName"];
  }
}

mixinDriver(Driver);
