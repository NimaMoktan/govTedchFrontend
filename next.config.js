// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'http://172.30.3.182:9000/:path*', // Replace with backend URL
        }
      ];
    }
  };

  // const nextConfig = {
  //   output: "export",
  // };
  
  // module.exports = nextConfig;
  

