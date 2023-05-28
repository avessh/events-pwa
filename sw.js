
const staticCacheName = 'site-static'
const dynamicCacheName = 'site-static-v1'
const assets = [
   
    './index.html',
    './js/app.js',
    './sw.js',
    './pages/fallback.html'

]

const limitCacheSize = (name,size) => {
    caches.open(name).then(cache => {
        cache.key().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name , size))
            }
        })
    })
}

self.addEventListener('install' , (evt => {

    // console.log('service worker has been installed');
    evt.waitUntil( caches.open(staticCacheName).then(cache => {
        console.log('caching all assests');
        cache.addAll(assets)
    }))
   
}))

self.addEventListener('activate' , (evt => {
    // console.log('service worker is activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys);
            return  Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName ))
                .map(key => caches.delete(key))
        })
    )
}))

self.addEventListener('fetch' , evt => {
    // console.log('fetch events' , evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
             return cacheRes || fetch(evt.request).then(fetchRes => {
                 return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url , fetchRes.clone())
                    limitCacheSize(dynamicCacheName ,15)
                    return fetchRes
                 })
             })
        }).catch(() => {
            if(evt.request.url.indexOf('.html') > -1){
                return caches.match('./pages/fallback.html')
            }
          
        })
    )
})