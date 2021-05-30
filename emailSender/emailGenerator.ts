//POR QUE TENGO QUE USAR FS2???? esto de que va junior
const fs2 = require("fs");
let bodyTemplate = fs2.readFileSync("./templates/newsBody.html").toString();
let newsTests = [
    {
        tag: ["PYMES"],
        title: "Titulo noticia 1",
        body: "En esta sección encontrarás el enlace al registro para asistir a lassesiones informativas de la Convocatoria MSCA - Postdoctoral FellowshipPF 2021 y a la documentación de apoyo generada. ",
        link: "https://bit.ly/3va7Z0V",
    },
    {
        tag: ["I+D+i"],
        title: "Titulo noticia 2",
        body: "Virtual Mission Offshore Wind Ireland & the NetherlandsOffshore Wind Ireland & the Netherlands 14-18 June 2021Discover opportunities in the Irish and Dutch offshore wind sector!Jun 14 2021 and Jun 18 2021 in Virtual - Ireland",
        link: "https://bit.ly/345rxYw",
    },
    {
        tag: ["Subvenciones", "I+D+i"],
        title: "Titulo noticia 3",
        body: "Encuentros Tecnológicos – De la investigación científica a la actividadeconómica innovadora: Lecciones por aprender, 27 de mayo de 2021",
        link: "https://bit.ly/3hreYyw",
    },
];

function buildEmailBody(news, userTags) {
    let newsConcat = "";
    news.forEach((e) => {
        let included = false;
        let newsCategories = "";
        e.tag.forEach((t) => {
            if (userTags.includes(t)) {
                included = true;
            }
            newsCategories = newsCategories + `[${t}] `;
        });
        if (included) {
            let newsBodyTemporal = bodyTemplate
                .replace("##$#categories#$##", newsCategories)
                .replace("##$#newsTitle#$##", e.title)
                .replace("##$#news#$##", e.body)
                .replace("##$#newsUrl#$##", e.link);
            newsConcat = newsConcat + newsBodyTemporal;
        }
    });

    return newsConcat;
}

module.exports = buildEmailBody;
