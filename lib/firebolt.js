(() => {
  // node_modules/@firebolt-js/sdk/dist/lib/Transport/MockTransport.mjs
  var win = typeof window !== "undefined" ? window : {};
  var listener;
  var mock;
  var pending = [];
  var eventMap = {};
  var callback;
  var testHarness;
  if (win.__firebolt && win.__firebolt.testHarness) {
    testHarness = win.__firebolt.testHarness;
  }
  function send(message) {
    console.debug("Sending message to transport: " + message);
    let json = JSON.parse(message);
    if (Array.isArray(json)) {
      json.forEach((j) => send(JSON.stringify(j)));
      return;
    }
    let [module, method] = json.method.split(".");
    if (testHarness && testHarness.onSend) {
      testHarness.onSend(module, method, json.params, json.id);
    }
    if (method.match(/^on[A-Z]/)) {
      if (json.params.listen) {
        eventMap[json.id] = module.toLowerCase() + "." + method[2].toLowerCase() + method.substr(3);
      } else {
        Object.keys(eventMap).forEach((key) => {
          if (eventMap[key] === module.toLowerCase() + "." + method[2].toLowerCase() + method.substr(3)) {
            delete eventMap[key];
          }
        });
      }
    }
    if (mock) handle(json);
    else pending.push(json);
  }
  function handle(json) {
    let result;
    try {
      result = getResult(json.method, json.params);
    } catch (error) {
      setTimeout(
        () => callback(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32602,
              message: "Invalid params (this is a mock error from the mock transport layer)"
            },
            id: json.id
          })
        )
      );
    }
    setTimeout(
      () => callback(
        JSON.stringify({
          jsonrpc: "2.0",
          result,
          id: json.id
        })
      )
    );
  }
  function receive(_callback) {
    callback = _callback;
    if (testHarness && typeof testHarness.initialize === "function") {
      testHarness.initialize({
        emit: event,
        listen: function(...args) {
          listener(...args);
        }
      });
    }
  }
  function event(module, event2, value) {
    const listener2 = Object.entries(eventMap).find(
      ([k, v]) => v.toLowerCase() === module.toLowerCase() + "." + event2.toLowerCase()
    );
    if (listener2) {
      let message = JSON.stringify({
        jsonrpc: "2.0",
        id: parseInt(listener2[0]),
        result: value
      });
      callback(message);
    }
  }
  function dotGrab(obj = {}, key) {
    const keys = key.split(".");
    let ref = obj;
    for (let i = 0; i < keys.length; i++) {
      ref = (Object.entries(ref).find(
        ([k, v]) => k.toLowerCase() === keys[i].toLowerCase()
      ) || [null, {}])[1];
    }
    return ref;
  }
  function getResult(method, params) {
    let api = dotGrab(mock, method);
    if (method.match(/^[a-zA-Z]+\.on[A-Za-z]+$/)) {
      api = {
        event: method,
        listening: true
      };
    }
    if (typeof api === "function") {
      return params == null ? api() : api(params);
    } else return api;
  }
  function setMockResponses(m) {
    mock = m;
    pending.forEach((json) => handle(json));
    pending.length = 0;
  }
  var MockTransport_default = {
    send,
    receive,
    event
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Prop/Router.mjs
  function Router_default(params, callbackOrValue, contextParameterCount) {
    const numArgs = params ? Object.values(params).length : 0;
    if (numArgs === contextParameterCount && callbackOrValue === void 0) {
      return "getter";
    } else if (numArgs === contextParameterCount && typeof callbackOrValue === "function") {
      return "subscriber";
    } else if (numArgs === 0 && typeof callbackOrValue === "function") {
      return "subscriber";
    } else if (numArgs === contextParameterCount && callbackOrValue !== void 0) {
      return "setter";
    }
    return null;
  }

  // node_modules/@firebolt-js/sdk/dist/lib/Prop/MockProps.mjs
  var mocks = {};
  function mock2(module, method, params, value, contextParameterCount, def) {
    const type = Router_default(params, value, contextParameterCount);
    const hash = contextParameterCount ? "." + Object.keys(params).filter((key2) => key2 !== "value").map((key2) => params[key2]).join(".") : "";
    const key = `${module}.${method}${hash}`;
    if (type === "getter") {
      const value2 = mocks.hasOwnProperty(key) ? mocks[key] : def;
      return value2;
    } else if (type === "subscriber") {
    } else if (type === "setter") {
      mocks[key] = value;
      MockTransport_default.event(module, `${method}Changed`, { value });
      return null;
    }
  }
  var MockProps_default = {
    mock: mock2
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Accessibility/defaults.mjs
  var defaults_default = {
    closedCaptions: {
      enabled: true,
      styles: {
        fontFamily: "monospaced_sanserif",
        fontSize: 1,
        fontColor: "#ffffff",
        fontEdge: "none",
        fontEdgeColor: "#7F7F7F",
        fontOpacity: 100,
        backgroundColor: "#000000",
        backgroundOpacity: 100,
        textAlign: "center",
        textAlignVertical: "middle",
        windowColor: "white",
        windowOpacity: 50
      },
      preferredLanguages: ["eng", "spa"]
    },
    closedCaptionsSettings: function(params) {
      return MockProps_default.mock(
        "Accessibility",
        "closedCaptionsSettings",
        params,
        void 0,
        0,
        {
          enabled: true,
          styles: {
            fontFamily: "monospaced_sanserif",
            fontSize: 1,
            fontColor: "#ffffff",
            fontEdge: "none",
            fontEdgeColor: "#7F7F7F",
            fontOpacity: 100,
            backgroundColor: "#000000",
            backgroundOpacity: 100,
            textAlign: "center",
            textAlignVertical: "middle",
            windowColor: "white",
            windowOpacity: 50
          },
          preferredLanguages: ["eng", "spa"]
        }
      );
    },
    highContrastUI: function(params) {
      return MockProps_default.mock(
        "Accessibility",
        "highContrastUI",
        params,
        void 0,
        0,
        true
      );
    },
    voiceGuidance: { enabled: true, navigationHints: true, rate: 1 },
    voiceGuidanceSettings: function(params) {
      return MockProps_default.mock(
        "Accessibility",
        "voiceGuidanceSettings",
        params,
        void 0,
        0,
        { enabled: true, navigationHints: true, rate: 1 }
      );
    },
    audioDescriptionSettings: function(params) {
      return MockProps_default.mock(
        "Accessibility",
        "audioDescriptionSettings",
        params,
        void 0,
        0,
        { enabled: true }
      );
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Account/defaults.mjs
  var defaults_default2 = {
    id: function(params) {
      return MockProps_default.mock("Account", "id", params, void 0, 0, "123");
    },
    uid: function(params) {
      return MockProps_default.mock(
        "Account",
        "uid",
        params,
        void 0,
        0,
        "ee6723b8-7ab3-462c-8d93-dbf61227998e"
      );
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Advertising/defaults.mjs
  var defaults_default3 = {
    config: {
      adServerUrl: "https://demo.v.fwmrm.net/ad/p/1",
      adServerUrlTemplate: "https://demo.v.fwmrm.net/ad/p/1?flag=+sltp+exvt+slcb+emcr+amcb+aeti&prof=12345:caf_allinone_profile &nw=12345&mode=live&vdur=123&caid=a110523018&asnw=372464&csid=gmott_ios_tablet_watch_live_ESPNU&ssnw=372464&vip=198.205.92.1&resp=vmap1&metr=1031&pvrn=12345&vprn=12345&vcid=1X0Ce7L3xRWlTeNhc7br8Q%3D%3D",
      adNetworkId: "519178",
      adProfileId: "12345:caf_allinone_profile",
      adSiteSectionId: "caf_allinone_profile_section",
      adOptOut: true,
      privacyData: "ew0KICAicGR0IjogImdkcDp2MSIsDQogICJ1c19wcml2YWN5IjogIjEtTi0iLA0KICAibG10IjogIjEiIA0KfQ0K",
      ifaValue: "01234567-89AB-CDEF-GH01-23456789ABCD",
      ifa: "ewogICJ2YWx1ZSI6ICIwMTIzNDU2Ny04OUFCLUNERUYtR0gwMS0yMzQ1Njc4OUFCQ0QiLAogICJpZmFfdHlwZSI6ICJzc3BpZCIsCiAgImxtdCI6ICIwIgp9Cg==",
      appName: "FutureToday",
      appBundleId: "FutureToday.comcast",
      distributorAppId: "1001",
      deviceAdAttributes: "ewogICJib0F0dHJpYnV0ZXNGb3JSZXZTaGFyZUlkIjogIjEyMzQiCn0=",
      coppa: 0,
      authenticationEntity: "60f72475281cfba3852413bd53e957f6"
    },
    policy: function(params) {
      return MockProps_default.mock("Advertising", "policy", params, void 0, 0, {
        skipRestriction: "adsUnwatched",
        limitAdTracking: false
      });
    },
    advertisingId: {
      ifa: "01234567-89AB-CDEF-GH01-23456789ABCD",
      ifa_type: "sspid",
      lmt: "0"
    },
    deviceAttributes: {},
    appBundleId: "app.operator"
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Authentication/defaults.mjs
  var defaults_default4 = {
    token: {
      value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      expires: "2022-04-23T18:25:43.511Z",
      type: "platform"
    },
    device: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    session: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    root: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Capabilities/defaults.mjs
  var defaults_default5 = {
    supported: true,
    available: true,
    permitted: true,
    granted: true,
    info: [
      {
        capability: "xrn:firebolt:capability:device:model",
        supported: true,
        available: true,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true }
      },
      {
        capability: "xrn:firebolt:capability:input:keyboard",
        supported: true,
        available: true,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true }
      },
      {
        capability: "xrn:firebolt:capability:protocol:bluetoothle",
        supported: false,
        available: false,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true },
        details: ["unsupported"]
      },
      {
        capability: "xrn:firebolt:capability:token:device",
        supported: true,
        available: true,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true }
      },
      {
        capability: "xrn:firebolt:capability:token:platform",
        supported: true,
        available: false,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true },
        details: ["unavailable"]
      },
      {
        capability: "xrn:firebolt:capability:protocol:moca",
        supported: true,
        available: false,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true },
        details: ["disabled", "unavailable"]
      },
      {
        capability: "xrn:firebolt:capability:wifi:scan",
        supported: true,
        available: true,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true },
        details: ["unpermitted"]
      },
      {
        capability: "xrn:firebolt:capability:localization:postal-code",
        supported: true,
        available: true,
        use: { permitted: true, granted: null },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true },
        details: ["ungranted"]
      },
      {
        capability: "xrn:firebolt:capability:localization:postal-code",
        supported: true,
        available: true,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true },
        details: ["ungranted"]
      },
      {
        capability: "xrn:firebolt:capability:localization:locality",
        supported: true,
        available: true,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true },
        details: ["grantDenied", "ungranted"]
      }
    ],
    request: [
      {
        capability: "xrn:firebolt:capability:commerce:purchase",
        supported: true,
        available: true,
        use: { permitted: true, granted: true },
        manage: { permitted: true, granted: true },
        provide: { permitted: true, granted: true }
      }
    ]
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Device/defaults.mjs
  var defaults_default6 = {
    id: function(params) {
      return MockProps_default.mock("Device", "id", params, void 0, 0, "123");
    },
    distributor: function(params) {
      return MockProps_default.mock(
        "Device",
        "distributor",
        params,
        void 0,
        0,
        "Company"
      );
    },
    platform: function(params) {
      return MockProps_default.mock("Device", "platform", params, void 0, 0, "WPE");
    },
    uid: function(params) {
      return MockProps_default.mock(
        "Device",
        "uid",
        params,
        void 0,
        0,
        "ee6723b8-7ab3-462c-8d93-dbf61227998e"
      );
    },
    type: function(params) {
      return MockProps_default.mock("Device", "type", params, void 0, 0, "STB");
    },
    model: function(params) {
      return MockProps_default.mock("Device", "model", params, void 0, 0, "xi6");
    },
    sku: function(params) {
      return MockProps_default.mock("Device", "sku", params, void 0, 0, "AX061AEI");
    },
    make: function(params) {
      return MockProps_default.mock("Device", "make", params, void 0, 0, "Arris");
    },
    version: function(params) {
      return MockProps_default.mock("Device", "version", params, void 0, 0, {
        sdk: { major: 0, minor: 8, patch: 0, readable: "Firebolt JS SDK v0.8.0" },
        api: { major: 0, minor: 8, patch: 0, readable: "Firebolt API v0.8.0" },
        firmware: {
          major: 1,
          minor: 2,
          patch: 3,
          readable: "Device Firmware v1.2.3"
        },
        os: { major: 0, minor: 1, patch: 0, readable: "Firebolt OS v0.1.0" },
        debug: "Non-parsable build info for error logging only."
      });
    },
    hdcp: function(params) {
      return MockProps_default.mock("Device", "hdcp", params, void 0, 0, {
        "hdcp1.4": true,
        "hdcp2.2": true
      });
    },
    hdr: function(params) {
      return MockProps_default.mock("Device", "hdr", params, void 0, 0, {
        hdr10: true,
        hdr10Plus: true,
        dolbyVision: true,
        hlg: true
      });
    },
    audio: function(params) {
      return MockProps_default.mock("Device", "audio", params, void 0, 0, {
        stereo: true,
        "dolbyDigital5.1": true,
        "dolbyDigital5.1+": true,
        dolbyAtmos: true
      });
    },
    screenResolution: function(params) {
      return MockProps_default.mock(
        "Device",
        "screenResolution",
        params,
        void 0,
        0,
        [1920, 1080]
      );
    },
    videoResolution: function(params) {
      return MockProps_default.mock(
        "Device",
        "videoResolution",
        params,
        void 0,
        0,
        [1920, 1080]
      );
    },
    name: function(params) {
      return MockProps_default.mock("Device", "name", params, void 0, 0, "Living Room");
    },
    network: function(params) {
      return MockProps_default.mock("Device", "network", params, void 0, 0, {
        state: "connected",
        type: "wifi"
      });
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Discovery/defaults.mjs
  var defaults_default7 = {
    policy: function(params) {
      return MockProps_default.mock("Discovery", "policy", params, void 0, 0, {
        enableRecommendations: true,
        shareWatchHistory: true,
        rememberWatchedPrograms: true
      });
    },
    entityInfo: true,
    purchasedContent: true,
    watched: true,
    watchNext: true,
    entitlements: true,
    contentAccess: null,
    clearContentAccess: null,
    launch: true,
    signIn: true,
    signOut: true,
    userInterest: null,
    userInterestResponse: null,
    userInterestError: null
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Keyboard/defaults.mjs
  var defaults_default8 = {
    email: "user@domain.com",
    password: "abc123",
    standard: "Living Room"
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Lifecycle/defaults.mjs
  var inactive = { state: "inactive", previous: "initializing" };
  var foreground = { state: "foreground", previous: "inactive" };
  var unloading = { state: "unloading", previous: "inactive" };
  var emit = (value) => {
    MockTransport_default.event("Lifecycle", value.state, value);
  };
  var win2 = typeof window !== "undefined" ? window : {};
  var automation = win2.__firebolt ? !!win2.__firebolt.automation : false;
  var defaults_default9 = {
    ready: function() {
      inactive.previous = "initializing";
      setTimeout(() => emit(inactive), automation ? 1 : 500);
      foreground.previous = "inactive";
      setTimeout(() => emit(foreground), automation ? 2 : 1e3);
    },
    close: function(params) {
      let reason = params.reason;
      if (reason === "remoteButton") {
        inactive.previous = "foreground";
        setTimeout(() => emit(inactive), automation ? 1 : 500);
      } else if (["userExit", "error"].includes(reason)) {
        inactive.previous = "foreground";
        unloading.previous = "inactive";
        setTimeout(() => emit(inactive), automation ? 1 : 500);
        setTimeout(() => emit(unloading), automation ? 2 : 1e3);
      } else {
        throw "Invalid close reason";
      }
    },
    finished: function() {
      if (win2.location) win2.location.href = "about:blank";
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Localization/defaults.mjs
  var defaults_default10 = {
    locality: function(params) {
      return MockProps_default.mock(
        "Localization",
        "locality",
        params,
        void 0,
        0,
        "Philadelphia"
      );
    },
    postalCode: function(params) {
      return MockProps_default.mock(
        "Localization",
        "postalCode",
        params,
        void 0,
        0,
        "19103"
      );
    },
    countryCode: function(params) {
      return MockProps_default.mock(
        "Localization",
        "countryCode",
        params,
        void 0,
        0,
        "US"
      );
    },
    language: function(params) {
      return MockProps_default.mock(
        "Localization",
        "language",
        params,
        void 0,
        0,
        "en"
      );
    },
    preferredAudioLanguages: function(params) {
      return MockProps_default.mock(
        "Localization",
        "preferredAudioLanguages",
        params,
        void 0,
        0,
        ["spa", "eng"]
      );
    },
    locale: function(params) {
      return MockProps_default.mock(
        "Localization",
        "locale",
        params,
        void 0,
        0,
        "en-US"
      );
    },
    latlon: [39.9549, 75.1699],
    additionalInfo: {}
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Metrics/defaults.mjs
  var defaults_default11 = {
    ready: true,
    signIn: true,
    signOut: true,
    startContent: true,
    stopContent: true,
    page: true,
    action: true,
    error: true,
    mediaLoadStart: true,
    mediaPlay: true,
    mediaPlaying: true,
    mediaPause: true,
    mediaWaiting: true,
    mediaProgress: true,
    mediaSeeking: true,
    mediaSeeked: true,
    mediaRateChange: true,
    mediaRenditionChange: true,
    mediaEnded: true,
    appInfo: null
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Parameters/defaults.mjs
  var defaults_default12 = {
    initialization: {
      lmt: 0,
      us_privacy: "1-Y-",
      discovery: {
        navigateTo: {
          action: "entity",
          data: { entityId: "abc", entityType: "program", programType: "movie" },
          context: { source: "voice" }
        }
      }
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Profile/defaults.mjs
  var defaults_default13 = {
    approveContentRating: false,
    approvePurchase: false,
    flags: { userExperience: "1000" }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/SecondScreen/defaults.mjs
  var defaults_default14 = {
    protocols: { "dial1.7": true },
    device: "device-id",
    friendlyName: function(params) {
      return MockProps_default.mock(
        "SecondScreen",
        "friendlyName",
        params,
        void 0,
        0,
        "Living Room"
      );
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/SecureStorage/defaults.mjs
  var defaults_default15 = {
    get: "VGhpcyBub3QgYSByZWFsIHRva2VuLgo=",
    set: null,
    remove: null,
    clear: null
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Platform/defaults.mjs
  var defaults_default16 = {
    localization: defaults_default10,
    device: defaults_default6,
    accessibility: defaults_default
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Transport/queue.mjs
  var Queue = class {
    constructor() {
      this._callback = null;
      this._queue = [];
    }
    send(json) {
      this._queue.push(json);
    }
    receive(_callback) {
      this._callback = _callback;
    }
    flush(transport) {
      transport.receive(this._callback);
      this._queue.forEach((item) => transport.send(item));
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Settings/index.mjs
  var settings = {};
  var subscribers = {};
  var initSettings = (appSettings, platformSettings) => {
    settings["app"] = appSettings;
    settings["platform"] = {
      logLevel: "WARN",
      ...platformSettings
    };
    settings["user"] = {};
  };
  var publish = (key, value) => {
    subscribers[key] && subscribers[key].forEach((subscriber) => subscriber(value));
  };
  var dotGrab2 = (obj = {}, key) => {
    const keys = key.split(".");
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]] = obj[keys[i]] !== void 0 ? obj[keys[i]] : {};
    }
    return typeof obj === "object" ? Object.keys(obj).length ? obj : void 0 : obj;
  };
  var Settings_default = {
    get(type, key, fallback = void 0) {
      const val = dotGrab2(settings[type], key);
      return val !== void 0 ? val : fallback;
    },
    has(type, key) {
      return !!this.get(type, key);
    },
    set(key, value) {
      settings["user"][key] = value;
      publish(key, value);
    },
    subscribe(key, callback2) {
      subscribers[key] = subscribers[key] || [];
      subscribers[key].push(callback2);
    },
    unsubscribe(key, callback2) {
      if (callback2) {
        const index = subscribers[key] && subscribers[key].findIndex((cb) => cb === callback2);
        index > -1 && subscribers[key].splice(index, 1);
      } else {
        if (key in subscribers) {
          subscribers[key] = [];
        }
      }
    },
    clearSubscribers() {
      for (const key of Object.getOwnPropertyNames(subscribers)) {
        delete subscribers[key];
      }
    },
    setLogLevel(logLevel) {
      settings.platform.logLevel = logLevel;
    },
    getLogLevel() {
      return settings.platform.logLevel;
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Transport/LegacyTransport.mjs
  var win3 = typeof window !== "undefined" ? window : {};
  var LegacyTransport = class _LegacyTransport {
    constructor(bridge) {
      this.bridge = bridge;
    }
    send(msg) {
      this.bridge.JSMessageChanged(msg, () => {
      });
    }
    receive(callback2) {
      win3.$badger = win3.$badger || {};
      const badgerCallback = win3.$badger.callback ? win3.$badger.callback.bind(win3.$badger) : null;
      const badgerEvent = win3.$badger.event ? win3.$badger.event.bind(win3.$badger) : null;
      win3.$badger.callback = (pid, success, json) => {
        if (json.jsonrpc) {
          callback2(JSON.stringify(json));
        } else if (badgerCallback) {
          badgerCallback(pid, success, json);
        }
      };
      win3.$badger.event = (handlerId, json) => {
        if (json.jsonrpc) {
          callback2(JSON.stringify(json));
        } else if (badgerEvent) {
          badgerEvent(handlerId, json);
        }
      };
    }
    static isLegacy(transport) {
      return _LegacyTransport.isXREProxy(transport) || transport.send === void 0 && transport.JSMessageChanged;
    }
    static isXREProxy(transport) {
      return transport.proxyObjectTest !== void 0;
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Transport/WebsocketTransport.mjs
  var MAX_QUEUED_MESSAGES = 100;
  var WebsocketTransport = class {
    constructor(endpoint) {
      this._endpoint = endpoint;
      this._ws = null;
      this._connected = false;
      this._queue = [];
      this._callbacks = [];
    }
    send(msg) {
      this._connect();
      if (this._connected) {
        this._ws.send(msg);
      } else {
        if (this._queue.length < MAX_QUEUED_MESSAGES) {
          this._queue.push(msg);
        }
      }
    }
    receive(callback2) {
      if (!callback2) return;
      this._connect();
      this._callbacks.push(callback2);
    }
    _notifyCallbacks(message) {
      for (let i = 0; i < this._callbacks.length; i++) {
        setTimeout(() => this._callbacks[i](message), 1);
      }
    }
    _connect() {
      if (this._ws) return;
      this._ws = new WebSocket(this._endpoint, ["jsonrpc"]);
      this._ws.addEventListener("message", (message) => {
        this._notifyCallbacks(message.data);
      });
      this._ws.addEventListener("error", (message) => {
      });
      this._ws.addEventListener("close", (message) => {
        this._ws = null;
        this._connected = false;
      });
      this._ws.addEventListener("open", (message) => {
        this._connected = true;
        for (let i = 0; i < this._queue.length; i++) {
          this._ws.send(this._queue[i]);
        }
        this._queue = [];
      });
    }
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Results/index.mjs
  function transform(result, transforms) {
    if (!transforms || !transforms.methods) {
      return result;
    }
    const { methods } = transforms;
    const transformed = JSON.parse(JSON.stringify(result));
    Object.keys(methods).forEach((key) => {
      const method_info = methods[key];
      const rpc_method = method_info["x-method"];
      const [module, method] = rpc_method.split(".");
      const params = {};
      params[method_info["x-this-param"]] = transformed;
      transformed[key] = (...args) => {
        for (var i = 0; i < args.length; i++) {
          params[method_info["x-additional-params"][i]] = args[i];
        }
        return Transport.send(module.toLowerCase(), method, params);
      };
    });
    return transformed;
  }
  var Results_default = {
    transform
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Transport/index.mjs
  var LEGACY_TRANSPORT_SERVICE_NAME = "com.comcast.BridgeObject_1";
  var moduleInstance = null;
  var isEventSuccess = (x) => x && typeof x.event === "string" && typeof x.listening === "boolean";
  var win4 = typeof window !== "undefined" ? window : {};
  var Transport = class _Transport {
    constructor() {
      this._promises = [];
      this._transport = null;
      this._id = 1;
      this._eventEmitters = [];
      this._eventIds = [];
      this._queue = new Queue();
      this._deprecated = {};
      this.isMock = false;
    }
    static addEventEmitter(emitter) {
      _Transport.get()._eventEmitters.push(emitter);
    }
    static registerDeprecatedMethod(module, method, alternative) {
      _Transport.get()._deprecated[module.toLowerCase() + "." + method.toLowerCase()] = {
        alternative: alternative || ""
      };
    }
    _endpoint() {
      if (win4.__firebolt && win4.__firebolt.endpoint) {
        return win4.__firebolt.endpoint;
      }
      return null;
    }
    constructTransportLayer() {
      let transport;
      const endpoint = this._endpoint();
      if (endpoint && (endpoint.startsWith("ws://") || endpoint.startsWith("wss://"))) {
        transport = new WebsocketTransport(endpoint);
        transport.receive(this.receiveHandler.bind(this));
      } else if (typeof win4.ServiceManager !== "undefined" && win4.ServiceManager && win4.ServiceManager.version) {
        transport = this._queue;
        win4.ServiceManager.getServiceForJavaScript(
          LEGACY_TRANSPORT_SERVICE_NAME,
          (service) => {
            if (LegacyTransport.isLegacy(service)) {
              transport = new LegacyTransport(service);
            } else {
              transport = service;
            }
            this.setTransportLayer(transport);
          }
        );
      } else {
        this.isMock = true;
        transport = MockTransport_default;
        transport.receive(this.receiveHandler.bind(this));
      }
      return transport;
    }
    setTransportLayer(tl) {
      this._transport = tl;
      this._queue.flush(tl);
    }
    static send(module, method, params, transforms) {
      return _Transport.get()._send(module, method, params, transforms);
    }
    static listen(module, method, params, transforms) {
      return _Transport.get()._sendAndGetId(module, method, params, transforms);
    }
    _send(module, method, params, transforms) {
      if (Array.isArray(module) && !method && !params) {
        return this._batch(module);
      } else {
        return this._sendAndGetId(module, method, params, transforms).promise;
      }
    }
    _sendAndGetId(module, method, params, transforms) {
      const { promise, json, id } = this._processRequest(
        module,
        method,
        params,
        transforms
      );
      const msg = JSON.stringify(json);
      if (Settings_default.getLogLevel() === "DEBUG") {
        console.debug("Sending message to transport: " + msg);
      }
      this._transport.send(msg);
      return { id, promise };
    }
    _batch(requests) {
      const results = [];
      const json = [];
      requests.forEach(({ module, method, params, transforms }) => {
        const result = this._processRequest(module, method, params, transforms);
        results.push({
          promise: result.promise,
          id: result.id
        });
        json.push(result.json);
      });
      const msg = JSON.stringify(json);
      if (Settings_default.getLogLevel() === "DEBUG") {
        console.debug("Sending message to transport: " + msg);
      }
      this._transport.send(msg);
      return results;
    }
    _processRequest(module, method, params, transforms) {
      const p = this._addPromiseToQueue(module, method, params, transforms);
      const json = this._createRequestJSON(module, method, params);
      const result = {
        promise: p,
        json,
        id: this._id
      };
      this._id++;
      return result;
    }
    _createRequestJSON(module, method, params) {
      return {
        jsonrpc: "2.0",
        method: module.toLowerCase() + "." + method,
        params,
        id: this._id
      };
    }
    _addPromiseToQueue(module, method, params, transforms) {
      return new Promise((resolve, reject) => {
        this._promises[this._id] = {};
        this._promises[this._id].promise = this;
        this._promises[this._id].resolve = resolve;
        this._promises[this._id].reject = reject;
        this._promises[this._id].transforms = transforms;
        const deprecated = this._deprecated[module.toLowerCase() + "." + method.toLowerCase()];
        if (deprecated) {
          console.warn(
            `WARNING: ${module}.${method}() is deprecated. ` + deprecated.alternative
          );
        }
        if (method.match(/^on[A-Z]/)) {
          if (params.listen) {
            this._eventIds.push(this._id);
          } else {
            this._eventIds = this._eventIds.filter((id) => id !== this._id);
          }
        }
      });
    }
    /**
     * If we have a global transport, use that. Otherwise, use the module-scoped transport instance.
     * @returns {Transport}
     */
    static get() {
      win4.__firebolt = win4.__firebolt || {};
      if (win4.__firebolt.transport == null && moduleInstance == null) {
        const transport = new _Transport();
        transport.init();
        if (transport.isMock) {
          moduleInstance = transport;
        } else {
          win4.__firebolt = win4.__firebolt || {};
          win4.__firebolt.transport = transport;
        }
        win4.__firebolt.setTransportLayer = transport.setTransportLayer.bind(transport);
      }
      return win4.__firebolt.transport ? win4.__firebolt.transport : moduleInstance;
    }
    receiveHandler(message) {
      if (Settings_default.getLogLevel() === "DEBUG") {
        console.debug("Received message from transport: " + message);
      }
      const json = JSON.parse(message);
      const p = this._promises[json.id];
      if (p) {
        if (json.error) p.reject(json.error);
        else {
          let result = json.result;
          if (p.transforms) {
            if (Array.isArray(json.result)) {
              result = result.map((x) => Results_default.transform(x, p.transforms));
            } else {
              result = Results_default.transform(result, p.transforms);
            }
          }
          p.resolve(result);
        }
        delete this._promises[json.id];
      }
      if (this._eventIds.includes(json.id) && !isEventSuccess(json.result)) {
        this._eventEmitters.forEach((emit2) => {
          emit2(json.id, json.result);
        });
      }
    }
    init() {
      initSettings({}, { log: true });
      this._queue.receive(this.receiveHandler.bind(this));
      if (win4.__firebolt) {
        if (win4.__firebolt.mockTransportLayer === true) {
          this.isMock = true;
          this.setTransportLayer(MockTransport_default);
        } else if (win4.__firebolt.getTransportLayer) {
          this.setTransportLayer(win4.__firebolt.getTransportLayer());
        }
      }
      if (this._transport == null) {
        this._transport = this.constructTransportLayer();
      }
    }
  };
  win4.__firebolt = win4.__firebolt || {};
  win4.__firebolt.setTransportLayer = (transport) => {
    Transport.get().setTransportLayer(transport);
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Events/index.mjs
  var validEvents = {};
  var validContext = {};
  var registerEvents = (module, events) => {
    validEvents[module.toLowerCase()] = events.concat();
  };
  var registerEventContext = (module, event2, context) => {
    validContext[module.toLowerCase()] = validContext[module.toLowerCase()] || {};
    validContext[module.toLowerCase()][event2] = context.concat();
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Accessibility/index.mjs
  registerEvents("Accessibility", [
    "audioDescriptionSettingsChanged",
    "closedCaptionsSettingsChanged",
    "highContrastUIChanged",
    "voiceGuidanceSettingsChanged"
  ]);
  Transport.registerDeprecatedMethod(
    "Accessibility",
    "closedCaptions",
    "Use Accessibility.closedCaptionsSettings() instead."
  );
  Transport.registerDeprecatedMethod(
    "Accessibility",
    "voiceGuidance",
    "Use Accessibility.voiceGuidanceSettings() instead."
  );

  // node_modules/@firebolt-js/sdk/dist/lib/Advertising/index.mjs
  registerEvents("Advertising", ["policyChanged"]);

  // node_modules/@firebolt-js/sdk/dist/lib/Authentication/index.mjs
  Transport.registerDeprecatedMethod(
    "Authentication",
    "token",
    "Use Authentication module has individual methods for each token type. instead."
  );

  // node_modules/@firebolt-js/sdk/dist/lib/Capabilities/index.mjs
  registerEvents("Capabilities", [
    "available",
    "granted",
    "revoked",
    "unavailable"
  ]);
  registerEventContext("Capabilities", "available", ["capability"]);
  registerEventContext("Capabilities", "granted", ["role", "capability"]);
  registerEventContext("Capabilities", "revoked", ["role", "capability"]);
  registerEventContext("Capabilities", "unavailable", ["capability"]);

  // node_modules/@firebolt-js/sdk/dist/lib/Device/index.mjs
  registerEvents("Device", [
    "audioChanged",
    "deviceNameChanged",
    "hdcpChanged",
    "hdrChanged",
    "nameChanged",
    "networkChanged",
    "screenResolutionChanged",
    "videoResolutionChanged"
  ]);
  Transport.registerDeprecatedMethod(
    "Device",
    "screenResolution",
    "Use Use non-Firebolt APIs specific to your platform, e.g. W3C APIs instead."
  );
  Transport.registerDeprecatedMethod(
    "Device",
    "onDeviceNameChanged",
    "Use Device.name() instead."
  );
  Transport.registerDeprecatedMethod(
    "Device",
    "onScreenResolutionChanged",
    "Use screenResolution instead."
  );

  // node_modules/@firebolt-js/sdk/dist/lib/ProvideManager/index.mjs
  var providerInterfaces = {};
  var registerProviderInterface = (capability, module, methods) => {
    if (providerInterfaces[capability]) {
      throw `Capability ${capability} has multiple provider interfaces registered.`;
    }
    methods.forEach((m) => m.name = `${module}.${m.name}`);
    providerInterfaces[capability] = methods.concat();
  };

  // node_modules/@firebolt-js/sdk/dist/lib/Discovery/index.mjs
  registerEvents("Discovery", ["navigateTo", "policyChanged"]);
  registerProviderInterface(
    "xrn:firebolt:capability:discovery:interest",
    "Discovery",
    [{ name: "userInterest", focus: false, response: true, parameters: true }]
  );
  Transport.registerDeprecatedMethod(
    "Discovery",
    "entityInfo",
    "Use null instead."
  );
  Transport.registerDeprecatedMethod(
    "Discovery",
    "purchasedContent",
    "Use null instead."
  );
  Transport.registerDeprecatedMethod(
    "Discovery",
    "entitlements",
    "Use Discovery.contentAccess() instead."
  );
  Transport.registerDeprecatedMethod(
    "Discovery",
    "onPullEntityInfo",
    "Use null instead."
  );
  Transport.registerDeprecatedMethod(
    "Discovery",
    "onPullPurchasedContent",
    "Use null instead."
  );

  // node_modules/@firebolt-js/sdk/dist/lib/Lifecycle/index.mjs
  registerEvents("Lifecycle", [
    "background",
    "foreground",
    "inactive",
    "suspended",
    "unloading"
  ]);

  // node_modules/@firebolt-js/sdk/dist/lib/Localization/index.mjs
  registerEvents("Localization", [
    "countryCodeChanged",
    "languageChanged",
    "localeChanged",
    "localityChanged",
    "postalCodeChanged",
    "preferredAudioLanguagesChanged"
  ]);
  Transport.registerDeprecatedMethod(
    "Localization",
    "language",
    "Use Localization.locale instead."
  );
  Transport.registerDeprecatedMethod(
    "Localization",
    "onLanguageChanged",
    "Use language instead."
  );

  // node_modules/@firebolt-js/sdk/dist/lib/SecondScreen/index.mjs
  registerEvents("SecondScreen", [
    "closeRequest",
    "friendlyNameChanged",
    "launchRequest"
  ]);

  // node_modules/@firebolt-js/sdk/dist/lib/firebolt.mjs
  setMockResponses({
    Accessibility: defaults_default,
    Account: defaults_default2,
    Advertising: defaults_default3,
    Authentication: defaults_default4,
    Capabilities: defaults_default5,
    Device: defaults_default6,
    Discovery: defaults_default7,
    Keyboard: defaults_default8,
    Lifecycle: defaults_default9,
    Localization: defaults_default10,
    Metrics: defaults_default11,
    Parameters: defaults_default12,
    Profile: defaults_default13,
    SecondScreen: defaults_default14,
    SecureStorage: defaults_default15,
    Platform: defaults_default16
  });
})();
