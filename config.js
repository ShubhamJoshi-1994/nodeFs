/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `.env.${activeEnv}`,
});

module.exports = {
  siteMetadata: {
    title: `ABC`,
    description: `PQR`,
    author: `PQE`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [],
        workboxConfig: {
          globPatterns: ["**/*"],
          skipWaiting: true,
          cacheId: "cache_version-36-app_version-1", 
          dontCacheBustURLsMatching: /.*/,
        },
        appendScript: require.resolve(`./src/custom-sw.js`),
      },
    },
  ],
};
