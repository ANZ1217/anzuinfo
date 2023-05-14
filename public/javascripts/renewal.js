var userInfo = [],
    track_count = 0,
    tracks = [],
    cur_page = 0,
    max_page = 0;

function getHalo(skill) {
    if (skill == 12) return 170;
    else if (skill == 11) return 160;
    else if (skill == 10) return 150;
    else return 130;
}

function sa(t, e, a) {
    t.setAttribute(e, a)
}

function itv(t) {
    var e = $.Deferred();
    return setTimeout(function () {
        e.resolve()
    }, t), e.promise()
}

function checkFinish() {
    if (max_page <= cur_page && 0 < userInfo.length) {
        for (var t = "", e = 0; e < tracks.length; e++) 0 != e && (t += "|"), t += tracks[e];
        var a = document.createElement("form");
        document.body.appendChild(a);
        sa(a, "action", "https://dev-anzuinfo.me/saveScore");
        sa(a, "accept-charset", "UTF-8"), sa(a, "method", "post");
        sa(e = document.createElement("input"), "type", "text");
        sa(e, "name", "user"), sa(e, "value", userInfo), a.appendChild(e);
        var i = document.createElement("input");
        sa(i, "type", "text"), sa(i, "name", "track"), sa(i, "value", t);
        a.appendChild(i), a.submit();
        console.log("finish!");
    }
}

function getList(t) {
    itv(1e3 * (t + 2)).done(function () {
        $.ajax({
            type: "GET",
            url: "https://p.eagate.573.jp/game/sdvx/vi/playdata/musicdata/index.html?page=" + t + "&sort=0",
            async: true,
            success: function (t) {
                $(t).find(".data_col").each(function () {
                    var t;
                    $(this).find("td").each(function () {
                        var e = $(this).attr("class");
                        if ("music" == e) t = $(this).find(".title a").text().replace("(EXIT TUNES)", "");
                        else {
                            var a = $(this).text();
                            if ("0" != a) {
                                var i = $(this).find("img").first().attr("src").replace("/game/sdvx/vi/images/playdata/rival/rival_mark_", "").replace(".png", "");
                                track_count++;
                                tracks.push(t + "\t" + e + "\t" + i + "\t" + a);
                                console.log(t + " 수집 완료! (" + (cur_page + 1) + "/" + max_page + " 페이지)")
                            }
                        }
                    })
                })
            },
            complete: function (t) {
                cur_page++;
                $("#pg").text(cur_page + "/" + max_page + " 페이지 수집완료!");
                console.log(cur_page + "/" + max_page + " 페이지 수집완료");
                checkFinish();
            }
        });
    });
}

var id, nm, skill, force, playcount;

$(function () {
    alert("잠시만 기다려주세요, 1~2분정도 걸립니다.");
    var t = $("<div>").attr("style", "position:fixed; top:0; z-index:100; width:100%; height:100%; background-color:rgba(0,0,0,0.5);"),
        e = $("<span>").attr("style", "position:fixed; bottom:0; z-index:101; width:100%; height:50px; background-color:lightpink; color:white; line-height:50px; text-align:center; font-size:24px;");
    e.attr("id", "pg"), e.text("준비 중입니다..."), $("body").append(t), $("body").append(e);

    $.ajax({
        type: "GET",
        async: true,
        url: "https://p.eagate.573.jp/game/sdvx/vi/playdata/profile/index.html",
        success: function (t) {
            id = $(t).find("#player_id").text();
            nm = $(t).find("#player_name p:nth-child(2)").text();
            force = $(t).find("#force_point").text();
            skill = $(t).find(".profile_skill").attr("id").replace("skill_", "");
            if(skill == "inf") skill = "12";
            playcount = $(t).find(".profile_cnt").first().text().replace("回", "");
            if (id == "") {
                $("#pg").text("e-amusement 로그인이 되어있지 않습니다.");
            }

        }
    }).done(function() {
        if (id != "") {
            console.log(skill);
            if (Number(skill) > 0) {
                $.ajax({
                    type: "GET",
                    async: true,
                    url: "https://p.eagate.573.jp/game/sdvx/vi/playdata/skill/detail.html?course_id=" + skill,
                    success: function (t) {
                        var skill2 = 2;
                        $(t).find(".course_rate_box").each(function () {
                            var rate = Number($(this).find("p:nth-child(2)").text().replace("%", ""));
                            if (rate >= getHalo(skill)) skill2 = Math.min(skill2, 2);
                            else if (rate >= 100) skill2 = Math.min(skill2, 1);
                            else skill2 = Math.min(skill2, 0);
                        });
                        userInfo = id + "\t" + nm + "\t" + force + "\t" + skill + "\t" + skill2 + "\t" + playcount;
                    }
                });
            }
    
            $.ajax({
                type: "GET",
                url: "https://p.eagate.573.jp/game/sdvx/vi/playdata/musicdata/index.html"
            }).done(function (t) {
                if ((max_page = Number($(t).find(".page").text().replace(/\s/g, "").replace("＞", "").split("・").pop())) <= 0) $("#pg").text("베이직 코스가 없거나, 플레이 데이터가 존재하지 않습니다.");
                else
                    for (var e = 1; e <= max_page; e++) getList(e)
            })
        }
    });
});