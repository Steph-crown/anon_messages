// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";

import { LiveSocket } from "phoenix_live_view";
import React from "react";
import SendMessages from "./components/SendMessages";
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import UserMessages from "./components/UserMessages";
import mount from "./mount";
import topbar from "../vendor/topbar";

const Hooks = {
  UserMessages: {
    mounted() {
      let messages = [];

      this.pushEvent("get_messages", {}, (response) => {
        messages = response.messages;

        this.unmount = mount(
          this.el.id,
          <UserMessages userId={this.el?.dataset?.userid} messages={messages} />
        );
      });
    },

    destroyed() {
      if (!this.unmount) {
        console.error(`${this.el.id} component is not rendered`);
      } else {
        this.unmount();
      }
    },
  },

  SendMessages: {
    mounted() {
      this.unmount = mount(
        this.el.id,
        <SendMessages
          recipientEmail={this.el?.dataset?.recipientemail}
          recipientId={this.el?.dataset?.recipientid}
          handleSendMessage={(content, recipientId) => {
            this.pushEvent("send_message", {
              content,
              recipient_id: Number(recipientId),
            });
          }}
        />
      );
    },

    destroyed() {
      if (!this.unmount) {
        console.error(`${this.el.id} component is not rendered`);
      } else {
        this.unmount();
      }
    },
  },
};

let csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
let liveSocket = new LiveSocket("/live", Socket, {
  params: { _csrf_token: csrfToken },
  hooks: Hooks,
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;
