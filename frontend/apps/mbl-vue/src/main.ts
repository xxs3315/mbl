import { createApp } from "vue";

// react-dom >= 19, You only need to configure it globally once
import { createRoot } from "react-dom/client";
import { setVeauryOptions } from "veaury";

import "./style.css";
import App from "./App.vue";

setVeauryOptions({
  react: {
    createRoot,
  },
});

createApp(App).mount("#app");
