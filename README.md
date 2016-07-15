# semproelShare

## Intro
There has been so many notable social share plugins written in javascript. What triggers me creating this is that I want a social share plugin that is independent (i.e. pure plain-javascript), modular, using Promise API, real-time (i.e. updatable share count after user click on share buttons), and having unified/centralized count.

## Usage
(1) Include `semproelShare.min.js` before the closing body tag:
```javascript
      <script src="semproelshare.min.js"></script>
      <script>
         ...
      </script>
   </body>
</html>
```
<br>
<br>
(2) Prepare your markup (I use [Foundation Flex Grid](http://foundation.zurb.com/sites/docs/flex-grid.html) and [Ionicons](http://ionicons.com/) here):
```html
<div class="row align-center align-middle share">
   <div class="column x-small-12 small-3 share-info">
      <div class="row">
         <div class="column x-small-6 small-12 share-info-count">
            <span class="ion ion-spin ion-load-c"></span> <!-- This will be replaced by share counts --> 
         </div>
         
         <div class="column x-small-6 small-12 share-info-text">
            Shares
         </div>
      </div>
   </div>
   
   <ul class="column x-small-12 small-9 share-sharer">
      <li>
         <a data-platform="facebook" href="https://www.facebook.com/sharer/sharer.php?u={{url}}" target="_blank" title="Share on Facebook">
            <span class="ion ion-social-facebook"></span> <span>facebook</span>
         </a>
      </li>
      
      <li>
         <a data-platform="twitter" href="https://twitter.com/intent/tweet?url={{url}}" target="_blank" title="Tweet">
            <span class="ion ion-social-twitter"></span> <span>twitter</span>
         </a>
      </li>
      
      <li>
         <a data-platform="googleplus" href="https://plus.google.com/share?url={{url}}" target="_blank" title="Share on Google+">
            <span class="ion ion-social-googleplus"></span> <span>google+</span>
         </a>
      </li>
      
      <li>
         <a data-platform="pinterest" href="https://pinterest.com/pin/create/button/?url={{url}}&media={{media}}&description={{description}}" target="_blank" title="Pin it">
            <span class="ion ion-social-pinterest"></span> <span>pinterest</span>
         </a>
      </li>
      
      <li>
         <a data-platform="linkedin" href="https://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{description}}&source=" target="_blank" title="Share on LinkedIn">
            <span class="ion ion-social-linkedin"></span> <span>linkedin</span>
         </a>
      </li>
   </ul>
</div>
```
<br>
<br>
(3) Add hooks to social media you wish to include. You can write them yourself or simply include `platform.js` in your js file:
```javascript
semproelShare.mediaPlatform.facebook = function() {
   this.urlSharer = "https://www.facebook.com/sharer/sharer.php?u={{url}}";
   this.urlCountGetter = "http://graph.facebook.com/?id=";
   this.wait = 500;
   this.success = function(response) {
      if (response.shares !== undefined) {
         this.facebook = response.shares;
         return response.shares;
      } else {
         this.facebook = 0;
         return 0;
      }
   };
};

semproelShare.mediaPlatform.twitter = function() {
   this.urlSharer = "https://twitter.com/intent/tweet?url={{url}}";
   this.urlCountGetter = "http://public.newsharecounts.com/count.json?url=";
   this.wait = 5000;
   this.success = function(response) {
      if (response.count !== undefined) {
         this.twitter = response.count;
         return response.count;
      } else {
         this.twitter = 0;
         return 0;
      }
   };
};

semproelShare.mediaPlatform.googleplus = function() {
   this.urlSharer = "https://plus.google.com/share?url={{url}}";
   this.urlCountGetter = "https://share.yandex.ru/gpp.xml?url=";
   this.wait = 5000;
   this.success = function(response) {
      if (!isNaN(response)) {
         this.googleplus = Number(response);
         return Number(response);
      } else {
         this.googleplus = 0;
         return 0;
      }
   };
};

semproelShare.mediaPlatform.pinterest = function() {
   this.urlSharer = "https://pinterest.com/pin/create/button/?url={{url}}&media={{media}}&description={{description}}";
   this.urlCountGetter = "http://api.pinterest.com/v1/urls/count.json?url=";
   this.wait = 750;
   this.success = function(response) {
      if (response.count !== undefined) {
         this.pinterest = response.count;
         return response.count;
      } else {
         this.pinterest = 0;
         return 0;
      }
   };
};

semproelShare.mediaPlatform.linkedin = function() {
   this.urlSharer = "https://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{description}}&source=";
   this.urlCountGetter = "https://www.linkedin.com/countserv/count/share?url=";
   this.wait = 750;
   this.success = function(response) {
      if (response.count !== undefined) {
         this.linkedin = response.count;
         return response.count;
      } else {
         this.linkedin = 0;
         return 0;
      }
   };
};
```
<br>
<br>
(4) Call the function:
```javascript
var pageHeadRef = doc.head,
    currentPageUri = pageHeadRef.querySelector("[rel=canonical]").href, // You can get this anywhere from your site, the main point it is a string.
    currentPageTitle = pageHeadRef.querySelector("title").textContent, // You can get this anywhere from your site, the main point it is a string.
    currentPageDescription = pageHeadRef.querySelector("[name=description]").content,
    currentPageFeaturedMedia = ""; // Image or video url string, mostly image, just give an empty string if you don't wish

semproelShare({
   share: ".share", // Required & CSS Selector
   shareCount: ".share-info-count", // Required & CSS Selector
   sharePlatform: "data-platform", // Required & 'data-*' Attribute
   shareButtonContainer: ".share-sharer", // Required & CSS Selector
   pageUrl: currentPageUri, // Optional & String --> degrades to 'document.URL' (But, better provided!)
   pageTitle: currentPageTitle, // Optional & String --> degrades to 'document.title'
   pageDescription: currentPageDescription, // Optional & String --> degrades to your page meta description, if still not found --> "" (empty string/text)
   pageMedia: currentPageFeaturedMedia // Optional & String --> degrades to "" (empty string/text, meaning no media at all)
});
```
<br>
<br>
(5) Polish:
```css
.share {
   margin-bottom: 2rem;
}

.share-info {
   text-align: center;
}

.share-sharer > li {
   display: inline-block;
   margin-top: 0.15rem;
   margin-bottom: 0.15rem;
   padding: 0.15rem 0.75rem;
   border-radius: 2px;
}

.share-sharer > li:nth-child(1) {
   background-color: #3b5998;
}

.share-sharer > li:nth-child(2) {
   background-color: #00aced;
}

.share-sharer > li:nth-child(3) {
   background-color: #dd4b39;
}

.share-sharer > li:nth-child(4) {
   background-color: #cb2027;
}

.share-sharer > li:nth-child(5) {
   background-color: #007bb6;
}

.share-sharer > li > a > span:first-child {
   font-size: 0.85rem;
   line-height: 1.8;
   padding-right: 0.15rem;
}

.share-sharer > li > a > span:last-child {
   font-size: 0.85rem;
   font-weight: bold;
}

.share-sharer > li > a:link, .share-sharer > li > a:visited {
   color: #f2f2f2;
}
```

## Documentation
More on documentation [here](http://semproelshare.com/documentation).

## Browser Support
As long as you polyfill javascript Promise, the modern browser support for both mobile and desktop (IE 9+) should be okay.

## MIT License
Copyright (c) 2016 Atok Fakhrudin
