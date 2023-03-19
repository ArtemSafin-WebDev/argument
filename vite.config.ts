import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import globalContext from "./pages-data/globalContext";
import path from "path";
import glob from "glob";
import pagesConfig from "./pages.config";

export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      input: glob.sync(path.resolve(__dirname, "*.html")),
    },
  },
  server: {
    host: true,
  },
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/icons")],
      symbolId: "[name]",
    }),
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
      context(pagePath) {
        return {
          ...globalContext,
          ...pagesConfig[pagePath],
        };
      },
    }),
  ],
};
