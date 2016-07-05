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
