import imaps = require("imap-simple");
// import parse = require("../components/parser");
const Gmail = async (userdata: {
    ahost: string;
    email: string;
    pass: string;
}) => {
    const config = {
        imap: {
            user: `${userdata.email}`,
            // tslint:disable-next-line:object-literal-sort-keys
            password: `${userdata.pass}`,
            host: userdata.ahost,
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            },
            authTimeout: 60000
        }
    };
    const searchCriteria = [`UNSEEN`];
    const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: false };

    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");
    const results = await connection.search(searchCriteria, fetchOptions);
    const BodyTexts = results.map(res =>
        res.parts.filter(part => part.which === "TEXT")
    );
    const target = JSON.stringify(BodyTexts)
        .replace(/=\\r\\n/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\r\\n/g, "")
        .replace(/\=3D/g, "=");
    // const readyLink = await parse.parse(target, parseFirstPart, parseSecondPart);
    return target;
};

const data = {
    ahost: "imap.rambler.ru",
    email: "elsenoucey@rambler.ru",
    pass: "bhRbNet6yujh"
};

Gmail(data).then(trg => {
    console.log(trg);
});
