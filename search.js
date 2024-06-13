//JSFILE
var On = false;
var target;
var reloadCounter = 0;
var tripCounter = 0;
var Csalt = [46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46.46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46];
function UnkoTripFinderMain(target, speed) {
    console.log(target, speed);
    let len = target.length;
    function encode_utf8(s) {
        return unescape(encodeURIComponent(s));
    }
    function toArray(utf8) {
        var arr = [];
        for (var i = 0; i < utf8.length; i++) {
            arr.push(utf8.charCodeAt(i));
        }
        return arr;
    }
    function keyDecode(keyList) {
        let esc = { "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;", "&": "&amp;" };
        var base16 = [];
        var text = "";
        key = keyList.filter(Boolean);
        for (var i = 0; i < key.length; i++) {
            base16.push(key[i].toString(16));//10進数のkeyの各文字の数字を16進数にしてbaseにpush
        }
        let encodedURI = '%' + base16.join('%');
        console.log(encodedURI.split('%').join(' '), key);
        text = decodeURIComponent(encodedURI).replace(/[&'"<>]/g, match => esc[match]) + (new Array(11 - key.length)).join(".");
        return text;
    }
    function tripDecode(tripList) {
        return String.fromCharCode.apply(null, tripList.slice(1,));
    }
    var pass = [, , , , , , , , ,];
    var salt;
    var trip;
    var t = 0;
    var tripList = [];
    var by = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    var byte;
    var asc;
    var rnd;
    while (t < speed) {
        //ascii 33-126
        byte = 0;
        pass = [, , , , , , , , ,];
        while (byte < 8) {
            if (by[byte] < 0.19512) {
                rnd = Math.floor(Math.random() * 1920);
                pass[byte] = (rnd - rnd % 64) / 64 + 194;
                byte++;
                pass[byte] = rnd % 64 + 128;
                byte++;
            } else if (0.97560 < by[byte]) {
                rnd = Math.floor(Math.random() * 65536);
                pass[byte] = (rnd - rnd % 4096) / 4096 + 224;
                byte++;
                pass[byte] = (rnd % 4096 - rnd % 64) / 64 + 128;
                byte++;
                pass[byte] = rnd % 64 + 128;
                byte++;
            } else {
                asc = Math.floor(Math.random() * 94) + 33;
                if (asc == 60) {
                    asc = 32;
                }
                if (asc == 34) {
                    asc = 31;
                }
                if (asc == 38) {
                    asc = 30;
                }
                if (asc == 62) {
                    asc = 29;
                }
                pass[byte] = asc;
                byte++;
            }
        }
        trip = Crypt(pass, [Csalt[pass[1]], Csalt[pass[2]]]);
        var c = true;
        for (var j = len - 1; j >= 0; j--) {
            c = (trip[j + 1] == target[j] && c);
        }
        if (c) {
            tripList.push([trip.slice(), pass.slice()]);
        }
        t++;
    }
    var text = "";
    for (var i = 0; i < tripList.length; i++) {
        text += "<br />◆" + tripDecode(tripList[i][0]) + " : #" + keyDecode(tripList[i][1]);
        console.log(tripList[i]);
    }
    if (On) {
        tripCounter += speed;
        document.getElementById("result").innerHTML += text;
        document.getElementById("prog").innerHTML = "進捗 : " + tripCounter + "trips";
        setTimeout(function () { UnkoTripFinderMain(target, speed) }, 50);
    }
}
function keybase16(key) {
    var text = "";
    var base16 = (new TextEncoder('utf-8')).encode(key).slice(0, 8);
    for (var i = 0; i < base16.length; i++) {
        text += base16[i].toString(16);
    }
    text = text + String.fromCharCode(Csalt[base16[1]]) + String.fromCharCode(Csalt[base16[2]]);
    return text;
}
function changeRaw() {
    var key = document.getElementById("putkey").value;
    encodeURIComponent(key);
    if (key.match(/^#.+/)) {
        document.getElementById("changedKey").innerHTML = "生キー : ##" + keybase16(key.slice(1,))
    } else {
        alert("変換できん");
    }
}
function speedTest(target) {
    On = false;
    tripCounter = 0;
    let now = new Date();
    UnkoTripFinderMain([1, 1, 1, 1, 1, 1, 1, 1], 4000);
    let stime = new Date();
    var speed = Math.floor(4000000 / (stime.getTime() - now.getTime()));
    document.getElementById("speed").innerHTML = "計測結果 : " + speed + "tripcodes/s";
    On = true;
    setTimeout(function () { UnkoTripFinderMain(target, speed); }, 1000);
}
function StartStop() {
    var sw = document.getElementById("switch");
    target = document.getElementById("search").value.split().join();
    On = (!On);
    if (On && !(target.match(/^[A-Za-z0-9.\/]+$/))) {
        alert("そんな酉出ねーよばーか");
        On = false;
    }
    if (On && target.length < 2) {
        alert("2文字以上入れろなめてんのか");
        On = false;
    }
    if (On && target.length > 10) {
        alert("10桁酉なんだが。算数できる？");
        On = false;
    }
    sw.value = (On ? "停止" : "検索開始");
    if (On && target.length > 1) {
        document.getElementById("speed").innerHTML = "処理能力計測中…";
        var targetl = target.split("").map(d => d.charCodeAt(0));
        setTimeout(function () { speedTest(targetl); }, 1000);
    } else if (!(document.getElementById("speed").innerHTML.match(/検索停止中/))) {
        document.getElementById("speed").innerHTML += " 検索停止中";
    }
}
function UnkoTripFinderWait() {
    if (Crypt) {
        document.getElementById("UnkoTripFinder").innerHTML = "\
<div><b>起動完了だぜ☆</b></div>\
<input type='text' id='search' placeholder='検索パターン入力(前方一致)'>\
<input type='button' id='switch' value='検索開始' onclick='StartStop();'>";
        document.getElementById("rawkey").innerHTML = "\
<div style='margin: 0 25px 0 25px ;padding:0 10px 0 10px;border: 1px solid #000000;font-size: 100%;border-radius: 5px' class='divstyle'>\
<div>【生キー変換所】</div>\
<div>トリップキーを下のフォームに入れて変換ボタン押すと生キーに変換できるぜ☆　俺気が利いてるわぁ</div>\
<input type='text' id='putkey' placeholder='トリップキーを入力(「#」含む)'>\
<input type='button' value='生キーに変換' onclick='changeRaw();'>\
<div id='changedKey'></div>\
<div>※このサイトで出たトリップ専用のツールだぜ</div></div>";
    } else {
        setTimeout(UnkoTripFinderWait, 500);
    }
}
UnkoTripFinderWait();


/**************************************************************************
*   Unix-like crypt(3) Algorithm for Password Encryption in JavaScript
*   Author  : PSI(ledyba.org)
*   Date    : 2014/09/29
*   License : 2-claused BSD License
**************************************************************************/
/* Original Copyright:
***************************************************************************
*            Unix-like crypt(3) Algorithm for Password Encryption
*
*   File    : crypt3.c
*   Purpose : Provides crypt(3) functionality to ANSI C compilers
*             without a need for the crypt library.
*   Author  : Michael Dipperstein
*   Date    : November 3, 1998
*
***************************************************************************
*   The source in this file is heavily borrowed from the crypt3.c file
*   found on several ftp sites on the Internet.  The original source
*   claimed to be BSD, but was not distributed with any BSD license or
*   copyright claims.  I am releasing the source that I have provided into
*   public domain without any restrictions, warranties, or copyright
*   claims of my own.
*
*   The code below has been cleaned and compiles correctly under, gcc,
*   lcc, and Borland's bcc C compilers.  A bug involving the left and
*   right halves of the encrypted data block in the widely published
*   crypt3.c source has been fixed by this version.  All implicit register
*   declarations have been removed, because they generated suboptimal code.
*   All constant data has been explicitly declared as const and all
*   declarations have been given a minimal scope, because I'm paranoid.
*
*   Caution: crypt() returns a pointer to static data.  I left it this way
*            to maintain backward compatibility.  The downside is that
*            successive calls will cause previous results to be lost.
*            This can easily be changed with only minor modifications to
*            the function crypt().
**************************************************************************/
/*Milky no makaizou ban daze star*/

/* Initial permutation */
var IP =
    [
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17, 9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7,
    ];

/* Final permutation, FP = IP^(-1) */
var FP =
    [
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41, 9, 49, 17, 57, 25,
    ];


/* The key schedule.  Generated from the key. */


var S =
    [
        [
            14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
            0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
            4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
            15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13
        ],

        [
            15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
            3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
            0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
            13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9
        ],

        [
            10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
            13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
            13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
            1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12
        ],

        [
            7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
            13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
            10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
            3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14
        ],

        [
            2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
            14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
            4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
            11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3
        ],

        [
            12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
            10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
            9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
            4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13
        ],

        [
            4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
            13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
            1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
            6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12
        ],

        [
            13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
            1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
            7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
            2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11
        ]
    ];

/**************************************************************************
* P is a permutation on the selected combination of the current L and key.
**************************************************************************/
var P =
    [
        16, 7, 20, 21,
        29, 12, 28, 17,
        1, 15, 23, 26,
        5, 18, 31, 10,
        2, 8, 24, 14,
        32, 27, 3, 9,
        19, 13, 30, 6,
        22, 11, 4, 25,
    ];

/* The combination of the key and the input, before selection. */
var preS = new Array(48);

var Crypt = (function (pw, salt) {

    function encrypt(block) {
        var left = new Array(32);
        var right = new Array(32); /* block in two halves */
        var old = new Array(32);
        var f = new Array(32);

        /* First, permute the bits in the input */
        for (var j = 0; j < 32; j++) {
            left[j] = block[IP[j] - 1];
        }

        for (; j < 64; j++) {
            right[j - 32] = block[IP[j] - 1];
        }

        /* Perform an encryption operation 16 times. */
        for (var ii = 0; ii < 16; ii++) {
            var i = ii;
            /* Save the right array, which will be the new left. */
            for (var j = 0; j < 32; j++) {
                old[j] = right[j];
            }

            /******************************************************************
            * Expand right to 48 bits using the E selector and
            * exclusive-or with the current key bits.
            ******************************************************************/
            for (var j = 0; j < 48; j++) {
                preS[j] = right[E[j] - 1] ^ KS[i][j];
            }

            /******************************************************************
            * The pre-select bits are now considered in 8 groups of 6 bits ea.
            * The 8 selection functions map these 6-bit quantities into 4-bit
            * quantities and the results are permuted to make an f(R, K).
            * The indexing into the selection functions is peculiar;
            * it could be simplified by rewriting the tables.
            ******************************************************************/
            for (var j = 0; j < 8; j++) {
                var temp = 6 * j;
                var k =
                    S[j][(preS[temp + 0] << 5) +
                    (preS[temp + 1] << 3) +
                    (preS[temp + 2] << 2) +
                    (preS[temp + 3] << 1) +
                    (preS[temp + 4] << 0) +
                    (preS[temp + 5] << 4)];

                temp = 4 * j;

                f[temp + 0] = (k >> 3) & 01;
                f[temp + 1] = (k >> 2) & 01;
                f[temp + 2] = (k >> 1) & 01;
                f[temp + 3] = (k >> 0) & 01;
            }

            /******************************************************************
            * The new right is left ^ f(R, K).
            * The f here has to be permuted first, though.
            ******************************************************************/
            for (var j = 0; j < 32; j++) {
                right[j] = left[j] ^ f[P[j] - 1];
            }

            /* Finally, the new left (the original right) is copied back. */
            for (var j = 0; j < 32; j++) {
                left[j] = old[j];
            }
        }

        /* The output left and right are reversed. */
        for (var j = 0; j < 32; j++) {
            var temp = left[j];
            left[j] = right[j];
            right[j] = temp;
        }

        /* The final output gets the inverse permutation of the very original. */
        for (var j = 0; j < 64; j++) {
            var i = FP[j];
            if (i < 33) {
                block[j] = left[FP[j] - 1];
            } else {
                block[j] = right[FP[j] - 33];
            }
        }
    }

    var key = new Array(64); /* 1st store key, then results */
    var block = new Array(66); /* 1st store key, then results */
    var iobuf = new Array(11); /* encrypted results */

    /* break pw into 64 bits */
    var c;
    for (var i = 0, c = 0; i < 64; i++) {
        for (var j = 0; j < 7; j++, i++) {
            key[i] = (pw[c] >> (6 - j)) & 1;
        }
        ++c;
    }

    /* set key based on pw */
    var KS =
        [
            [
                key[9], key[50], key[33], key[59],
                key[48], key[16], key[32], key[56],
                key[1], key[8], key[18], key[41],
                key[2], key[34], key[25], key[24],
                key[43], key[57], key[58], key[0],
                key[35], key[26], key[17], key[40],
                key[21], key[27], key[38], key[53],
                key[36], key[3], key[46], key[29],
                key[4], key[52], key[22], key[28],
                key[60], key[20], key[37], key[62],
                key[14], key[19], key[44], key[13],
                key[12], key[61], key[54], key[30]
            ],
            [
                key[1], key[42], key[25], key[51],
                key[40], key[8], key[24], key[48],
                key[58], key[0], key[10], key[33],
                key[59], key[26], key[17], key[16],
                key[35], key[49], key[50], key[57],
                key[56], key[18], key[9], key[32],
                key[13], key[19], key[30], key[45],
                key[28], key[62], key[38], key[21],
                key[27], key[44], key[14], key[20],
                key[52], key[12], key[29], key[54],
                key[6], key[11], key[36], key[5],
                key[4], key[53], key[46], key[22]
            ],
            [
                key[50], key[26], key[9], key[35],
                key[24], key[57], key[8], key[32],
                key[42], key[49], key[59], key[17],
                key[43], key[10], key[1], key[0],
                key[48], key[33], key[34], key[41],
                key[40], key[2], key[58], key[16],
                key[60], key[3], key[14], key[29],
                key[12], key[46], key[22], key[5],
                key[11], key[28], key[61], key[4],
                key[36], key[27], key[13], key[38],
                key[53], key[62], key[20], key[52],
                key[19], key[37], key[30], key[6]
            ],
            [
                key[34], key[10], key[58], key[48],
                key[8], key[41], key[57], key[16],
                key[26], key[33], key[43], key[1],
                key[56], key[59], key[50], key[49],
                key[32], key[17], key[18], key[25],
                key[24], key[51], key[42], key[0],
                key[44], key[54], key[61], key[13],
                key[27], key[30], key[6], key[52],
                key[62], key[12], key[45], key[19],
                key[20], key[11], key[60], key[22],
                key[37], key[46], key[4], key[36],
                key[3], key[21], key[14], key[53]
            ],
            [
                key[18], key[59], key[42], key[32],
                key[57], key[25], key[41], key[0],
                key[10], key[17], key[56], key[50],
                key[40], key[43], key[34], key[33],
                key[16], key[1], key[2], key[9],
                key[8], key[35], key[26], key[49],
                key[28], key[38], key[45], key[60],
                key[11], key[14], key[53], key[36],
                key[46], key[27], key[29], key[3],
                key[4], key[62], key[44], key[6],
                key[21], key[30], key[19], key[20],
                key[54], key[5], key[61], key[37]
            ],
            [
                key[2], key[43], key[26], key[16],
                key[41], key[9], key[25], key[49],
                key[59], key[1], key[40], key[34],
                key[24], key[56], key[18], key[17],
                key[0], key[50], key[51], key[58],
                key[57], key[48], key[10], key[33],
                key[12], key[22], key[29], key[44],
                key[62], key[61], key[37], key[20],
                key[30], key[11], key[13], key[54],
                key[19], key[46], key[28], key[53],
                key[5], key[14], key[3], key[4],
                key[38], key[52], key[45], key[21]
            ],
            [
                key[51], key[56], key[10], key[0],
                key[25], key[58], key[9], key[33],
                key[43], key[50], key[24], key[18],
                key[8], key[40], key[2], key[1],
                key[49], key[34], key[35], key[42],
                key[41], key[32], key[59], key[17],
                key[27], key[6], key[13], key[28],
                key[46], key[45], key[21], key[4],
                key[14], key[62], key[60], key[38],
                key[3], key[30], key[12], key[37],
                key[52], key[61], key[54], key[19],
                key[22], key[36], key[29], key[5]
            ],
            [
                key[35], key[40], key[59], key[49],
                key[9], key[42], key[58], key[17],
                key[56], key[34], key[8], key[2],
                key[57], key[24], key[51], key[50],
                key[33], key[18], key[48], key[26],
                key[25], key[16], key[43], key[1],
                key[11], key[53], key[60], key[12],
                key[30], key[29], key[5], key[19],
                key[61], key[46], key[44], key[22],
                key[54], key[14], key[27], key[21],
                key[36], key[45], key[38], key[3],
                key[6], key[20], key[13], key[52]
            ],
            [
                key[56], key[32], key[51], key[41],
                key[1], key[34], key[50], key[9],
                key[48], key[26], key[0], key[59],
                key[49], key[16], key[43], key[42],
                key[25], key[10], key[40], key[18],
                key[17], key[8], key[35], key[58],
                key[3], key[45], key[52], key[4],
                key[22], key[21], key[60], key[11],
                key[53], key[38], key[36], key[14],
                key[46], key[6], key[19], key[13],
                key[28], key[37], key[30], key[62],
                key[61], key[12], key[5], key[44]
            ],
            [
                key[40], key[16], key[35], key[25],
                key[50], key[18], key[34], key[58],
                key[32], key[10], key[49], key[43],
                key[33], key[0], key[56], key[26],
                key[9], key[59], key[24], key[2],
                key[1], key[57], key[48], key[42],
                key[54], key[29], key[36], key[19],
                key[6], key[5], key[44], key[62],
                key[37], key[22], key[20], key[61],
                key[30], key[53], key[3], key[60],
                key[12], key[21], key[14], key[46],
                key[45], key[27], key[52], key[28]
            ],
            [
                key[24], key[0], key[48], key[9],
                key[34], key[2], key[18], key[42],
                key[16], key[59], key[33], key[56],
                key[17], key[49], key[40], key[10],
                key[58], key[43], key[8], key[51],
                key[50], key[41], key[32], key[26],
                key[38], key[13], key[20], key[3],
                key[53], key[52], key[28], key[46],
                key[21], key[6], key[4], key[45],
                key[14], key[37], key[54], key[44],
                key[27], key[5], key[61], key[30],
                key[29], key[11], key[36], key[12]
            ],
            [
                key[8], key[49], key[32], key[58],
                key[18], key[51], key[2], key[26],
                key[0], key[43], key[17], key[40],
                key[1], key[33], key[24], key[59],
                key[42], key[56], key[57], key[35],
                key[34], key[25], key[16], key[10],
                key[22], key[60], key[4], key[54],
                key[37], key[36], key[12], key[30],
                key[5], key[53], key[19], key[29],
                key[61], key[21], key[38], key[28],
                key[11], key[52], key[45], key[14],
                key[13], key[62], key[20], key[27]
            ],
            [
                key[57], key[33], key[16], key[42],
                key[2], key[35], key[51], key[10],
                key[49], key[56], key[1], key[24],
                key[50], key[17], key[8], key[43],
                key[26], key[40], key[41], key[48],
                key[18], key[9], key[0], key[59],
                key[6], key[44], key[19], key[38],
                key[21], key[20], key[27], key[14],
                key[52], key[37], key[3], key[13],
                key[45], key[5], key[22], key[12],
                key[62], key[36], key[29], key[61],
                key[60], key[46], key[4], key[11]
            ],
            [
                key[41], key[17], key[0], key[26],
                key[51], key[48], key[35], key[59],
                key[33], key[40], key[50], key[8],
                key[34], key[1], key[57], key[56],
                key[10], key[24], key[25], key[32],
                key[2], key[58], key[49], key[43],
                key[53], key[28], key[3], key[22],
                key[5], key[4], key[11], key[61],
                key[36], key[21], key[54], key[60],
                key[29], key[52], key[6], key[27],
                key[46], key[20], key[13], key[45],
                key[44], key[30], key[19], key[62]
            ],
            [
                key[25], key[1], key[49], key[10],
                key[35], key[32], key[48], key[43],
                key[17], key[24], key[34], key[57],
                key[18], key[50], key[41], key[40],
                key[59], key[8], key[9], key[16],
                key[51], key[42], key[33], key[56],
                key[37], key[12], key[54], key[6],
                key[52], key[19], key[62], key[45],
                key[20], key[5], key[38], key[44],
                key[13], key[36], key[53], key[11],
                key[30], key[4], key[60], key[29],
                key[28], key[14], key[3], key[46]
            ],
            [
                key[17], key[58], key[41], key[2],
                key[56], key[24], key[40], key[35],
                key[9], key[16], key[26], key[49],
                key[10], key[42], key[33], key[32],
                key[51], key[0], key[1], key[8],
                key[43], key[34], key[25], key[48],
                key[29], key[4], key[46], key[61],
                key[44], key[11], key[54], key[37],
                key[12], key[60], key[30], key[36],
                key[5], key[28], key[45], key[3],
                key[22], key[27], key[52], key[21],
                key[20], key[6], key[62], key[38]
            ]
        ];

    for (var i = 0; i < 66; i++) {
        block[i] = 0;
    }
    var E =
        [
            32, 1, 2, 3, 4, 5,
            4, 5, 6, 7, 8, 9,
            8, 9, 10, 11, 12, 13,
            12, 13, 14, 15, 16, 17,
            16, 17, 18, 19, 20, 21,
            20, 21, 22, 23, 24, 25,
            24, 25, 26, 27, 28, 29,
            28, 29, 30, 31, 32, 1,
        ];
    c = 0;
    for (var i = 0; i < 2; i++) {
        /* store salt at beginning of results */
        var k = salt[c];
        c++;

        if (k > 90) {
            k -= 6;
        }

        if (k > 57) {
            k -= 7;
        }

        k -= 46;

        /* use salt to effect the E-bit selection */
        for (var j = 0; j < 6; j++) {
            if ((k >> j) & 1) {
                temp = E[6 * i + j];
                E[6 * i + j] = E[6 * i + j + 24];
                E[6 * i + j + 24] = temp;
            }
        }
    }

    /* call DES encryption 25 times using pw as key and initial data = 0 */
    for (var i = 0; i < 25; i++) {
        encrypt(block);
    }

    /* format encrypted block for standard crypt(3) output */
    for (var i = 0; i < 11; i++) {
        var c = 0;
        for (var j = 0; j < 6; j++) {
            c <<= 1;
            c |= block[6 * i + j];
        }

        c += 46;
        if (c > 57) {
            c += 7;
        }

        if (c > 90) {
            c += 6;
        }

        iobuf[i] = c;
    }
    //console.log( String.fromCharCode.apply(null, iobuf));
    return iobuf;
});
let now = new Date();
var t = 0;
while (t < 4) {
    Crypt([49, 50, 51, 52, 53, 54, 55, 56], [50, 51]);
    t++;
}
let stime = new Date();
var speed = Math.floor(4000000 / (stime.getTime() - now.getTime()));
console.log("計測結果 : " + speed + "tripcodes/s");
console.log(Crypt([49, 49, 49, 49, 49, 49, 49, 49], [49, 49]));
console.log(Crypt([49, 50, 51, 52, 53, 54, 55, 56], [50, 51]));