/* semproelShare : A Pure Javascript Share Plugin. MIT - Copyright (c) 2016 Atok Fakhrudin */
(function(global, kitchen) {
   "use strict";
   
   global.semproelShare = kitchen(global);
   
}(window, function(WIN) {
   "use strict";
   
   var semproelShareText = "semproelShare(): ",
       DOC = document,
       platformKitchen = {},
       platformPreciseCount = {},
       totalPreciseCount, paltformAttributeIndicator, hostElementForCountInfo,
       
       abbreWithPoint = function(s, i, n, g, o) {
          this[1].innerHTML = this[0].slice(s, i) + "." + this[0].slice(n, g) + o;
       },
       
       abbreNoPoint = function(a, s, u) {
          this[1].innerHTML = this[0].slice(a, s) + u;
       },
       
       asIs = function(nulledValue) {
          this[1].innerHTML = this[0];
       },
       
       countAppearanceDeterminer = {
          4: { functn: abbreWithPoint, argmnt: [0, 1, 1, 2, "k"] },
          5: { functn: abbreWithPoint, argmnt: [0, 2, 2, 3, "k"] },
          6: { functn: abbreNoPoint, argmnt: [0, 3, "k"] },
          7: { functn: abbreWithPoint, argmnt: [0, 1, 1, 2, "m"] },
          8: { functn: abbreWithPoint, argmnt: [0, 2, 2, 3, "m"] },
          9: { functn: abbreNoPoint, argmnt: [0, 3, "m"] },
          10: { functn: abbreWithPoint, argmnt: [0, 1, 1, 2, "g"] },
          deflt: { functn: asIs, argmnt: [null] }
       };
       
   function createInjectedScriptForJsonp(url, callbackName) {
      var injectedScript = DOC.createElement('script');
      
      injectedScript.async = true;
      injectedScript.src = url + callbackName;
      
      return injectedScript;
   }
   
   function clearInjectedScriptForJsonp(root, callbackName, htmlBody, injectedScript) {
      root[callbackName] = null;
      delete root[callbackName];
      htmlBody.removeChild(injectedScript);
      injectedScript = null;
   }
   
   function fetchJsonp(url) {
      return new Promise(function(resolve, reject) {
         var root = WIN, htmlBody = DOC.body,
             callbackName = 'kolbek' + Math.round(100000 * Math.random()),
             injectedScript = createInjectedScriptForJsonp(url, callbackName);
      
         root[callbackName] = function(data) {
            resolve(data);
         };
          
         injectedScript.onerror = function() {
            reject("Network error! Either you lost connection to the server before the data is received or error was occuring in the origin server of " + url);
            clearInjectedScriptForJsonp(root, callbackName, htmlBody, injectedScript);
         };
       
         injectedScript.onload = function() {
            clearInjectedScriptForJsonp(root, callbackName, htmlBody, injectedScript);
         };
       
         htmlBody.appendChild(injectedScript);
      });
   }
   
   function popCenteredWindow(param, root, doc) {
      var dualScreenLeft = root.screenX || root.screenLeft,
          dualScreenTop = root.screenY || root.screenTop,
          currentBrowserWidth = root.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
          currentBrowserHeight = root.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight,
          left = ((currentBrowserWidth / 2) - (param.popupWidth / 2)) + dualScreenLeft,
          top = ((currentBrowserHeight / 2) - (param.popupHeight / 2)) + dualScreenTop;
       
      var popWindow = root.open(param.url, param.title, "width=" + param.popupWidth + ",height=" + param.popupHeight + ",top=" + top + ",left=" + left + ",titlebar=yes,toolbar=no,menubar=no,location=yes,resizable=no,scrollbars=yes,status=yes");
      
      if (root.focus) {
         popWindow.focus();
      }
      
      return popWindow;
   }
   
   function executeClickShare(clickedPlatform, pK) {
      var root = WIN, doc = DOC,
          popupWindow = popCenteredWindow({
                           url: pK[clickedPlatform].urlSharer,
                           title: "Share on " + clickedPlatform,
                           popupWidth: 750,
                           popupHeight: 450
                        }, root, doc),
          isPopupWindowClosed,
          // Ofcourse, we need to store this in var first, because the value will change when we need this current value
          currentClickedPlatformCount = platformPreciseCount[clickedPlatform];
        
      isPopupWindowClosed = root.setInterval(function() {
         if (popupWindow.closed === true) {
            root.clearInterval(isPopupWindowClosed);
            root.setTimeout(function() {
               fetchJsonp(pK[clickedPlatform].urlCountGetter).then(pK[clickedPlatform].success.bind(platformPreciseCount)).then(
                  function(responseCount) {
                     totalPreciseCount = (totalPreciseCount - currentClickedPlatformCount) + responseCount;
                     determineShareCountAppearance(totalPreciseCount.toString(), hostElementForCountInfo, countAppearanceDeterminer);
                  },
                
                  function(error) {
                     throw new Error(semproelShareText + "\"Fetching " + clickedPlatform + " count error! Reason: " + error + "\"");
                  }
               );
            }, pK[clickedPlatform].wait || 0);
         }
      }, 250);
   }
       
   /*
    * the param just exactly as written below when called
    *
    * param: {
    *    platformKitchen: platformKitchen,
    *    sharePlatform: param.sharePlatform,
    *    perPlatformCount: platformPreciseCount
    * }
    */
   function fetchUnifiedCount(param) {
      var promiseOfShareCount = [],
          platform = param.platformKitchen,
          perPlatformCount = param.perPlatformCount;
      
      param.sharePlatform.forEach(function(v, i) {
         promiseOfShareCount[i] = fetchJsonp(platform[v].urlCountGetter).then(platform[v].success.bind(perPlatformCount), function(error) {
               console.log(Error(semproelShareText + "\"Fetching " + v + " count error! Reason: " + error + "\""));
               return 0;
         });
      });
      
      return promiseOfShareCount;
   }

   // appearanceDeterminer = countAppearanceDeterminer
   function determineShareCountAppearance(stringifiedTotalCount, hostElementForCount, appearanceDeterminer) {
      var t = appearanceDeterminer[stringifiedTotalCount.length] || appearanceDeterminer.deflt;
      
      t.functn.apply(arguments, t.argmnt);
   }
   
   function respondClickShare(e) {
      var clickTarget;
      
      e.preventDefault();
      clickTarget = e.target;
      
      if (clickTarget.hasAttribute(paltformAttributeIndicator)) {
         executeClickShare(clickTarget.getAttribute(paltformAttributeIndicator), platformKitchen);
      } else if (clickTarget.parentNode.hasAttribute(paltformAttributeIndicator)) {
         executeClickShare(clickTarget.parentNode.getAttribute(paltformAttributeIndicator), platformKitchen);
      }
      
      e.stopPropagation();
   }

   function semproelShare(param) {
      var requiredParam = ["share", "shareCount", "sharePlatform", "shareButtonContainer"],
          i = requiredParam.length;
          
      for ( ; i--; ) {
         if (param[ requiredParam[i] ] === undefined || typeof param[ requiredParam[i] ]  !== "string") {
            throw new Error(semproelShareText + "\"You are either missing required one object key (among these: \"share\", \"shareCount\", \"sharePlatform\", \"shareButtonContainer\") in your parameter or giving it a wrong type (while it must be a string). Please refer to the documentation.\"");
         }
      }
      
      if (!(/^data-(?:[a-z]+-?)*(?:[a-z]+$)/.test(param.sharePlatform))) {
         throw new Error("Your 'data-*' attribute for sharePlatform object key must follow this pattern (using all lowercase letters with no numbers): data-younamethis-or-and-with-this");
      }
      
      var doc = DOC;
      
      param.pageUrl = param.pageUrl || doc.URL;
      param.pageTitle = param.pageTitle || doc.title;
      param.pageDescription = param.pageDescription || doc.head.querySelector("[name=description]").content || "";
      param.pageMedia = param.pageMedia || "";
      param.share = doc.querySelector(param.share);
      param.shareCount = param.share.querySelector(param.shareCount);
      paltformAttributeIndicator = param.sharePlatform;
      param.sharePlatform = (function(par) {
                              var chosenPlatform = par.share.querySelectorAll("[" + par.sharePlatform + "]"),
                                  i = chosenPlatform.length, platformList = [], root = WIN, pK = platformKitchen, currentEncodedUri;
                              
                              for ( ; i--; ) {
                                 platformList[i] = chosenPlatform[i].getAttribute(par.sharePlatform);
                                 
                                 if (semproelShare.mediaPlatform[platformList[i]] !== undefined && typeof semproelShare.mediaPlatform[platformList[i]] === "function") {
                                    currentEncodedUri = root.encodeURI(par.pageUrl);
                                    pK[platformList[i]] = new semproelShare.mediaPlatform[platformList[i]]();
                                    pK[platformList[i]].urlSharer = pK[platformList[i]].urlSharer.replace("{{url}}", currentEncodedUri).replace("{{title}}", root.encodeURIComponent(par.pageTitle)).replace("{{description}}", root.encodeURIComponent(par.pageDescription)).replace("{{media}}", root.encodeURI(par.pageMedia));
                                    pK[platformList[i]].urlCountGetter += currentEncodedUri + "&callback=";
                                 } else {
                                    throw new Error(semproelShareText + "One of your hook at \"semproelShare.mediaPlatform.yourSocialMediaHook\" is not available among values of \"" + paltformAttributeIndicator + "\". They should not duplicate (only one at hook and only one becomes the value of " + paltformAttributeIndicator + ") and should correlate equally (i.e. be the same). For instance if at semproelShare.mediaPlatform hook is \"semproelShare.mediaPlatform.facebook\", then at " + paltformAttributeIndicator + " should look like \"" + paltformAttributeIndicator + "='facebook'\". Another case, it may not be a function, while it should be.");
                                 }
                              }
                              
                              return platformList;
                           }(param));
      param.shareButtonContainer = param.share.querySelector(param.shareButtonContainer);
      
      if (param.share === null || param.shareCount === null || param.sharePlatform.length === 0 || param.shareButtonContainer === null) {
         throw new Error(semproelShareText + "\"Your CSS selector for one of these parameter {param.share, param.shareCount, param.sharePlatform, param.shareButtonContainer} does not match.\"");
      }
      
      function initiateUnifiedCountFetch() {
         Promise.all(fetchUnifiedCount({
            platformKitchen: platformKitchen,
            sharePlatform: param.sharePlatform,
            perPlatformCount: platformPreciseCount
         })).then(function(response) {
            totalPreciseCount = response.reduce(function(a, b) {
               return a + b;
            });
            determineShareCountAppearance(totalPreciseCount.toString(), param.shareCount, countAppearanceDeterminer);
            WIN.removeEventListener("load", initiateUnifiedCountFetch);
         })["catch"](function(error) {
            WIN.removeEventListener("load", initiateUnifiedCountFetch);
            throw new Error(semproelShareText + error);
         });
      }
      
      hostElementForCountInfo = param.shareCount;
      WIN.addEventListener("load", initiateUnifiedCountFetch);
      param.shareButtonContainer.addEventListener("click", respondClickShare, false);
   }
   
   semproelShare.mediaPlatform = {};
   
   return semproelShare;
}));
