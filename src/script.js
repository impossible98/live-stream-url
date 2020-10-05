let dp = new DPlayer({
	autoplay: true,
	container: document.getElementById('dplayer'),
	video: {
		url: 'https://txdirect.hls.huya.com/huyalive/1374256723-1374256723-5902387681593131008-2748636902-10057-A-0-1.m3u8?wsSecret=5b6ec48a3709ad56d05b7285f42da801&wsTime=5f7c054f&u=0&seqid=16018769436960000&ctype=tars_mobile&fs=bgct&t=103',
	},
});


function myFunction() {
	let txt = document.getElementById('roomId').innerHTML;

	return txt;
}