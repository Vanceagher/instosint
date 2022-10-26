const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const fs2 = require('fs');
request = require('request');
const download = require('image-downloader');   
const fetch = require('node-fetch');
var request = require('request');
const path = require( 'path' );



(async () => {
  var browser = await puppeteer.launch({ headless: true });
  var page = await browser.newPage();


// load instagram cookie
  const cookieJson = await fs.readFile('./cookies.json');
      const cookies = JSON.parse(cookieJson);
      await page.setCookie(...cookies);
      await page.goto('https://instagram.com');
      
      var igUsername = 'instagram';

      var id = await page.evaluate(async (igUsername) => {
        const response = await fetch('https://www.instagram.com/web/search/topsearch/?context=user&count=0&query=' + igUsername);
        const text = await response.text();
        return text;
      }, igUsername);

      console.log(JSON.parse(id).users[0].user.pk);
      
      id = JSON.parse(id).users[0].user.pk;
      var count = 1000;

      const followers = await page.evaluate((id, count) => {
        const random_wait_time = (waitTime = 300) => new Promise((resolve, reject) => {
          setTimeout(() => {
            return resolve();
          }, Math.random() * waitTime);
        });

        //const fetch = require("node-fetch");


        const get_followers = async(userId, userFollowerCount) => {
          let userFollowers = [],
            batchCount = 20,
            actuallyFetched = 20,
            url = `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables={"id":"${userId}","include_reel":true,"fetch_mutual":true,"first":"${batchCount}"}`;
          while (userFollowerCount > 0) {
            const followersResponse = await fetch(url)
              .then(res => res.json())
              .then(res => {
                console.log(res);
                const nodeIds = [];
                for (const node of res.data.user.edge_followed_by.edges) {
                  if(node.node.is_private == false) { nodeIds.push(node.node.username) };
                }
                actuallyFetched = nodeIds.length;
                return {
                  edges: nodeIds,
                  endCursor: res.data.user.edge_followed_by.page_info.end_cursor
                };
              }).catch(err => {
                userFollowerCount = -1;
                return {
                  edges: []
                };
              });
            await random_wait_time();
            userFollowers = [...userFollowers, ...followersResponse.edges];
            userFollowerCount -= actuallyFetched;
            url = `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables={"id":"${userId}","include_reel":true,"fetch_mutual":true,"first":${batchCount},"after":"${followersResponse.endCursor}"}`;
          }
          console.log(userFollowers);
          return userFollowers;
        };

        return get_followers(id,count);

      }, id, count);

      console.log(followers);

      var pics = [];

      var nFollowers = followers.splice(0,100);

      /*await browser.close();
      browser = await puppeteer.launch({ headless: false });
      page = await browser.newPage();*/

      for (let i = 0; i < nFollowers.length; i++) {
        
        console.log(nFollowers[i])
  await page.goto('https://instagram.com/' + nFollowers[i]);

  try {
      await page.waitForSelector('._aabd', {timeout: 3000});
  } catch {
    console.log(nFollowers[i] + " is private or has no posts");
  }

      const photos = await page.evaluate(() => {
        var photos = [];
        var srcs = document.querySelectorAll('._aabd img');
        for (let i = 0; i < srcs.length; i++) {
          photos.push(srcs[i].src);
        }
        return photos;
     });

     for (let i = 0; i < photos.length; i++) {
      pics.push(photos[i]);
      
     }

    }

    for (let i = 0; i < pics.length; i++) {

      if(pics[i].length > 0) {
    console.log(pics[i])

     //var url = photos[0];                    

     const options = {
       url: pics[i],
       dest: "./photos",               // will be saved to /path/to/dest/image.jpg
     };
     
     download.image(options)
       .then(({ filename }) => {
         console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
       })
       .catch((err) => console.error(err));
      }
      }


})();


  
