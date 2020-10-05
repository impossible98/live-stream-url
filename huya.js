const crypto = require('crypto');
const https = require('https');


class Huya {
    constructor(rid) {
        this.rid = rid;
    }

    request() {
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Mobile Safari/537.36 '
            },
            hostname: 'm.huya.com',
            path: '/' + this.rid
        }
        let req = https.request(options, (res) => {
            res.setEncoding("utf-8");
            res.on('data', (chunk) => {
                let response = chunk.toString();
                let livelineurl = response.match(/liveLineUrl = "([\s\S]*?)";/g);
                console.log(livelineurl);
                if (livelineurl !== null) {
                    let livelineurl = response.match(/liveLineUrl = "([\s\S]*?)";/g)[0];
                    if (livelineurl) {
                        if (livelineurl.match('replay')) {
                            let real_url = {
                                'replay': "https:" + livelineurl,
                            }
                            console.log('a');
                            return real_url;

                        } else {
                            let s_url = this.live(livelineurl);
                            let b_url = this.live(livelineurl.replace('_2000', ''));
                            let real_url = {
                                '2000p': 'https:' + s_url,
                                'tx': 'https:' + b_url,
                                'bd': 'https:' + b_url.replace('tx.hls.huya.com', 'bd.hls.huya.com'),
                                'migu-bd': 'https:' + b_url.replace('tx.hls.huya.com', 'migu-bd.hls.huya.com'),
                            }
                            console.log('b');
                            return real_url;

                        }

                    }
                }
            });
        });
        req.on("error", (error) => {
            console.log(error.message);
        });
        req.end();
    }


    static live(e) {
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
        // m = hashlib.md5(h.encode('utf-8')).hexdigest()
        const hash = crypto.createHash('md5');
        hash.update(h);
        let m = hash.digest('hex');
        let url = `${i}?wsSecret=${m}&wsTime=${ll}&u=${t}&seqid=${f}&ctype=${n['ctype']}&fs=${n['fs']}&t=${n['t']}`;
        return url;
    }
}


function main() {
    huya = new Huya('eric1998');
    console.log(huya.request());
}

main();