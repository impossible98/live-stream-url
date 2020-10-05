const crypto = require('crypto');
const https = require('https');

function getRealUrl() {
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Mobile Safari/537.36 '
        },
        hostname: 'm.huya.com',
        path: '/' + '764680'
    }


    const req = https.request(options, (res) => {
        res.setEncoding('utf-8');
        data = ''

        res.on('data', (chunk) => {
            data += chunk
        })

        res.on('end', () => {
            let liveLineUrl = data.match(/liveLineUrl = "[\s\S]*?";/g);
            if (liveLineUrl) {
                liveLineUrl = liveLineUrl[0]
                liveLineUrl = liveLineUrl.replace('liveLineUrl = "', '').replace('";', '');
                if (liveLineUrl.includes('replay')) {
                    let realUrl = {
                        'replay': 'https:' + liveLineUrl
                    }
                    console.log(realUrl);
                    return realUrl;
                } else {
                    let sUrl = live(liveLineUrl);
                    let bUrl = live(liveLineUrl.replace('_2000', ''))
                    let realUrl = {
                        '2000p': "https:" + sUrl,
                        'tx': "https:" + bUrl,
                        'bd': "https:" + bUrl.replace('tx.hls.huya.com', 'bd.hls.huya.com'),
                        'migu-bd': "https:" + bUrl.replace('tx.hls.huya.com', 'migu-bd.hls.huya.com'),
                    }
                    console.log(realUrl);
                    return realUrl
                }
            }

        });

    });

    req.on('error', (error) => {
        console.log(error.message);
    });
    req.end();
}

function live(e) {
    let [i, b] = e.split('?');
    let r = i.split('/');
    let s = r[r.length - 1].replace(/.m3u8/g, '');
    let c = b.split('&');
    let n = {};
    for (let i in c) {
        n[c[i].split('=')[0]] = c[i].split('=')[1];
    }
    let fm = decodeURIComponent(n['fm']);
    let u = Buffer.from(fm, 'base64').toString('ascii');
    let p = u.split('_')[0];
    let f = Date.now() * 1e4;
    let ll = n['wsTime'];
    let t = '0';
    let h = p.concat('_', t, '_', s, '_', f, '_', ll);
    const hash = crypto.createHash('md5');
    hash.update(h);
    let m = hash.digest('hex');
    let url = `${i}?wsSecret=${m}&wsTime=${ll}&u=${t}&seqid=${f}&ctype=${n['ctype']}&fs=${n['fs']}&t=${n['t']}`;
    return url;
}

getRealUrl();
