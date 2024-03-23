const allowedOrigins = [
    "https://whiteadmin.elaunchinfotech.in",
    // "http://white.elaunchinfotech.in",
    "http://194.233.85.136:4000",
    "http://194.233.85.136:4001",
    "http://localhost:3000",
    "http://localhost:3002",
    "https://whitetail-tactical.com",
    "https://satyam-nbq5.vercel.app"
];

const corsOptions = {
    //origin:'*',
    origin: (origin:any, callback:Function) => {
        // console.log(allowedOrigins.indexOf(origin),origin);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // console.log('iiii');
            callback(null, true)
        } else {
            // console.log('not cors');
            callback(new Error('Not allowed by CORS'));
            
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions;