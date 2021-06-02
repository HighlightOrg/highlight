/*
 * Human readable elapsed or remaining time
 * CREDIT: github.com/victornpb
*/
function fromNow(date) {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;
    const units = [
        { max: 30 * SECOND, divisor: 1, past1: 'just now', pastN: 'just now', future1: 'just now', futureN: 'just now' },
        { max: MINUTE, divisor: SECOND, past1: 'a second ago', pastN: '# seconds ago', future1: 'in a second', futureN: 'in # seconds' },
        { max: HOUR, divisor: MINUTE, past1: 'a minute ago', pastN: '# minutes ago', future1: 'in a minute', futureN: 'in # minutes' },
        { max: DAY, divisor: HOUR, past1: 'an hour ago', pastN: '# hours ago', future1: 'in an hour', futureN: 'in # hours' },
        { max: WEEK, divisor: DAY, past1: 'yesterday', pastN: '# days ago', future1: 'tomorrow', futureN: 'in # days' },
        { max: 4 * WEEK, divisor: WEEK, past1: 'last week', pastN: '# weeks ago', future1: 'in a week', futureN: 'in # weeks' },
        { max: YEAR, divisor: MONTH, past1: 'last month', pastN: '# months ago', future1: 'in a month', futureN: 'in # months' },
        { max: 100 * YEAR, divisor: YEAR, past1: 'last year', pastN: '# years ago', future1: 'in a year', futureN: 'in # years' },
        { max: 1000 * YEAR, divisor: 100 * YEAR, past1: 'last century', pastN: '# centuries ago', future1: 'in a century', futureN: 'in # centuries' },
        { max: Infinity, divisor: 1000 * YEAR, past1: 'last millennium', pastN: '# millennia ago', future1: 'in a millennium', futureN: 'in # millennia' },
    ];

    const diff = Date.now() - (typeof date === 'object' ? date : new Date(date)).getTime();
    const diffAbs = Math.abs(diff);
    for (const unit of units) {
        if (diffAbs < unit.max) {
            const isFuture = diff < 0;
            const x = Math.round(Math.abs(diff) / unit.divisor);
            if (x <= 1) return isFuture ? unit.future1 : unit.past1;
            return (isFuture ? unit.futureN : unit.pastN).replace('#', x);
        }
    }
};

$(document).ready(function () {

    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    /*
        let articleCount = 1;
    
        $('.articles').each(function (index) {
            let articleLimit = $(this).data('article-limit');
        });
    
        var articlesOffset = 0;
    
        function loadMore(limit) {
            return new Promise((resolve, reject) => {
                var articles = [];
                let page = Math.ceil((articleOffset + 1) / articlesPerJSONFile);
                let articleCounter = 0;
                function main() {
                    $.ajax({
                        url: `/blog/posts-${page}.json`,
                        type: 'GET',
                        success: function (res) {
                            $.each(res, function (index, value) {
                                if(!(articleCounter <= limit)){
                                    articles.push(value);
                                    articleCounter++;
                                }
                            });
                            if(!(articleCounter <= limit)){
                                main();
                            }
                        },
                        error: function () {
                            console.log(`An unhandled error occured while attempting to fetch the metadata corresponding to the article "${articleId}".`);
                        }
                    });
                }
            });
        }
    
        function fetchArticles(offset, limit) {
            return new Promise((resolve, reject) => {
                var articles = [];
                function fetchJSONArticles() {
                    let page = Math.ceil((offset + 1) / articlesPerJSONFile);
                    console.log('PAGE: ' + page);
                    $.ajax({
                        url: `/blog/posts-${page}.json`,
                        type: 'GET',
                        success: function (res) {
                            console.log((page * articlesPerJSONFile) - offset);
                            if (((page * articlesPerJSONFile) - offset) > 0) {
                                articles.push(res.slice(offset));
                                console.log(articles)
                                limit = limit - ((page * articlesPerJSONFile) - offset);
                                offset = offset + ((page * articlesPerJSONFile) - offset);
                                console.log(limit)
                                console.log(offset)
                                fetchJSONArticles();
                            } else {
                                articles.push(res.slice(((page * articlesPerJSONFile) - offset), (limit + 1)));
                                resolve(articles);
                            }
                        },
                        error: function () {
                            console.log(`An unhandled error occured while attempting to fetch the metadata corresponding to the article "${articleId}".`);
                        }
                    });
                }
                fetchJSONArticles();
            });
        }
    
        fetchArticles(0, 10)
            .then((a) => {
                console.log(a);
            })
            .catch((err) => {
                console.log('ERROR: ' + err);
            })
    */
    $('.article-container article.article-content').each(function (index) {
        let articleId = $(this).parent().data('article-content-id');
        let articleSelector = $(this);
        $(articleSelector).html('<div class="d-flex justify-content-center"><div class="loading-spinner mt-20 mb-20"></div></div>');
        $.ajax({
            url: `/posts/${articleId}.md`,
            type: 'GET',
            success: function (res) {
                // Parse the MarkDown document
                let parsed = reader.parse(res);
                // Render the parsed document into HTML
                let result = writer.render(parsed);
                // Append the rendered article to the DOM
                $(articleSelector).html(`<div class="article-content-main">${result}</div>`);
                // Highlight all code blocks
                hljs.highlightAll();
            },
            error: function () {
                console.log(`An unhandled error occured while attempting to fetch the article "${articleId}".`);
            }
        });
    });

    $('.article-container .article-cover time').each(function (index) {
        let articleId = $(this).parent().parent().data('article-content-id');
        let timeSelector = $(this);
        $.ajax({
            url: `https://api.github.com/repos/HighlightTools/highlight/commits?path=/posts/${articleId}.md`,
            type: 'GET',
            success: function (res) {
                if (res[0]['commit']['author']['date'] !== '') {
                    let lastUpdated = res[0]['commit']['author']['date'];
                    $(timeSelector).html(`<span data-toggle="tooltip" data-title="${new Date(lastUpdated).toLocaleString()}"><b>Last updated:</b> ${fromNow(lastUpdated)}</span>`);
                    $(timeSelector).attr('datetime', lastUpdated);
                } else {
                    console.log(`An unhandled error occured while attempting to process the metadata corresponding to the article "${articleId}".`);
                }
            },
            error: function () {
                console.log(`An unhandled error occured while attempting to fetch the metadata corresponding to the article "${articleId}".`);
            }
        });
    });

    function displayArticleInformation(res) {
        $('.article-container .article-cover').each(function (index) {
            let articleId = $(this).parent().data('article-content-id');
            let articleSelector = $(this);
            $.each(res, function (index, value) {
                if (res[index]['metadata']['articleId'] == articleId) {
                    $(articleSelector).append(`<img src="${res[index]['metadata']['image']}" alt="${res[index]['metadata']['imageAlt']}" onload="$(this).parent().find('.img-placeholder').remove(); $(this).css('display', 'block');">`);
                    $(articleSelector).parent().append(`<div class="article-meta d-flex justify-content-center"><div class="card"><h3 class="card-title">${res[index]['metadata']['author']}</h3><div class="container-fluid"><div class="row"><div class="col-auto mr-10"><img src="${res[index]['metadata']['authorImage'] ? res[index]['metadata']['authorImage'] : '/img/highlight_light.svg'}"></div><div class="col ml-10">${res[index]['metadata']['authorBio']}</div></div></div><hr><i class="far fa-calendar-alt"></i> <time datetime="${value['published']}"><span data-toggle="tooltip" data-title="${new Date(value['published']).toLocaleString()}"><b>Published:</b> ${fromNow(value['published'])}</span></time></div></div>`);
                    document.title = `${res[index]['title']} | Highlight Blog`;
                    $('head').append(`<meta name="title" content="${res[index]['title']} | Highlight Blog"><meta name="description" content="${res[index]['brief']}"><meta property="og:image" content="${res[index]['metadata']['image']}"><meta property="og:title" content="${res[index]['title']} | Highlight Blog"><meta property="og:description" content="${res[index]['brief']}">`);
                    return false;
                }
            });
        });
    }

    var articlesOffset = 0;
    var articles = [];

    function loadMoreArticles() {
        let limit = $('.articles').data('article-limit');
        let loadMoreContent = articles.reverse().slice(articlesOffset, (articlesOffset + limit));
        articlesOffset = articlesOffset + limit;
        $.each(loadMoreContent, function (index, value) {
            $('.articles').append(`
            <div class="card p-0 article-preview-container">
                <div class="img-placeholder rounded-top"></div>
                <img src="${value['metadata']['image']}" alt="${value['metadata']['imageAlt']}" class="img-fluid rounded-top" onload="$(this).parent().find('.img-placeholder').remove(); $(this).css('display', 'block');">
                <div class="content">
                    <h2 class="content-title">
                        <a href="/blog/${value['metadata']['articleId']}">${value['title']}</a> by ${value['metadata']['author']}
                    </h2>
                    <p>${value['brief']}</p>
                    <div>
                        <span class="text-muted">
                            <i class="far fa-calendar-alt"></i> <time datetime="${value['published']}"><span data-toggle="tooltip" data-title="${new Date(value['published']).toLocaleString()}"><b>Published:</b> ${fromNow(value['published'])}</span></time>
                        </span>
                    </div>
                </div>
            </div>
            `);
            if (articlesOffset >= articles.length) {
                $('.articles-show-more-btn').remove();
            } 
        });


    }

    $.ajax({
        url: '/blog/posts.json',
        type: 'GET',
        success: function (res) {
            displayArticleInformation(res);
            articles = res;
            $('.loading-spinner').parent().remove();
            loadMoreArticles();
        },
        error: function () {
            console.log(`An unhandled error occured while attempting to fetch the metadata corresponding to the article "${articleId}".`);
        }
    });

    $('.articles-show-more-btn').prop('disabled', false);
    $(document).on('click', '.articles-show-more-btn', loadMoreArticles);
});