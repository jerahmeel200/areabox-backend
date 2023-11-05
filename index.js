const express = require("express")
const app = express()
const port = 8080
const axios = require('axios');
const qs = require('querystring');
const cors = require("cors")
const oembetter = require('oembetter')();
const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-title')()
  ])
 
app.use(express.json());
app.use(cors())

app.get("/", (req, res)=>{
    res.send("hello world fuck you")
})


// Cloud Storage and Admin Details 
const projectId = 'areabox-chat';
const bucketName = `${projectId}.appspot.com`
const keyFileName = './areabox-chat-e63f7e047acb.json'




const embedEndpoints = [
    { domain: 'spotify.com', endpoint: 'https://embed.spotify.com/oembed/' },
    { domain: 'soundcloud.com', endpoint: 'https://soundcloud.com/oembed' },
    { domain: 'dailymotion.com', endpoint: 'https://www.dailymotion.com/services/oembed' },
    { domain: 'animoto.com', endpoint: 'http://animoto.com/oembeds/create' },
    { domain: 'vimeo.com', endpoint: 'https://vimeo.com/api/oembed.json' },
    { domain: 'audiomack.com', endpoint: 'https://audiomack.com/oembed' },
    { domain: 'ethfiddle.com', endpoint: 'https://ethfiddle.com/services/oembed/' },
    { domain: 'flickr.com', endpoint: 'https://www.flickr.com/services/oembed/' },
    { domain: 'funnyordie.com', endpoint: 'http://www.funnyordie.com/oembed.json' },
    { domain: 'codepen.io', endpoint: 'https://codepen.io/api/oembed' },
    { domain: 'codesandbox.io', endpoint: 'https://codesandbox.io/oembed' },
    { domain: 'repl.it', endpoint: 'https://repl.it/data/oembed' },
    { domain: 'slideshare.net', endpoint: 'http://www.slideshare.net/api/oembed/2' },
    { domain: 'ted.com', endpoint: 'https://www.ted.com/services/v1/oembed.json' },
    { domain: 'tiktok.com', endpoint: 'https://www.tiktok.com/oembed' },
    { domain: 'd.tube', endpoint: 'https://api.d.tube/oembed' },
    { domain: 'audioboom.com', endpoint: 'https://audioboom.com/publishing/oembed/v4.json' },
    { domain: 'livestream.com', endpoint: 'https://livestream.com/oembed' },
    { domain: 'twitch.tv', endpoint: 'https://api.twitch.tv/v5/oembed' },
    { domain: 'twitter.com', endpoint: 'https://publish.twitter.com/oembed' },
    { domain: 'gettyimages.com', endpoint: 'http://embed.gettyimages.com/oembed' },
    { domain: 'reddit.com', endpoint: 'https://www.reddit.com/oembed' },
    { domain: 'mathembed.com', endpoint: 'http://mathembed.com/oembed' },
    { domain: 'scribd.com', endpoint: 'http://www.scribd.com/services/oembed/' },
    { domain: 'docdroid.net', endpoint: 'https://www.docdroid.net/api/oembed' },
    { domain: 'issuu.com', endpoint: 'https://issuu.com/oembed' },
    { domain: 'gfycat.com', endpoint: 'https://api.gfycat.com/v1/oembed' },
    { domain: 'streamable.com', endpoint: 'https://api.streamable.com/oembed.json' },
    { domain: 'coub.com', endpoint: 'http://coub.com/api/oembed.json' },
    { domain: 'commaful.com', endpoint: 'https://commaful.com/api/oembed/' },
    { domain: 'verse.com', endpoint: 'http://verse.com/services/oembed/' },
    { domain: 'nfb.ca', endpoint: 'http://www.nfb.ca/remote/services/oembed/' },
    { domain: 'mixcloud.com', endpoint: 'https://www.mixcloud.com/oembed/' },
    { domain: 'radiopublic.com', endpoint: 'https://oembed.radiopublic.com/oembed' },
    { domain: 'vevo.com', endpoint: 'https://www.vevo.com/oembed' },
    { domain: 'iheart.com', endpoint: 'https://www.iheart.com/oembed' },
    { domain: 'rumble.com', endpoint: 'https://rumble.com/api/Media/oembed.json' },
    { domain: 'deviantart.com', endpoint: 'http://backend.deviantart.com/oembed' },
    { domain: 'nytimes.com', endpoint: 'https://www.nytimes.com/svc/oembed/json/' },
    { domain: 'simplecast.com', endpoint: 'https://simplecast.com/oembed' },
    { domain: 'fite.tv', endpoint: 'https://www.fite.tv/oembed' },
    { domain: 'ifixit.com', endpoint: 'http://www.ifixit.com/api/doc/embed' },
    { domain: 'ora.tv', endpoint: 'https://www.ora.tv/oembed/*?format=json' },
    { domain: 'me.me', endpoint: 'https://me.me/oembed' },
    { domain: 'reverbnation.com', endpoint: 'https://www.reverbnation.com/oembed' },
    { domain: 'datawrapper.de', endpoint: 'https://api.datawrapper.de/v3/oembed/' },
    { domain: 'crowdranking.com', endpoint: 'http://crowdranking.com/api/oembed.json' },
    { domain: 'ultimedia.com', endpoint: 'https://www.ultimedia.com/api/search/oembed' },
    { domain: 'edumedia-sciences.com', endpoint: 'https://www.edumedia-sciences.com/oembed.json' },
    { domain: 'roosterteeth.com', endpoint: 'https://roosterteeth.com/oembed' },
  ]
  
// ***********
  // META ROUTE *
  // ***********
  app.get('/meta', async (req, res) => {
    try {
      const { u } = req.query;
  
      // Check if the 'u' parameter is provided and not empty
      if (!u) {
        return res.status(400).send('Invalid URL');
      }
  
      // Ensure the URL starts with 'http' or 'https'
      const url = u.trimLeft().startsWith('http') ? u : 'https://' + u;
  
      const meta = {};
      const { data: html } = await axios.get(url);
  
      // Use metascraper to extract metadata from the webpage
      const metadata = await metascraper({ html, url });
  
      if (metadata) {
        const { title, image, description } = metadata;
        console.log("metadata", metadata )
        if (title) meta.title = title;
        if (image) {
        //   // Assuming you have a function named 'resizeImage' for image resizing
        // //   let resizedImage = await resizeImage(image);
        //   meta.img = resizedImage;
        meta.image = image;
        }
        if (description) meta.texts = description;
        meta.success = true;
      }
  
      return res.status(200).json(meta);
    } catch (err) {
      console.error('meta error', err);
      res.status(500).send(err.message);
    }
  });
  

  //************
  // GET EMBED *
  //************
  app.get('/get-embed', (req, res) => {
    let { link } = req.query;
    console.log('EMBED QUERY LINK', link)
    if (link) {
      link = decodeURI(link);
      link = Object.keys(qs.parse(link))[0];
      console.log('Embed Deco-Parsed Link', link);
      if (link.trimLeft().indexOf("http") < 0) {
        link = `https://${link}`
      }


      const allowedEndpoints = [...oembetter.suggestedEndpoints, ...embedEndpoints]
      oembetter.endpoints(allowedEndpoints);

      // oembetter.whitelist(oembetter.suggestedWhitelist);
      // { maxwidth: 380, maxheight: 380 }

      oembetter.fetch(link, (err, response) => {
        if (!err) {
          const html = response.html
          return res.status(200).json({
            html
          });
        } else {
          console.log('EMBED ERROR', err.message);
          return res.status(400).send('No Embed HTML');
        }
      });
    } else {
      return null;
    }
  })



  // function resizeImage(imgUrl) {
  //   return new Promise((resolve, reject) => {
  //     axios({
  //       method: 'get',
  //       url: imgUrl,
  //       responseType: 'stream'
  //     })
  //       .then((response) => {
  //         let transformer = sharp()
  //           .resize({ height: 350 })
  //           .png();
  
  //         //clip url for filename until ? or #
  //         const urlId = imgUrl.replace(/((\?|#).*)?$/, '');
  //         // const linkId = crypto.createHash('sha1').update(imgUrl).digest("hex");
  
  //         // let ref = admin.database().ref('card').child(`links/${linkId}`)
  //         // ref.on("value", function (snapshot) {
  //         //   if (snapshot.exists()) {
  //         //     const link = snapshot.val().url
  //         //     resolve(link)
  //         //     return;
  //         //   } else {
  //         let newFileName = (`${Date.now()}_${urlId}`);
  //         newFileName = newFileName.replace(/[^\w.]+/g, "_");
  
  //         const blob = bucket.file(newFileName);
  //         const blobstream = blob.createWriteStream({
  //           resumable: false,
  //           validation: false,
  //           gzip: true,
  //           contentType: "auto",
  //           metadata: {
  //             'Cache-Control': 'public, max-age=31536000'
  //           }
  //         })
  //         console.log("image successfully converted to: ", blobstream );
  //         response.data.pipe(transformer).pipe(blobstream)
  //           .on('error', (error) => {
  //             reject(error)
  //           })
  //           .on('finish', () => {
  //             console.log("image converted successfully");
  //             const storageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`
  //             // ref.set({ url: storageUrl });
  //             resolve(storageUrl)
  //           });
  //         // }
  //       })
  //       .catch(err => {
  //         reject("Image transfer error. ", err);
  //       });
  //   })
  // }

app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
})