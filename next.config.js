// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'http://172.31.1.80:9000/:path*', // Replace with backend URL
        },
        {
          source: '/:path*',
          destination: 'http://172.31.1.80:8080/:path*', // Replace with backend URL
        },
      ];
    }
  };

 //  const nextConfig = {
   //  output: "export",
  // };
  
  //  module.exports = nextConfig;
  

