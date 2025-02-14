// electron.vite.config.mjs
import { resolve } from "path";
import path from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
var __electron_vite_injected_dirname = "D:\\\u5DE5\u4F5C\u8D44\u6599\\autoScriptPlatform\\platform";
var pathSrc = path.resolve(__electron_vite_injected_dirname, "src");
var electron_vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": pathSrc
    }
  },
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: "Icon"
          })
        ],
        dts: path.resolve(pathSrc, "auto-imports.d.ts")
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ["ep"]
          })
        ],
        dts: path.resolve(pathSrc, "components.d.ts")
      }),
      Icons({
        autoInstall: true
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
