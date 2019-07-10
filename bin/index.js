(function () {
    var defines = {};
    var entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies: dependencies, factory: factory };
        entry[0] = name;
    }
    define("require", ["exports"], function (exports) {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: function (name) { return resolve(name); } });
    });
    define("client", ["require", "exports", "tslib"], function (require, exports, tslib_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var API_URL = 'https://maps.googleapis.com/maps/api/js';
        var CALLBACK_NAME = '__googleMapsApiOnLoadCallback';
        var api;
        function getGoogleMapsAPI() {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (!api)
                        throw new Error('Please call loadGoogleMapsAPI on app initializaion');
                    return [2 /*return*/, api];
                });
            });
        }
        exports.getGoogleMapsAPI = getGoogleMapsAPI;
        function loadGoogleMapsAPI(options) {
            if (api)
                throw new Error('Please call loadGoogleMapsAPI just once');
            var wnd = window;
            api = new Promise(function (resolve, reject) {
                var tm = setTimeout(function () {
                    wnd[CALLBACK_NAME] = function () { return 0; };
                    reject(new Error('Could not load the Google Maps API'));
                }, 10000);
                wnd[CALLBACK_NAME] = function () {
                    clearTimeout(tm);
                    resolve(wnd.google.maps);
                    delete wnd[CALLBACK_NAME];
                };
                var scriptElement = document.createElement('script');
                var params = ["callback=" + CALLBACK_NAME];
                Object.entries(options).forEach(function (_a) {
                    var optionName = _a[0], optionValue = _a[1];
                    if (options.libraries && optionName === 'libraries')
                        params.push("libraries=" + options.libraries.join(','));
                    else
                        params.push(optionName + '=' + optionValue);
                });
                scriptElement.src = API_URL + '?' + params.join('&');
                document.body.appendChild(scriptElement);
            });
            return api;
        }
        exports.loadGoogleMapsAPI = loadGoogleMapsAPI;
    });
    define("useGoogleMap", ["require", "exports", "tslib", "react", "client"], function (require, exports, tslib_2, react_1, client_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var eventsMapping = {
            onCenterChanged: ['center_changed', function (map) { return [map.getCenter()]; }],
            onBoundsChanged: ['bounds_changed', function (map) { return [map.getBounds()]; }],
            onZoomChanged: ['zoom_changed', function (map) { return [map.getZoom()]; }],
            onTiltChanged: ['tilt_changed', function (map) { return [map.getTilt()]; }],
            onTalesLoaded: ['tilesloaded', function (map) { return []; }],
            onClick: ['click', function (map, args) { return [args[0].latLng]; }]
            // TODO: https://developers.google.com/maps/documentation/javascript/events
        };
        function useGoogleMap(options) {
            var _a = react_1.useState({ loading: true, api: null, map: null }), mapState = _a[0], setMapState = _a[1];
            var center = options.center;
            var mapRef = react_1.useRef(null);
            react_1.useEffect(function () {
                // tslint:disable-next-line: no-floating-promises
                client_1.getGoogleMapsAPI().then(function (api) {
                    var untypedEvents = options.untypedEvents, events = options.events;
                    delete options.untypedEvents;
                    delete options.events;
                    var map = new google.maps.Map(mapRef.current, options);
                    if (events) {
                        Object.keys(events).forEach(function (eventName) {
                            var mapping = eventsMapping[eventName];
                            var handler = events[eventName];
                            map.addListener(mapping[0], function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                var mappedArgs = mapping[1](map, args);
                                handler.apply(map, mappedArgs);
                            });
                        });
                    }
                    if (untypedEvents) {
                        Object.entries(untypedEvents).forEach(function (_a) {
                            var eventName = _a[0], handler = _a[1];
                            return map.addListener(eventName, handler);
                        });
                    }
                    setMapState({ api: api, map: map, loading: false });
                });
            }, []);
            react_1.useEffect(function () {
                mapState.map && center && mapState.map.panTo(center);
            }, [center && center.lat, center && center.lng]);
            return tslib_2.__assign({ mapRef: mapRef }, mapState);
        }
        exports.default = useGoogleMap;
    });
    define("useGoogleMapMarker", ["require", "exports", "tslib", "react"], function (require, exports, tslib_3, react_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var eventsMapping = {
            onClick: ['click', function (marker) { return [marker]; }],
            onDoubleClick: ['dblclick', function (marker) { return [marker]; }]
        };
        function useGoogleMapMarker(opts) {
            var map = opts.map, api = opts.api, untypedEvents = opts.untypedEvents, events = opts.events, options = tslib_3.__rest(opts, ["map", "api", "untypedEvents", "events"]);
            var _a = react_2.useState(), marker = _a[0], setMarker = _a[1];
            react_2.useEffect(function () {
                var marker = new google.maps.Marker(options);
                if (events) {
                    Object.keys(events).forEach(function (eventName) {
                        var mapping = eventsMapping[eventName];
                        var handler = events[eventName];
                        map.addListener(mapping[0], function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            var mappedArgs = mapping[1](marker, args);
                            handler.apply(map, mappedArgs);
                        });
                    });
                }
                if (untypedEvents) {
                    Object.entries(untypedEvents).forEach(function (_a) {
                        var eventName = _a[0], handler = _a[1];
                        return map.addListener(eventName, handler);
                    });
                }
                setMarker(marker);
            }, []);
            react_2.useEffect(function () {
                marker && options.animation && marker.setAnimation(options.animation);
            }, [options.animation]);
            react_2.useEffect(function () {
                marker && options.cursor && marker.setCursor(options.cursor);
            }, [options.cursor]);
            react_2.useEffect(function () {
                marker && options.icon && marker.setIcon(options.icon);
            }, [options.icon]);
            react_2.useEffect(function () {
                marker && options.label && marker.setLabel(options.label);
            }, [options.label]);
            react_2.useEffect(function () {
                marker && options.opacity && marker.setOpacity(options.opacity);
            }, [options.opacity]);
            react_2.useEffect(function () {
                marker && options.position && marker.setPosition(options.position);
            }, [options.position]);
            react_2.useEffect(function () {
                marker && options.shape && marker.setShape(options.shape);
            }, [options.shape]);
            react_2.useEffect(function () {
                marker && options.title && marker.setTitle(options.title);
            }, [options.title]);
            react_2.useEffect(function () {
                marker && options.visible && marker.setVisible(options.visible);
            }, [options.visible]);
            return marker;
        }
        exports.default = useGoogleMapMarker;
    });
    define("map", ["require", "exports", "tslib", "react", "useGoogleMap"], function (require, exports, tslib_4, react_3, useGoogleMap_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        react_3 = tslib_4.__importDefault(react_3);
        useGoogleMap_1 = tslib_4.__importDefault(useGoogleMap_1);
        exports.Map = function (opts) {
            var children = opts.children, options = tslib_4.__rest(opts, ["children"]);
            var _a = useGoogleMap_1.default(options), api = _a.api, map = _a.map, mapRef = _a.mapRef, loading = _a.loading;
            return (react_3.default.createElement("div", { className: 'map-container' },
                react_3.default.createElement("div", { ref: mapRef, className: 'map-ref' }),
                !loading &&
                    api ?
                    react_3.default.Children.map(children, function (child) {
                        return react_3.default.cloneElement(child, { map: map, api: api });
                    }) : 'Error loading Google Maps API'));
        };
    });
    define("marker", ["require", "exports", "tslib", "useGoogleMapMarker"], function (require, exports, tslib_5, useGoogleMapMarker_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        useGoogleMapMarker_1 = tslib_5.__importDefault(useGoogleMapMarker_1);
        exports.Marker = function (opts) {
            useGoogleMapMarker_1.default(opts);
            return null;
        };
    });
    define("transitLayer", ["require", "exports", "react"], function (require, exports, react_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function TransitLayer(props) {
            var _a = react_4.useState(), transitLayer = _a[0], setTransitLayer = _a[1];
            var _b = props, api = _b.api, map = _b.map, enabled = _b.enabled;
            react_4.useEffect(function () {
                setTransitLayer(new api.TransitLayer());
            }, []);
            react_4.useEffect(function () {
                if (transitLayer) {
                    enabled ? transitLayer.setMap(map) : transitLayer.setMap(null);
                }
            }, [enabled]);
            return null;
        }
        exports.TransitLayer = TransitLayer;
    });
    define("index", ["require", "exports", "tslib", "client", "useGoogleMap", "useGoogleMapMarker", "map", "marker", "transitLayer", "tslib"], function (require, exports, tslib_6, client_2, useGoogleMap_2, useGoogleMapMarker_2, map_1, marker_1, transitLayer_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_6.__exportStar(client_2, exports);
        tslib_6.__exportStar(useGoogleMap_2, exports);
        tslib_6.__exportStar(useGoogleMapMarker_2, exports);
        tslib_6.__exportStar(map_1, exports);
        tslib_6.__exportStar(marker_1, exports);
        tslib_6.__exportStar(transitLayer_1, exports);
    });
    //# sourceMappingURL=index.js.map
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            var dependencies = ['exports'];
            var factory = function (exports) {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies: dependencies, factory: factory };
        }
    }
    var instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        var define = get_define(name);
        instances[name] = {};
        var dependencies = define.dependencies.map(function (name) { return resolve(name); });
        define.factory.apply(define, dependencies);
        var exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve("src/index.ts");
    }
})();