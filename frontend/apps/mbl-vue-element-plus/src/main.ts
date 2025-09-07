import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

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

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
