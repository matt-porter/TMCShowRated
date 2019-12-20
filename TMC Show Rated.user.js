// ==UserScript==
// @name     TMC Show Rated
// @version  0.1
// @description  Hide unrated / low rated comments in the investors threads.
// @author       Matt Porter
// @namespace    https://github.com/matt-porter/
// @include      https://teslamotorsclub.com/tmc/watched/threads*
// @grant        none
// @license      MIT
// ==/UserScript==

var always_show_authors = ["Fact Checking", "KarenRei"];
var show_thresholds = {
    "Informative": 1,
    "Like": 3,
    "Love": 3,
    "Helpful": 1,
    "Funny": 4
};

/*
<li id="fc-post-4315098" class="sectionMain message      " data-author="MABMAB">
    <div class="uix_message ">
        <div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
            <div class="messageUserBlock  is-expanded online">
                <div class="avatarHolder is-expanded">
                    <div class="uix_avatarHolderInner">
                        <span class="helper"></span>
                        <a href="members/mabmab.107412/" class="avatar Av107412l" data-avatarhtml="true"><img
                                src="styles/xenith/xenforo/avatars/avatar_l.png" alt="MABMAB" width="192"
                                height="192"></a>
                        <span class="Tooltip onlineMarker" data-offsetx="-22" data-offsety="-8"></span>

                    </div>
                </div>
                <h3 class="userText">
                    <div class="uix_userTextInner">
                        <a href="members/mabmab.107412/" class="username" dir="auto" itemprop="name">MABMAB</a>
                        <em class="userTitle" itemprop="title">Member</em>
                    </div>
                    <div class="ssd_groupBadges">
                    </div>

                </h3>
                <div class="extraUserInfo is-expanded">
                    <dl class="pairsJustified">
                        <dt>Joined:</dt>
                        <dd>Jun 19, 2019</dd>
                    </dl>
                    <dl class="pairsJustified">
                        <dt>Messages:</dt>
                        <dd><a href="search/member?user_id=107412" class="concealed" rel="nofollow">83</a></dd>
                    </dl>
                    <dl class="pairsJustified">
                        <dt>Location:</dt>
                        <dd>
                            <a href="misc/location-info?location=Goloka+Vrindavan" target="_blank"
                                rel="nofollow noreferrer" itemprop="address" class="concealed">Goloka Vrindavan</a>
                        </dd>
                    </dl>
                </div>
                <span class="arrow"><span></span></span>
            </div>
        </div>
        <div class="messageInfo primaryContent">
            <div class="messageDetails">
                <a href="posts/4315098/" title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger"
                    data-href="posts/4315098/permalink">#115167</a>
                <span class="item muted">
                    <span class="authorEnd"><a href="members/mabmab.107412/" class="username author"
                            dir="auto">MABMAB</a>,</span>
                    <a href="posts/4315098/" title="Permalink" class="datePermalink">
                        <abbr class="DateTime" data-time="1576845638" data-diff="1521" data-datestring="Dec 20, 2019"
                            data-timestring="12:40 PM" title="Dec 20, 2019 at 12:40 PM">35 minutes ago</abbr>
                    </a>
                </span>
            </div>
            <div class="messageContent">
                <article>
                    <blockquote class="messageText SelectQuoteContainer ugc baseHtml">
                        I wuz gonna buy some more shares to push the price up but then...<br>
                        <br>
                        <iframe src="https://www.youtube.com/embed/WeYsTmIzjkw?wmode=opaque" allowfullscreen=""
                            width="500" height="300" frameborder="0"></iframe>
                        <div class="messageTextEndMarker">&nbsp;</div>
                    </blockquote>
                </article>
            </div>
            <div class="dark_postrating likesSummary secondaryContent">
                <div class="dark_postrating_container">
                    <ul class="dark_postrating_outputlist">
                        <li>
                            <i class="fa fa-smile-o"></i> Funny x <strong>2</strong>
                        </li>
                        <li>
                            <i class="fa fa-heart-o"></i> Love x <strong>1</strong>
                        </li>
                        <li> <a href="posts/4315098/ratings" class="dark_postrating_list OverlayTrigger"
                                data-cacheoverlay="false">List</a></li>
                    </ul>
                    <script type="text/javascript">
                        var dark_postrating_minimum_opacity = 0.3;
                    </script>
                    <ul class="dark_postrating_inputlist " style="opacity: 0.3;">
                    </ul>
                </div>
                <div style="clear: right;"></div>
            </div>
            <div class="messageMeta ToggleTriggerAnchor">
                <div class="privateControls">
                    <a href="posts/4315098/report" class="OverlayTrigger item control report"
                        data-cacheoverlay="false"><span></span>Report</a>
                </div>
                <div class="publicControls">
                    <div class="Popup PopupControl PopupClosed uix_postbit_privateControlsMenu PopupContainerControl">
                        <a rel="Menu" class="NoPopupGadget"><i class="uix_icon"></i>More</a>

                    </div>
                    <a href="threads/tesla-tsla-the-investment-world-the-2019-investors-roundtable.139047/reply?quote=4315098"
                        data-messageid="4315098" class="MultiQuoteControl JsOnly item control"
                        title="Toggle Multi-Quote"><span></span><span class="symbol">+ Quote</span></a>
                    <a href="threads/tesla-tsla-the-investment-world-the-2019-investors-roundtable.139047/reply?quote=4315098"
                        data-posturl="posts/4315098/quote" data-tip="#MQ-4315098" class="ReplyQuote item control reply"
                        title="Reply, quoting this message"><span></span>Reply</a>
                </div>
            </div>
        </div>
    </div>
</li>

*/
var posts = $(".message");
console.log("Running comment script");
$.each( posts, function( key, val )  {
    var post = $(this);
    var post_id = post.attr("id");
    if (!post_id) {
        return 1; // continue
    }
    var permalink = post.find("a.hashPermalink").text();
    var author = post.attr("data-author");
    var counts = {};
    var likes = $(this).find('.likesSummary li');
    $.each(likes, function(key, val) {
        var text = $(this).text();
        var pat = /.*([A-Z][a-z]+) x (\d+).*/;
        if (pat.test(text)) {
            //console.log("Found a like");
            var match = pat.exec(text);
            counts[match[1]] = match[2];
        }
    });
//    console.log("Post with likes:" + JSON.stringify(counts));
    var include_post = false;
    if (always_show_authors.includes(author)) {
        include_post = true;
        console.log(`Including post ${post_id} for always_author ${author}`);
    }
    $.each(show_thresholds, function(key, val) {
        if (val <= counts[key]||0) {
            include_post = true;
//            console.log("Including post for " + key + " x " + counts[key]);
        }
    });
    if (!include_post) {
        console.log(`Excluding post ${post_id} by author ${author} perma ${permalink}`);
        post.hide();

    }
});

