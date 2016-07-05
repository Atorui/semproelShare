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
       
       fetchJsonp = (function(root, doc, htmlBody) {
          function createInjectedScript(url, callbackName) {
             var injectedScript = doc.createElement('script');
             
             injectedScript.async = true;
             injectedScript.src = url + callbackName;
             
             return injectedScript;
          }
          
          return function(url) {
             return new Promise(function(resolve, reject) {
                var callbackName = 'kolbek' + Math.round(100000 * Math.random()),
                    injectedScript = createInjectedScript(url, callbackName);
               
                root[callbackName] = function(data) {
                   resolve(data);
                };
                   
                injectedScript.onerror = function() {
                   reject("Network error! Either you lost connection to the server before the data is received or error was occuring in the origin server of " + url);
                   // Here also need to be cleaned up
                   root[callbackName] = null;
                   delete root[callbackName];
                   htmlBody.removeChild(injectedScript);
                   injectedScript = null;
                };
                
                injectedScript.onload = function() {
                   root[callbackName] = null;
                   delete root[callbackName];
                   htmlBody.removeChild(injectedScript);
                   injectedScript = null;
                };
                
                htmlBody.appendChild(injectedScript);
             });
          };
       }(WIN, DOC, DOC.body)),
       
       executeClickShare = (function(root, doc) {
          // Credits: http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html with trivial modification
          // param {url, title, popupWidth, popupHeight}
          function popCenteredWindow(param) {
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
          
          // pK = platformKitchen
          return function(clickedPlatform, pK) {
             var popupWindow = popCenteredWindow({
                                  url: pK[clickedPlatform].urlSharer, // sementara
                                  title: "Share on " + clickedPlatform,
                                  popupWidth: 750,
                                  popupHeight: 450
                               }),
                 isPopupWindowClosed,
                 currentClickedPlatformCount = platformPreciseCount[clickedPlatform];
                 
             isPopupWindowClosed = root.setInterval(function() {
                if (popupWindow.closed === true) {
                   root.clearInterval(isPopupWindowClosed);
                   root.setTimeout(function() {
                      fetchJsonp(pK[clickedPlatform].urlCountGetter).then(pK[clickedPlatform].success.bind(platformPreciseCount)).then(
                         function(responseCount) {
                            console.log("Success fetching individual count exec");
                            totalPreciseCount = (totalPreciseCount - currentClickedPlatformCount) + responseCount;
                            determineShareCountAppearance(totalPreciseCount.toString(), hostElementForCountInfo);
                         },
                         
                         function(error) {
                            throw new Error(semproelShareText + "\"Fetching " + v + " count error! Reason: " + error + "\"");
                         }
                      );
                   }, pK[clickedPlatform].wait || 0);
                }
             }, 250);
          };
       }(WIN, DOC));
       
   /*
    | the param just exactly as written below when called
    |
    | param: {
    |    platformKitchen: platformKitchen,
    |    sharePlatform: param.sharePlatform,
    |    perPlatformCount: platformPreciseCount
    | }
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

   function determineShareCountAppearance(stringifiedTotalCount, hostElementForCount) {
      switch (stringifiedTotalCount.length) {
         case 4:
            hostElementForCount.innerHTML = stringifiedTotalCount.slice(0, 1) + "." + stringifiedTotalCount.slice(1, 2) + "k";
            break;
         
         case 5:
            hostElementForCount.innerHTML = stringifiedTotalCount.slice(0, 2) + "." + stringifiedTotalCount.slice(2, 3) + "k";
            break;
         
         case 6:
            hostElementForCount.innerHTML = stringifiedTotalCount.slice(0, 3) + "k";
            break;
            
         case 7:
            hostElementForCount.innerHTML = stringifiedTotalCount.slice(0, 1) + "." + stringifiedTotalCount.slice(1, 2) + "m";
            break;
            
         case 8:
            hostElementForCount.innerHTML = stringifiedTotalCount.slice(0, 2) + "." + stringifiedTotalCount.slice(2, 3) + "m";
            break;
         
         case 9:
            hostElementForCount.innerHTML = stringifiedTotalCount.slice(0, 3) + "m";
            break;
            
         case 10:
            hostElementForCount.innerHTML = stringifiedTotalCount.slice(0, 1) + "." + stringifiedTotalCount.slice(1, 2) + "g";
            break;
         
         default:
            hostElementForCount.innerHTML = stringifiedTotalCount;
      }
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
      if (arguments.length < 1) {
         throw new Error(semproelShareText + "\"You are missing a parameter. Please check the documentation.\"");
      }
      
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
                                    throw new Error(semproelShareText + "One of your hook at \"semproelShare.mediaPlatform.yourSocialMediaHook\" is not available among values of \"" + paltformAttributeIndicator + "\". They should not duplicate (only one at hook and only one becomes the value of " + paltformAttributeIndicator+ ") and should correlate equally (i.e. be the same). For instance if at semproelShare.mediaPlatform hook is \"semproelShare.mediaPlatform.facebook\", then at " + paltformAttributeIndicator + " should look like \"" + paltformAttributeIndicator + "='facebook'\".");
                                 }
                              }
                              
                              return platformList;
                           }(param)),
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
            determineShareCountAppearance(totalPreciseCount.toString(), param.shareCount);
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
