module.exports = {
    HTML:function(title, body)
    {
        return `
        <!doctype html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
        </head>
        <body>
            <h1>${title}</h1>
            ${body}
        </body>
        </html>
        `;
    },
    list:function(filelist)
    {
        let list = '<ul>';
        let i = 0;
        while(i < filelist.length)
        {
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list + `</ul>`;
        return list;
    }
}