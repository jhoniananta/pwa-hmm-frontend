if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + '.js', i).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, n) => {
    const t =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (s[t]) return;
    let o = {};
    const c = (e) => a(e, t),
      r = { module: { uri: t }, exports: o, require: c };
    s[t] = Promise.all(i.map((e) => r[e] || c(e))).then((e) => (n(...e), o));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: '682e0a6fe2a660dbeff1152640b4d9a9',
        },
        {
          url: '/_next/static/1mo1HfVvUdvXxHa8ipDoh/_buildManifest.js',
          revision: '1a67675fa8ed72fb36fcab19351e77f8',
        },
        {
          url: '/_next/static/1mo1HfVvUdvXxHa8ipDoh/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/0e5ce63c-189180ba8135004c.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/1617-8a4a5e65cdff2968.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/23-f3c05a53f5f10a1c.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/231-2d76799671e0bb16.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/2676-d88b8ff90a780a5f.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/3-6f53655ec75bb1a3.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/30a37ab2-d30f7545d6af518a.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/3457-41db3163af513f6f.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/4149-3da31c3770738838.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/4328-217d6001d2e7d89e.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/4653-e3069631f95b5253.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/4677-ff33bdb2772414cb.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/4868-ef6e598948ef4790.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/4913-26418dce259398a2.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/5510-e3c19c1deb1b5def.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/5836-fc5c230a6885e0d3.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/5951-ae3cebe9cee7d818.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/59650de3-ec6b2f5b7a441354.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/6014-2bc9c90ad9b5a715.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/6405-c158ad14bf647eac.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/697-eae33a36b59f014a.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/7023-d77297883fe69999.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/7067-4adcc111e32c07aa.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/7071-0ecb69d3acdfad30.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/7647-6697a723ba05661a.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/7656-41a2936093e63ebc.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/795d4814-232e57521f566e0a.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/8173-6ee4187b6e27e83d.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/843-45374ee39c779c3e.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/9384-f29b0d29b6279229.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/94730671-41d3b42d2b7d5be8.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/9535-d532d5168bb63a19.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/9586-44353f1292d65cd7.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/assignments/page-a33cae43fc8cf030.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/courses/%5Bid%5D/page-3bb19ea2199a9016.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/courses/page-8139cc2706d68e87.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/dashboard/page-773ec5de035929e0.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/hmm-store/page-6534e3a0f332b4ec.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/layout-b653cab5723b98e4.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/mycareer/page-2a1d4bd247f2eba4.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/myhmm/page-a23f3eb4610d661f.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/profile/@modal/%5B...catchAll%5D/page-11b4e4ec0b793d83.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/profile/@modal/(.)edit/page-f426232db405d707.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/profile/@modal/default-21dfe284f764f7ba.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/profile/edit/page-2c972f54fc817a83.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/profile/layout-aafa05480342da93.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/profile/page-e928886b0fef5c13.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/scholarships/%5Bid%5D/page-6d727fac98b0923e.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/scholarships/page-17e6cfb9ddbdfd53.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/(with-aside)/template-6f8cac959cba7a6e.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-4b255314ccfd6118.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/error-a52ada0d8ee0380f.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/layout-85ee78a6836d55a2.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/loading-6b68663c7c87ed14.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/not-found-7819a72d17b87aeb.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/page-d3dceec01c0e1bf2.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/assignments/add/page-0ac7427a2b0f9bcb.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/assignments/edit/%5BcourseId%5D/%5BclassId%5D/%5Bid%5D/page-ad91a2635b0bf8de.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/assignments/page-e184a8b2099e5b46.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/classes/add/page-849156f4ee486487.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/classes/edit/%5BclassId%5D/page-751ee708383fe74f.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/classes/page-21fee1015285b930.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/lessons/add/page-dcd72ae0cde020a1.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/lessons/edit/%5BlessonId%5D/page-237bc1249777783c.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/lessons/page-03f3cc441562c41e.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/schedules/add/page-3f2248b380483bd0.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/schedules/edit/%5BscheduleId%5D/page-4058056c4798ae8a.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/%5BcourseId%5D/schedules/page-98ce6e171db0f5fc.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/add/page-021b65754d3dc6e8.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/edit/%5Bid%5D/page-2bd88f6fc15bddc2.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/courses/page-29681efe465709bc.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/hmm-store/page-ae1fcf6067e2b6a0.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/layout-904927603625c574.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/scholarships/add/page-d44e4f7b189f511c.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/scholarships/edit/%5Bid%5D/page-94d4d8ae47c7ae71.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/scholarships/page-f4584762224b059a.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/(with-aside)/template-518cff0213f98701.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/portal/admin/page-bcb2209932644294.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/sign-in/page-9879c524c314b3ed.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/sign-out/page-2b6b641f1e240fb3.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/app/sign-up/page-94e02f54ee63658a.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/e34aaff9-d2ca039085ffed52.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/ee560e2c-915f6d2adf35b365.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/f25cdb8d-345edcf08c26fb90.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/fd9d1056-33e17457fc1d0d57.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/framework-8e0e0f4a6b83a956.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/main-app-5986595d36ebec9b.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/main-d4255cac0bd2d534.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/pages/_app-f870474a17b7f2fd.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-be66f4e976aacb22.js',
          revision: '1mo1HfVvUdvXxHa8ipDoh',
        },
        {
          url: '/_next/static/css/940b7c679a3be2b2.css',
          revision: '940b7c679a3be2b2',
        },
        {
          url: '/_next/static/media/0484562807a97172-s.p.woff2',
          revision: 'b550bca8934bd86812d1f5e28c9cc1de',
        },
        {
          url: '/_next/static/media/0a03a6d30c07af2e-s.woff2',
          revision: '79da53ebaf3308c806394df4882b343d',
        },
        {
          url: '/_next/static/media/30cd8f99d32fa6e8-s.woff2',
          revision: 'e5c1b944d9e3380a062bf911e26728a3',
        },
        {
          url: '/_next/static/media/46c21389e888bf13-s.woff2',
          revision: '272930c09ba14c81bb294be1fe18b049',
        },
        {
          url: '/_next/static/media/8888a3826f4a3af4-s.p.woff2',
          revision: '792477d09826b11d1e5a611162c9797a',
        },
        {
          url: '/_next/static/media/b957ea75a84b6ea7-s.p.woff2',
          revision: '0bd523f6049956faaf43c254a719d06a',
        },
        {
          url: '/_next/static/media/eafabf029ad39a43-s.p.woff2',
          revision: '43751174b6b810eb169101a20d8c26f8',
        },
        {
          url: '/_next/static/media/f5767adec246cdc1-s.woff2',
          revision: '7a1c6501aa2b3327c1cf556362a851cb',
        },
        { url: '/beasiswa.jpg', revision: '532e6489693b52b2b94a6fb3aeee7b49' },
        { url: '/blur.jpg', revision: '1ff4236622b27fb1242c128432834ce6' },
        {
          url: '/hmm-vstock/bp-black-transparent.png',
          revision: '6b40212b2d8aeeaa98c12d7dbe473701',
        },
        {
          url: '/hmm-vstock/bp-nonstransparent.png',
          revision: 'a833fcaaf669d458ee0916be9f28d8c9',
        },
        {
          url: '/hmm-vstock/bp-pi-nontransparent.png',
          revision: 'e328d7064675b190aa8b0f2a561e3613',
        },
        {
          url: '/hmm-vstock/bp-white-transparent.png',
          revision: '6b0db0a7b916a7e5d0cc1e848660e306',
        },
        {
          url: '/hmm-vstock/bp.ai',
          revision: '99ba17e3b2b7eb2a6123f7235703eeaa',
        },
        {
          url: '/hmm-vstock/hmm-new.png',
          revision: 'b22e6b8fc696fbbf8cf7f881742e7b46',
        },
        {
          url: '/hmm-vstock/itb.png',
          revision: 'ebfc4c9bd551e275820e00ffc3ecc7f9',
        },
        {
          url: '/hmm-vstock/m-hmm-landscpae.jpg',
          revision: 'd2d40a77f2665baa6fa07f66186e9823',
        },
        {
          url: '/hmm-vstock/m-hmm-potrait.jpg',
          revision: '6d6c9f9f6cfe32233dd790fad2e8d3bc',
        },
        {
          url: '/hmm-vstock/m.png',
          revision: '35c0d0ab08231429aedfac984cff82c7',
        },
        {
          url: '/hmm-vstock/radio-mesin-black.png',
          revision: '3bd4984c38d7f9b75dd68e9416e553b0',
        },
        {
          url: '/hmm-vstock/radio-mesin-red-black.png',
          revision: '278ab98b1c451077e79f8d423042ce3a',
        },
        {
          url: '/hmm-vstock/radio-mesin-white-red.png',
          revision: '6780c941ce616c31f8f4f6160f217b28',
        },
        {
          url: '/hmm-vstock/radio-mesin-white.png',
          revision: 'b1a59ff9d9a36433456e21a04e3b333f',
        },
        {
          url: '/icons/icon-192x192.png',
          revision: 'e3def96968bb5953a58149eb3d869fde',
        },
        {
          url: '/icons/icon-512x512.png',
          revision: '1f8ba8e975f16075a9d061f6d69493b3',
        },
        {
          url: '/icons/logo.png',
          revision: 'b22e6b8fc696fbbf8cf7f881742e7b46',
        },
        {
          url: '/images/berita.png',
          revision: '4d47a6fbabf78152b3acc9ee5715ef48',
        },
        {
          url: '/images/circle-user.svg',
          revision: 'c132a14d73ac4e2e533fd0aa898294bd',
        },
        {
          url: '/images/logo.png',
          revision: 'b22e6b8fc696fbbf8cf7f881742e7b46',
        },
        {
          url: '/images/mesin.png',
          revision: '7098e333465f79c3e8837c7c3cb71aaa',
        },
        {
          url: '/images/pengukuran.png',
          revision: 'e709f5f89ac82271773de9433ab5fe56',
        },
        {
          url: '/images/pipe_system.png',
          revision: 'a32283917158d6a55a0ffbab36919c7e',
        },
        {
          url: '/images/printer.png',
          revision: 'dd7658d58dc096815598b7eff02a255f',
        },
        {
          url: '/images/store.png',
          revision: '1b993cc9ccbf3849dcb7e2dc678cd517',
        },
        { url: '/manifest.json', revision: '3587df54ebfc689fca32db7b70ab77c9' },
        { url: '/offline.html', revision: '4c3e08634587ff688b7f45e12f6a1eb9' },
        {
          url: '/screenshots/desktop.png',
          revision: 'fcab64c6a89170da05b6b2793f1620a8',
        },
        {
          url: '/screenshots/mobile.png',
          revision: '228160361ff8d2ae20aeb56bb587474b',
        },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: i,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET'
    );
});
