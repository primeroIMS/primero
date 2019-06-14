module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-flexbugs-fixes"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009"
      },
      preserve: true,
      features: {
        "nesting-rules": true
      },
      stage: 0
    })
  ]
};
