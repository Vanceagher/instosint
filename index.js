const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs').promises;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();



  // Wait for suggest overlay to appear and click "show all results".
  const cookieJson = await fs.readFile('./cookies.json');
      const cookies = JSON.parse(cookieJson);
      await page.setCookie(...cookies);
      //await page.reload();
      await page.goto('https://instagram.com');
      /*await page.waitForSelector("._a9_1")
      await page.click("._a9_1");*/
// //*[@id="mount_0_0_6M"]/div/div/div/div[1]/div/div/div/div[1]/section/main/div/header/section/ul/li[2]/a/div
      //document.querySelectorAll("._aacp")[1];

      var id = ;
      var count = 100;

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
                  nodeIds.push(node.node.id);
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

})();
