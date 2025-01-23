// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'http://172.31.1.80:8081/:path*', // Replace with backend URL
        },
      ];
    },
  };
  

