// tslint:disable:ordered-imports

// allows the discovery of dependencies from the node_modules directory
import resolve from '@rollup/plugin-node-resolve'

// allows the usage of commonjs modules with es2016 modules
import commonjs from '@rollup/plugin-commonjs'

// allows replacing strings in the codebase
import replace from '@rollup/plugin-replace'

// support for typescript
import typescript from '@rollup/plugin-typescript'

// minifies the output to the dist folder
import { terser } from 'rollup-plugin-terser'

// support for html and css
import html from 'rollup-plugin-generate-html-template'
import css from 'rollup-plugin-import-css'

// allows clearing the output directory
import clear from 'rollup-plugin-clear'

// dev tools
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

// to automatically convert .grammar files to javascript object files
import { lezer } from '@lezer/generator/rollup'

// allows to copy files
import copy from 'rollup-plugin-copy'

const isDevelopment = !!process.env.ROLLUP_WATCH
const isProduction = !isDevelopment

const environment = isDevelopment ? 'development' : 'production'

console.log(`Building for ${environment} environment.`)

let plugins = [
  clear({
    targets: ['dist'],
    watch: false
  }),
  //preferBuiltins: use local node packages over browserspecific global ones
  resolve({ preferBuiltins: false }),
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(environment),
    preventAssignment: true
  }),
  typescript(),
  css({
    output: 'index.css',
    minify: isProduction
  }),
  html({
    template: 'src/index.html',
    target: 'index.html'
  }),
  lezer(),
  copy({
    targets: [
      {
        src: './node_modules/fork-awesome/fonts',
        dest: 'dist/'
      }
    ]
  })
]

if (isProduction) {
  plugins = [...plugins, terser()]
}

if (isDevelopment) {
  plugins = [
    ...plugins,
    serve({
      open: true,
      openPage: '/',
      contentBase: 'dist'
    }),
    livereload({
      watch: 'dist'
    })
  ]
}

export default {
  input: 'src/main.tsx',
  output: {
    dir: 'dist',
    format: 'iife', // build output as single executable javascript function
    sourcemap: isDevelopment ? 'inline' : false
  },
  plugins
}
