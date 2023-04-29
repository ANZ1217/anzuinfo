module.exports = {
    HTML:function(title, list, body, control)
    {
        return `
        <!doctype html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
        </head>
        <body>
            <h1><a href="/"></a></h1>
            ${list}
            ${control}
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