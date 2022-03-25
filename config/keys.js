module.exports = {
    app: {
      name: 'Meditation Mitra',
      apiURL: `${process.env.BASE_API_URL}`,
      serverURL: process.env.BASE_SERVER_URL,
      clientURL: process.env.BASE_CLIENT_URL
    },
    port: process.env.PORT || 3000,
    database: {
      url: process.env.MONGODB_URI
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      tokenLife: '7d'
    }
  };
  
