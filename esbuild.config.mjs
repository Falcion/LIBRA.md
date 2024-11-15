
import esbuild from "esbuild";
import { sassPlugin } from 'esbuild-sass-plugin'
import process from "process";
import builtins from "builtin-modules";
import glsl from "esbuild-plugin-glsl";
import nodeExternals from "esbuild-plugin-node-externals";


const banner =
    `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
    banner: {
        js: banner,
    },
    entryPoints: ["./prepare-template.ts"],
    plugins: [
        sassPlugin(),
        glsl({
            minify: true,
        }),
        nodeExternals({
            packagePaths: 'package.json',
            include: [
                './lib/*',
                './mode/*',
                './addon/*',
            ],
        }),
    ],
    bundle: true,
    external: [
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
        ...builtins],
    format: "cjs",
    target: "es6",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    outfile: "./prepare-template.js",
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}