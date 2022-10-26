# instosint
### An AI based Instagram OSINT tool

For this to work well you need your Instagram cookies, I use a Chrome extenbsion called [Export cookie JSON file for Puppeteer](https://chrome.google.com/webstore/detail/%E3%82%AF%E3%83%83%E3%82%AD%E3%83%BCjson%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%87%BA%E5%8A%9B-for-puppet/nmckokihipjgplolmcmjakknndddifde?hl=en)

Put the downloaded JSON file in your project directory and rename it to `cookies.json`

Set the username on line 23 and run `node index.js` or `node .` (CLI support coming soon)


### How it works
* Convert username to ID via instagram web search API
* Log into Instagram on puppeteer with cookies
* Get public followers from ID.
* Cut list down to 100 followers
* Visit each profile with puppeteer and download all photos on page if any
* Run photos taken outside through GeoEstimation API
* Export to CSV file

The current export format is meant to be put into this [GeoPlotter](https://mobisoftinfotech.com/tools/plot-multiple-points-on-map/)
I am working on making a heat map locally 

