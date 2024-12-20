require('dotenv').config();

const lti = require('ltijs').Provider;
const axios = require('axios');
const cors = require('cors');
const path = require('path');


// Setup provider
lti.setup(process.env.LTI_KEY,
  {
    url: process.env.MONGO_URL,
    connection: { 
      user: process.env.MONGO_USER, 
      pass: process.env.MONGO_PASSWORD 
    }
  },
  {
    appRoute: '/launch',
    loginRoute: '/login',
    cookies: {
      secure: true,
      sameSite: 'None'
    },
    devMode: false,
    dynRegRoute: '/register',
    dynReg: {
      url: process.env.TOOL_URL,
      name: process.env.TOOL_NAME,
      description: process.env.TOOL_DESCRIPTION,
      redirectUris: [],
      autoActivate: true
    }
  }
);

// Middleware & EJS setup
lti.app.set('view engine', 'ejs');
lti.app.set('views', path.join(__dirname, 'views'));
lti.app.use(cors({ credentials: true }));

// Controle in Database of de specifieke LMS omgeving al geregistreerd is
async function isPlatformRegistered(platformUrl) {
  const platform = await lti.getPlatform(platformUrl);
  console.log(`Platform status: ${platform ? 'Found' : 'Not found'}`);
  return !!platform; // Return true als LMS omgeving al is greregistreerd
}

lti.onDynamicRegistration(async (req, res) => {
  try {
    console.log('\n=== Registration Request ===');
    console.log('Full URL:', req.url);

    // Decode openid_configuration om registrationToken eruit te halen
    const openidConfigUrl = decodeURIComponent(req.query.openid_configuration);
    const registrationToken = new URL(openidConfigUrl).searchParams.get('token');

    if (!registrationToken) {
      throw new Error('Missing registration token');
    }

    // Haal OpenID configuratie op om platformUrl eruit te halen
    console.log('Fetching OpenID Configuration...');
    const openidConfig = await axios.get(openidConfigUrl);
    const platformUrl = openidConfig.data.issuer;

    const platformExists = await isPlatformRegistered(platformUrl);

    if (platformExists) {
      console.log('Platform is already registered:', platformUrl);
      res.render('register-duplicate', {
        status: 'already_registered',
        message: 'This platform is already registered.',
        details: { platformUrl }
      });
      return;
    }

    // Registreer nieuw platform
    console.log('Registering new platform...');
    const message = await lti.DynamicRegistration.register(
      req.query.openid_configuration,
      registrationToken
    );

    console.log('Registration successful:', message);

    res.render('register-success', {
      status: 'success',
      message: 'Platform registered successfully.',
      details: { platformUrl }
    });

  } catch (error) {
    console.error('Registration error:', error.message);

    res.render('register-error', {
      status: 'error',
      message: error.message
    });
  }
});

// LTI Launch Handler
// lti.onConnect(async (token, req, res) => {
//   console.log('LTI Launch received');
//   const frontendUrl = `https://eduface.nl`;
//   return res.redirect(frontendUrl);
// });

lti.onConnect(async (token, req, res) => {
  console.log('LTI Launch received');
  
  res.send(`
    <html>
      <body>
        <h1>LTI Launch Succesvol</h1>
        <p><strong>Token:</strong></p>
        <pre>${JSON.stringify(token, null, 2)}</pre>
      </body>
    </html>
  `);
});

// Start de server
lti.deploy(process.env.PORT);
