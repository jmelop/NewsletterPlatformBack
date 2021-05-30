//TODO: forzar saltos de linea, por que fs2 en el generator

const nodemailer = require("nodemailer");
let fs = require("fs");
const emailGenerator = require("./emailGenerator.ts");
const cron = require("node-cron");
const axios = require("axios");
require("dotenv").config();
let users = [];
let news = [];

const options = {
    headers: {
        Authorization: process.env.authToken,
    },
};

function getData() {
    users = [];
    news = [];
    axios
        .all([
            axios.get(process.env.apiUrl + "users", options),
            axios.get(process.env.apiUrl + "news", options),
        ])
        .then(
            axios.spread((usersResponse, newsResponse) => {
                users = usersResponse.data;
                news = newsResponse.data;
                buildEmail(users, news);
            })
        );
}

function buildEmail(users, news) {
    users.forEach((u) => {
        let tags = [];
        u.tag.forEach((element) => {
            tags.push(element.name);
        });
        let builtEmailBody = emailGenerator(news, tags);
        if (builtEmailBody) {
            let builtEmail = fs
                .readFileSync("./templates/newsTemplate.html")
                .toString()
                .replace("##$#newsBody#$##", builtEmailBody);

            sendEmail(builtEmail, u.email);
        }
    });
}

//SOLO PARA VER QUE FUNCIONA EL TIMER
console.log(new Date().getMinutes());

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "5862134486f108",
        pass: "f7215274c90982",
    },
});

transport.verify(function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

cron.schedule("* * * * *", () => {
    getData();
});

getData();

//TEMPORAL PARA LANZARLO SIN CRON

function sendEmail(bodyEmail, email) {
    transport.sendMail(
        {
            from: '"Newsletter FPCT" <newsletter@fpct.com>',
            to: email,
            subject: "Newsletter personalizada de la FPCT",
            text: "text",
            html: bodyEmail,
        },
        (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
        }
    );
}
