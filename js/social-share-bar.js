const cacheName = 'socialShareCache';
const SHAREDCOUNT_API_KEY = '40001ccf033021ad9996c77ccc21bb4846fdacd9';

var localCache = {
    // The timeout is set to 24 hours
    timeout: 1000 * 60 * 60 * 24,
    data: JSON.parse(localStorage.getItem('socialShareCount')) || {},
    remove: function (url) {
        delete localCache.data[url];
        localStorage.setItem('socialShareCount', JSON.stringify(localCache.data));
    },
    exist: function (url) {
        return !!localCache.data[url] && ((new Date().getTime() - localCache.data[url]._) < localCache.timeout);
    },
    get: function (url) {
        console.log('Getting in cache for url ' + url);
        return localCache.data[url].data;
    },
    set: function (url, cachedData, callback) {
        localCache.remove(url);
        localCache.data[url] = {
            _: new Date().getTime(),
            data: cachedData
        };
        localStorage.setItem('socialShareCount', JSON.stringify(localCache.data));
        if ($.isFunction(callback)) callback(cachedData);
    }
};

$(document).ready(function () {
    // Get the current URL and strip the .html extension if present
    var shareURL = (document.URL.replace(/\.html$/, '')).replace('#' + location.hash, '');
    var twitterShares = null, facebookShares = null;
    var twitterShareData = [], facebookShareData = [];

    const twitterSharesPromise = () => {
        return new Promise((resolve, reject) => {
            // Check how many times the URL has been shared on Twitter

            let url = `http://opensharecount.com/count.json?url=${shareURL}`;
            if (localCache.exist(url)) {
                twitterShares = localCache.get(url);
                twitterShares = twitterShares['count'];
                resolve();
                return;
            }

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    twitterShares = res['count'];
                    localCache.set(url, res);
                    resolve();
                },
                error: function () {
                    console.log(`Couldn't fetch Twitter shares. Please refer to the 'Network' tab for more details.`);
                    reject();
                }
            });
        });
    }

    const facebookSharesPromise = () => {
        return new Promise((resolve, reject) => {
            // Check how many times the URL has been shared on Facebook

            let url = `https://api.sharedcount.com/v1.0/?url=${shareURL}&apikey=${SHAREDCOUNT_API_KEY}`;
            if (localCache.exist(url)) {
                facebookShares = localCache.get(url);
                facebookShares = facebookShares['Facebook']['share_count'];
                resolve();
                return;
            }
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    facebookShares = res['Facebook']['share_count'];
                    localCache.set(url, res);
                    resolve();
                },
                error: function () {
                    console.log(`Couldn't fetch Facebook shares. Please refer to the 'Network' tab for more details.`);
                    reject();
                }
            });
        });
    }

    const shareMessagePromise = () => {
        return new Promise((resolve, reject) => {
            let articleId = $('.article-container').data('article-content-id');
            $.ajax({
                url: '/blog/social.json',
                type: 'GET',
                success: function (res) {
                    $.each(res, function (index, value) {
                        if (value['articleId'] == articleId) {
                            twitterShareData['text'] = value['shareTexts']['twitter']['text'].replace('%%%LINK%%%', shareURL);
                            twitterShareData['via'] = value['shareTexts']['twitter']['via'];
                            facebookShareData['text'] = value['shareTexts']['facebook']['text'].replace('%%%LINK%%%', shareURL);
                            return;
                        }
                    });
                    resolve();
                },
                error: function () {
                    console.log(`Couldn't fetch social data corresponding to the article "${articleId}".`);
                }
            });
        });
    }

    $('.social-share-bar').remove();

    Promise.all([twitterSharesPromise(), facebookSharesPromise(), shareMessagePromise()])
        .then(() => {
            let totalShares = twitterShares + facebookShares;
            $('.page-wrapper').append(`
                <div class="social-share-bar">
                    <ul>
                        <li class="social-share-bar-count">${totalShares} <span>${(totalShares == 1) ? 'share' : 'shares'}</span></li>
                        <li>
                            <a href="https://twitter.com/intent/tweet?text=${(twitterShareData['text']) ? twitterShareData['text'] : `Check out this awesome article on Highlight: ${shareURL}`}&via=${(twitterShareData['via']) ? twitterShareData['via'] : 'HighlightTools'}" title="Share on Twitter" rel="nofollow" target="_blank">
                                <svg viewBox="0 0 512 512" class="icon-twitter">
                                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/sharer/sharer.php?href=${shareURL}" title="Share on Facebook" rel="nofollow" target="_blank">
                                <svg viewBox="0 0 320 512" class="icon-facebook">
                                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>`
            );
        })
        .catch(() => {
            console.log('An error has occured while attempting to fetch social share counts.');
            $('.page-wrapper').append(`
                <div class="social-share-bar">
                    <ul>
                        <li>
                            <a href="https://twitter.com/intent/tweet?text=${(twitterShareData['text']) ? twitterShareData['text'] : `Check out this awesome article on Highlight: ${shareURL}`}&via=${(twitterShareData['via']) ? twitterShareData['via'] : 'HighlightTools'}" title="Share on Twitter">
                                <svg viewBox="0 0 512 512" class="icon-twitter" rel="nofollow" target="_blank">
                                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/sharer/sharer.php?href=${shareURL}" title="Share on Facebook">
                                <svg viewBox="0 0 320 512" class="icon-facebook" rel="nofollow" target="_blank">
                                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>`
            );
        });

});