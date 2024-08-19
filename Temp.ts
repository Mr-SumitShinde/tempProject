import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";

// Function to return the DOM element where the component will be mounted
export const domElementGetter = () => {
    let el = document.getElementById("layout-workarea");
    if (!el) {
        el = document.createElement("div");
        el.id = "layout-workarea";
        document.body.appendChild(el);
    }
    return el;
};

// Function to create single-spa lifecycle functions
export const createReactLifecycles = (Main) => {
    const reactLifecycles = singleSpaReact({
        renderType: "createRoot",
        React,
        ReactDOM,
        rootComponent: Main,
        domElementGetter,
    });

    return {
        bootstrap: (props) => reactLifecycles.bootstrap(props),
        mount: (props) => reactLifecycles.mount(props),
        unmount: (props) => reactLifecycles.unmount(props),
    };
};