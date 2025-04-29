// next.config.js
module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  }
  };

 //  const nextConfig = {
   //  output: "export",
  // };
  
  //  module.exports = nextConfig;
  

