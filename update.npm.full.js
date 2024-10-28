//(c)2024, MIT Style License <browser-update.org/LICENSE.txt>
//it is recommended to directly link to this file because we update the detection code
"use strict";

var $bu_= new function() {
    var s=this;
    this.version="3.3.55npm";
    this.vsakt = {c:"130",f:"131",s:"17.6",e:"130",i:"12",ios:"17.6",samsung:"27",o:"114",e_a:"129",o_a:"84",y:"24.7.8",v:"6.9",uc:"13.7.8"};
    //severely insecure below(!) this version, insecure means remote code execution that is actively being exploited
    this.vsinsecure_below = {c:"126",f:"126",s:"11.1.1",e:"119",i:11,ios:"16.5",samsung:12.0,o:62,o_a:78,y:"20",v:"6.0",uc:"13.4"};
    this.vsdefault = {c:-3,f:-3,s:-2,e:17,i:11,ios:12,samsung:-3,o:-3,o_a:-3,y:-1,v:-1,uc:-0.2,a:535};
    this.names={c:"Chrome",f:'Firefox',s:'Safari',e:"Edge",i:'Internet Explorer',ios:"iOS",samsung:"Samsung Internet",o:'Opera',o_a:'Opera', e_a:"Edge", y:"Yandex Browser",v:"Vivaldi",uc:"UC Browser",a:"Android Browser",x:"Other",silk:"Silk"};

    this.get_browser = function(ua) {
    var n,ua=(ua||navigator.userAgent).replace("_","."),r={n:"x",v:0,t:"other browser",age_years:undefined,no_device_update:false,available:s.vsakt};
    function ignore(reason,pattern){if (new RegExp(pattern,"i").test(ua)) return reason;return false}
    r.other=ignore("bot","Pagespeed|pingdom|Preview|ktxn|dynatrace|Ruxit|PhantomJS|Headless|Lighthouse|bot|spider|archiver|transcoder|crawl|checker|monitoring|prerender|screenshot|python-|php|uptime|validator|fetcher|facebook|slurp|google|yahoo|node|mail.ru|github|cloudflare|addthis|thumb|proxy|feed|fetch|favicon|link|http|scrape|seo|page|search console|AOLBuild|Teoma|Expeditor")||
        ignore("TV","SMART-TV|SmartTV") ||
        ignore("niche browser","motorola edge|Comodo.Dragon|OculusBrowser|Falkon|Brave|Classic Browser|Dorado|LBBROWSER|Focus|waterfox|Firefox/56.2|Firefox/56.3|Whale|MIDP|k-meleon|sparrow|wii|Chromium|Puffin|Opera Mini|maxthon|maxton|dolfin|dolphin|seamonkey|opera mini|netfront|moblin|maemo|arora|kazehakase|epiphany|konqueror|rekonq|symbian|webos|PaleMoon|Basilisk|QupZilla|Otter|Midori|qutebrowser|slimjet") ||
        ignore("mobile without upgrade path or landing page","OPR/44.12.2246|cros|kindle|tizen|silk|blackberry|bb10|RIM|PlayBook|meego|nokia|ucweb|ZuneWP7|537.85.10");
//        ignore("android(chrome) web view","; wv");
    r.embedded=/"QtWebEngine|Teams|Electron/i.test(ua);
    r.mobile=(/iphone|ipod|ipad|android|mobile|phone|ios|iemobile/i.test(ua));
    r.discontinued=(/netscape|greenbrowser|camino|flot|fennec|galeon|coolnovo/i.test(ua));

    var pats=[
        ["CriOS.VV","c",'ios'],
        ["FxiOS.VV","f",'ios'],
        ["Trident.*rv:VV","i",'i'],
        ["Trident.VV","i",'i'],
        ["UCBrowser.VV","uc",'c'],
        ["MSIE.VV","i",'i'],
        ["Edge.VV","e",'e'],
        ["Edg.VV","e",'c'],
        ["EdgA.VV","e_a",'c'],
        ["Vivaldi.VV","v",'c'],
        ["Android.*OPR.VV","o_a",'c'],
        ["OPR.VV","o",'c'],
        ["YaBrowser.VV","y",'c'],
        ["SamsungBrowser.VV","samsung",'c'],
        ["Silk.VV","silk",'c'],
        ["Chrome.VV","c",'c'],
        ["Firefox.VV","f",'f'],
        [" OS.VV.*Safari","ios",'ios'],
        ["Version.VV.*Safari","s",'s'],
        ["Safari.VV","s",'s'],
        ["Opera.*Version.VV","o"],
        ["Opera.VV","o"]
    ];
    var VV="(\\d+\\.?\\d+\\.?\\d*\\.?\\d*)";
    for (var i=0; i < pats.length; i++) {
        if (ua.match(new RegExp(pats[i][0].replace("VV",VV),"i"))) {
            r.n=pats[i][1];
            r.engine=pats[i][2];
            break;
        }        
    }
    r.fullv=RegExp.$1;
    r.v=parseFloat(r.fullv);

    // Special treatment of some systems
    //do not notify old systems since there is no up-to-date browser available
    if (/windows.nt.5|windows.nt.4|windows.nt.6.0|windows.95|windows.98|os x 10.2|os x 10.3|os x 10.4|os x 10.5/i.test(ua)) {
        r.no_device_update=true;
        r.available={}
    }
    //Safari on iOS 13 in Desktop mode
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
        r.n="ios";
        r.engine='ios';
        r.fullv=r.v=13;
        r.no_device_update=true;//For now, never show a message, TODO!
    }
    //iOS
    if (/iphone|ipod|ipad|ios/i.test(ua)) {
        ua.match(new RegExp("OS."+VV,"i"));
        r.n="ios";
        r.fullv=RegExp.$1;
        r.v=parseFloat(r.fullv);
        r.engine='ios';
        var av=s.available_ios(ua,r.v);
        /*
        var newmap={10:"10.3.4",11:"12.4.3",12:"12.4.3",13:s.vsakt["ios"]};
        if (av in newmap)
            av=newmap[av];
        */
        if (av < 12 && Math.round(r.v)===11)// all devices with ios 11 support ios 12
            av=12
        r.available = {"ios": av};
        if (parseFloat(r.available.ios)<15)
            r.no_device_update=true;
    }
    //winxp/vista/2003
    if (/windows.nt.5.1|windows.nt.5.2|windows.nt.6.0/i.test(ua)) {
        r.available={"c":49.9,"f":52.9}
        r.no_device_update=true;
    }
    //old mac
    if (/os x 10.6/i.test(ua)) {
        r.available = {"s": "5.1.10", "c": 49.9, "f": 48}
        r.no_device_update=true;
    }

    if (/os x 10.7|os x 10.8/i.test(ua)) {
        r.available = {"s": "6.2.8", "c": 49.9, "f": 48}
        r.no_device_update=true;
    }
    if (/os x 10.9/i.test(ua))
        r.available.s="9.1.3"

    if (/os x 10.10/i.test(ua))
        r.available.s="10.1.2"

    //check for android stock browser
    if (ua.indexOf('Android')>-1 && r.n==="s") {
        var v=parseInt((/WebKit\/([0-9]+)/i.exec(ua) || 0)[1],10) || 2000;
        if (v <= 534) {
            r.n="a";
            r.fullv=r.v=v;
            r.is_insecure=true;
        }
    }

    r.t=s.names[r.n]+" "+r.v;
    r.is_supported=r.is_latest= !s.vsakt[r.n] ? undefined : s.less(r.fullv,s.vsakt[r.n])<=0;
    
    r.vmaj=Math.round(r.v);

    r.is_insecure= r.is_insecure|| !s.vsinsecure_below[r.n] ? undefined :  s.less(r.fullv,s.vsinsecure_below[r.n])===1;
    
    if ((r.n==="f" && (r.vmaj===115 || r.vmaj===128)) || (r.n==="c" && (r.vmaj===120))) {
        r.is_supported=true;
        r.is_insecure=false;
        if (r.n==="f")
            r.esr=true;
    }
    
    if (r.n==="ios" && r.v>=15)
        r.is_supported=true;
    if (r.n==="a" || r.n==="x")
        r.t=s.names[r.n];
    if (r.n==="e") {
        r.t = s.names[r.n] + " " + r.vmaj;
        r.is_supported = s.less(r.fullv, "18.15063") != 1
    }
    if (r.n in ["c","f","o","e"] && s.less(r.fullv,parseFloat(s.vsakt[r.n])-1)<=0)
        r.is_supported=true; //mark also the version before the current version as supported to make the transitions smoother

    var releases_per_year={'f':7,'c':8,'o':8,'i':1,'e':1,'s':1}//,'v':1}
    if (releases_per_year[r.n]) {
        r.age_years=Math.round(((s.vsakt[r.n]-r.v)/releases_per_year[r.n])*10)/10 || 0
    }
    var engines={e:"Edge.VV",c:"Chrome.VV",f:"Firefox.VV",s:"Version.VV",i:"MSIE.VV","ios":" OS.VV"}
    if (r.engine) {
        ua.match(new RegExp(engines[r.engine].replace("VV",VV),"i"))
        r.engine_version=parseFloat(RegExp.$1)
    }    
    return r
}
this.semver = function(vstr) {
    if (vstr instanceof Array)
        return vstr
    var x = (vstr+(".0.0.0")).split('.')
    return [parseInt(x[0]) || 0, parseInt(x[1]) || 0, parseInt(x[2]) || 0, parseInt(x[3]) || 0]
}
this.less= function(v1,v2) {
    //semantic version comparison: returns 1 if v1<v2 , 0 if equal, -1 if v1>v2
    v1=s.semver(v1)
    v2=s.semver(v2)
    for (var i=0; ;i++) {
        if (i>=v1.length) return i>=v2.length ? 0 : 1;
        if (i>=v2.length) return -1;
        var diff = v2[i]-v1[i]
        if (diff) return diff>0 ? 1 : -1;
    }
}
this.available_ios=function(ua,v) {
    //https://support.apple.com/de-de/guide/iphone/iphe3fa5df43/ios
    var h = Math.max(window.screen.height, window.screen.width),pr = window.devicePixelRatio
    if (/ipad/i.test(ua)) {
        if (h == 1024 && pr == 2) // iPad 3 (iOS 9), 4, 5, Mini 2, Mini 3, Mini 4, Air, Air 2, Pro 9.7
            return 10//? only ipad 4 has ios 10, all other can have ios 11
        if (h == 1112)// iPad Pro 10.5
            return 15;
        if (h == 1366)//iPad Pro 12.9, Pro 12.9 (2nd Gen)
            return 15
        if (h == 1024 && v < 6)
            return 5 // iPad
        return 9 // iPad 2, iPad Mini
    }
    if (pr == 1)// 1/3G/3GS
        return 6//for 3GS
    if (pr == 3)
        return 15
    if (h == 812)// X
        return 15
    if ((h == 736 || h == 667))// && pr == 3)// 6+/6s+/7+ and 8+ or // 6+/6s+/7+ and 8+ in zoom mode + // 6/6s/7 and 8
        return 15//slightly wrong as latest version for iphone 6 is 12
    if (h == 568) // 5/5C/5s/SE or 6/6s/7 and 8 in zoom mode
        return 10
    if (h == 480) // i4/4s
        return 7
    return 6
}
/*
this.sub= function(v,minus) {
    //semantic version subtraction
    v=s.semver(v)
    minus=s.semver(minus)
    for (var i=0; ;i++) {
        if (i>=v.length||i>minus.length) break;
        v[i]-=v[minus];
    }
    return v.join('.')
}
*/
}

window.$bu_getBrowser=$bu_.get_browser;

var $buo = function(op,test) {
var n = window.navigator,b;
op=window._buorgres=op||{};
var ll = op.l||(n.languages ? n.languages[0] : null) || n.language || n.browserLanguage || n.userLanguage||document.documentElement.getAttribute("lang")||"en";
op.llfull=ll.replace("_","-").toLowerCase().substr(0,5);
op.ll=op.llfull.substr(0,2);
op.domain=op.domain!==undefined?op.domain:(/file:/.test(location.href)?"https:":"")+"//browser-update.org";
op.apiver=op.api||op.c||-1;
op.jsv=$bu_.version;

var required_min=(op.apiver<2018&&{i:10,f:11,o:21,s:8,c:30})||{};

var vs=op.notify||op.vs||{};//legacy config: maximum version to notify
if (vs.e!==0)
    vs.e=vs.e||vs.i;
vs.i=vs.i||vs.e;
var required=op.required||{};//minimum browser versions needed
if (required.e!==0)
    required.e=required.e||required.i;
if (!required.i) {
    required.i=required.e;
    $bu_.vsakt.i=$bu_.vsakt.e;
}

for (b in $bu_.vsdefault) {
    if (vs[b]) {//legacy style config: browsers to notify
        if ($bu_.less(vs[b],0)>=0) // required <= 0
            required[b]= parseFloat($bu_.vsakt[b])+parseFloat(vs[b])+0.01
        else
            required[b] = parseFloat(vs[b]) + 0.01
    }
    if (!(b in required) || required[b]==null)
        required[b]=$bu_.vsdefault[b]
    if ($bu_.less(required[b],0)>=0) // case for required <= 0 --> relative to latest version
        required[b]=parseFloat($bu_.vsakt[b])+parseFloat(required[b]) // TODO: make it work for string version
    if (required_min[b] && $bu_.less(required[b],required_min[b])===1) // required < required_min
        required[b]=required_min[b]
}
required.ios=required.ios||required.s;

if (required.i<79 && required.i>65)
    required.i=required.i-60
if (required.e<79 && required.e>65)
    required.e=required.e-60
op.required=required;
op.reminder=op.reminder<0.1 ? 0 : op.reminder||(24*7);
op.reminderClosed=op.reminderClosed<1 ? 0 : op.reminderClosed||(24*7);
op.onshow = op.onshow||function(o){};
op.onclick = op.onclick||function(o){};
op.onclose = op.onclose||function(o){};
op.pageurl = op.pageurl || location.hostname || "x";
op.newwindow=(op.newwindow!==false);

op.test=test||op.test||(location.hash==="#test-bu")||false;
op.ignorecookie=op.ignorecookie||location.hash==="#ignorecookie-bu";

op.reasons=[];
op.hide_reasons=[];
function check_show(op) {
    var bb=op.browser=$bu_.get_browser(op.override_ua);
    op.is_below_required = required[bb.n] && $bu_.less(bb.fullv,required[bb.n])===1; //bb.fullv<required
    if (bb.other!==false)
        op.hide_reasons.push("is other browser:" + bb.other)
    if (bb.embedded!==false)
        op.hide_reasons.push("is embedded browser:" + bb.embedded)
    if ( bb.esr && !op.notify_esr)// || (bb.is_supported && !op.notify_also_supported))
        op.hide_reasons.push("Extended support (ESR)")
    if (bb.mobile&&op.mobile===false)
        op.hide_reasons.push("do not notify mobile")
    if (bb.is_latest)//the latest versions of a browser can not be notified
            op.hide_reasons.push("is latest version of the browser")
    if (bb.no_device_update)
        op.hide_reasons.push("no device update")
    if (op.is_below_required)
        op.reasons.push("below required")
    if ((op.insecure||op.unsecure) && bb.is_insecure)
        op.reasons.push("insecure")
    if (op.unsupported && !bb.is_supported)
        op.reasons.push("no vendor support")
    if (op.hide_reasons.length>0)
        return false
    if (op.reasons.length>0)
        return true
    return false
 }

op.notified=check_show(op);

op.already_shown=document.cookie.indexOf("browserupdateorg=pause")>-1 && !op.ignorecookie;

if (!op.test && (!op.notified || op.already_shown))
    return;

op.setCookie=function(hours) { //sets a cookie that the user has already seen the notification, closed it or permanently wants to hide it. No information on the user is stored.
    document.cookie = 'browserupdateorg=pause; expires='+(new Date(new Date().getTime()+3600000*hours)).toGMTString()+'; path=/; SameSite=Lax'+(/https:/.test(location.href)?'; Secure':'')+(op.cookiedomain?`; Domain=${op.cookiedomain}`:'')
}

if (op.already_shown && (op.ignorecookie || op.test))
    op.setCookie(-10)// remove old cookies if in test mode

if (op.reminder>0)
    op.setCookie(op.reminder);

if (op.nomessage) {
    op.onshow(op);
    return;
}

$buo_show();
};


if( typeof( module ) !== 'undefined' ) {
    module.exports = $buo;
}



"use strict";
var $buo_show = function () {
    var op = window._buorgres;
    var bb = $bu_getBrowser();
    var burl = op.burl || ("http" + (/MSIE/i.test(navigator.userAgent) ? "" : "s") + "://browser-update.org/");
    if (!op.url) {
        op.url = burl + ((op.l && (op.l + "/")) || "") + "update-browser.html" + (op.test ? "?force_outdated=true" : "") + "#" + op.jsv + ":" + op.pageurl;
    }
    op.url_permanent_hide=op.url_permanent_hide || (burl + "block-ignore-browser-update-warning.html");
    /*
     if (Math.random()*1000<1 && !op.test && !op.betatest) {
     var i = new Image();
     var txt=op["text_"+ll]||op.text||"";
     var extra=encodeURIComponent("frac="+frac+"&txt="+txt+"&apiver="+op.apiver);
     i.src="https://browser-update.org/cnt?what=noti&from="+bb.n+"&fromv="+bb.v + "&ref="+ escape(op.pageurl) + "&jsv="+op.jsv+"&tv="+op.style+"&extra="+extra;
     }
     */
    function busprintf() {
        var args = arguments;
        var data = args[0];
        for (var k = 1; k < args.length; ++k) {
            data = data.replace(/%s/, args[k]);
        }
        return data;
    }


var t = {}, ta;
t.en= {'msg': 'Your web browser ({brow_name}) is out of date.', 'msgmore': 'Update your browser for more security, speed and the best experience on this site.', 'bupdate': 'Update browser', 'bignore': 'Ignore','remind': 'You will be reminded in {days} days.','bnever': 'Never show again','insecure':'Your web browser ({brow_name}) has a serious security vulnerability!'}
t.ar= {'msg': 'متصفح الإنترنت الخاص بك ({brow_name}) غير مُحدّث.','msgmore': 'قم بتحديث المتصفح الخاص بك لمزيد من الأمان والسرعة ولأفضل تجربة على هذا الموقع.','bupdate': 'تحديث المتصفح','bignore': 'تجاهل', 'remind': 'سيتم تذكيرك في غضون {days} أيام.', 'bnever': 'لا تظهر مرة أخرى'}
t.bg= {'msg': 'Вашият уеб браузър ({brow_name}) е остарял.','msgmore': 'Актуализирайте браузъра си за повече сигурност, бързина и най-доброто изживяване на този сайт.','bupdate': 'Актуализиране на браузъра','bignore': 'игнорирай', 'remind': 'Ще ви бъде напомнено след {days} дни.', 'bnever': 'Никога повече да не се показва'}
t.ca= {'msg': 'El teu navegador ({brow_name}) està desactualitzat.','msgmore': 'Actualitzeu el vostre navegador per obtenir més seguretat, velocitat i una millor experiència en aquest lloc.','bupdate': 'Actualitza el navegador','bignore': 'Ignorar', 'remind': 'T\'ho recordarem d\'aquí a {days} dies.', 'bnever': 'No ho tornis a mostrar'}
t.cs= {'msg': 'Váš prohlížeč ({brow_name}) je zastaralý.','msgmore': 'Aktualizujte prohlížeč pro lepší zabezpečení, rychlost a nejlepší zážitek z tohoto webu.','bupdate': 'Aktualizovat prohlížeč','bignore': 'Ignorovat', 'remind': 'Znovu budete upozorněni za {days} dnů.', 'bnever': 'Již nezobrazovat'}
t.cy= {'msg': 'Mae eich porwr gwe ({brow_name}) angen ei ddiweddaru.','msgmore': 'Diweddarwch eich porwr i gael mwy o ddiogelwch, cyflymder a\'r profiad gorau ar y safle hwn.','bupdate': 'Diweddaru porwr','bignore': 'Anwybyddu', 'remind': 'Byddwn yn eich atgoffa mewn {days} diwrnod.', 'bnever': 'Peidiwch â dangos eto'}
t.da= {'msg': 'Din web browser ({brow_name}) er forældet','msgmore': 'Opdater din browser for mere sikkerhed, hastighed og den bedste oplevelse på denne side.','bupdate': 'Opdater browser','bignore': 'Ignorer', 'remind': 'Du vil blive påmindet om {days} dage.', 'bnever': 'Vis aldrig igen'}
t.de= {'msg': 'Ihr Webbrowser ({brow_name}) ist veraltet.','msgmore': 'Aktualisieren Sie Ihren Browser für mehr Sicherheit, Geschwindigkeit und den besten Komfort auf dieser Seite.','bupdate': 'Browser aktualisieren','bignore': 'Ignorieren', 'remind': 'Sie werden in {days} Tagen wieder erinnert.', 'bnever': 'Nie wieder anzeigen','insecure':'Ihr Webbrowser ({brow_name}) hat eine ernsthafte Sicherheitslücke!'}
t.el= {'msg': 'Το πρόγραμμα περιήγησής σας ({brow_name}) είναι απαρχαιωμένο.','msgmore': 'Ενημερώστε το πρόγραμμα περιήγησής σας για περισσότερη ασφάλεια, ταχύτητα και την καλύτερη εμπειρία σ\' αυτόν τον ιστότοπο.','bupdate': 'Ενημερώστε το πρόγραμμα περιήγησης','bignore': 'Αγνοήστε', 'remind': 'Θα σας το υπενθυμίσουμε σε {days} ημέρες.', 'bnever': 'Να μην εμφανιστεί ξανά'}
t.es= {'msg': 'Su navegador web ({brow_name}) está desactualizado.','msgmore': 'Actualice su navegador para obtener más seguridad, velocidad y para disfrutar de la mejor experiencia en este sitio.','bupdate': 'Actualizar navegador','bignore': 'Ignorar', 'remind': 'Se le recordará en {days} días.', 'bnever': 'No mostrar de nuevo'}
t.et= {'msg': 'Teie veebilehitseja ({brow_name}) on vananenud.','msgmore': 'Veebilehitseja uuendamisega kaasneb nii parem turvalisus, kiirus kui ka kasutusmugavus.','bupdate': 'Uuenda veebilehitsejat','bignore': 'Eira', 'remind': 'Uus meeldetuletus {days} päeva pärast.', 'bnever': 'Ära kunagi enam näita'}
t.fa= {'msg': 'مرورگر شما ({brow_name}) قدیمی است.','msgmore': 'برای ایمنی، سرعت و تجربه بهتر مرورگر خود را به‌روز کنید.','bupdate': 'به‌روزرسانی مرورگر','bignore': 'نادیده گرفتن', 'remind': 'به شما تا {days} روز دیگر دوباره یاد‌آوری خواهد شد.', 'bnever': 'هرگز نمایش نده'}
t.fi= {'msg': 'Selaimesi ({brow_name}) on vanhentunut.','msgmore': 'Päivitä selaimesi saadaksesi tietoturvapäivityksiä, nopeutta sekä parhaan käyttökokemuksen sivustolla.','bupdate': 'Päivitä selain','bignore': 'Ohita', 'remind': 'Saat uuden muistutuksen {days} päivän päästä.', 'bnever': 'Älä näytä uudestaan'}
t.fr= {'msg': 'Votre navigateur Web ({brow_name}) n\'est pas à jour.','msgmore': 'Mettez à jour votre navigateur pour plus de sécurité et de rapidité et une meilleure expérience sur ce site.','bupdate': 'Mettre à jour le navigateur','bignore': 'Ignorer', 'remind': 'Vous serez rappelé dans {days} jours.', 'bnever': 'Ne plus afficher'}
t.gl= {'msg': 'Tá an líonléitheoir agat ({brow_name}) as dáta.','msgmore': 'Actualiza o teu navegador para obter máis seguridade, rapidez e mellor experiencia neste sitio.','bupdate': 'Actualizar navegador web','bignore': 'Ignorar', 'remind': 'Lembraralle en {days} días.', 'bnever': 'Non volver mostrar máis'}
t.he= {'msg': 'דפדפן ({brow_name}) שלך אינו מעודכן.','msgmore': 'עדכן/י את הדפדפן שלך לשיפור האבטחה והמהירות וכדי ליהנות מהחוויה הטובה ביותר באתר זה.','bupdate': 'עדכן דפדפן','bignore': 'התעלם', 'remind': 'תקבל/י תזכורת בעוד  {days} ימים.', 'bnever': 'אל תציג שוב'}
t.hi= {'msg': 'आपका वेब ब्राउज़र ({brow_name}) पुराना है।','msgmore': 'इस साइट पर अधिक सुरक्षा, गति और सर्वोत्तम अनुभव करने के लिए अपने ब्राउज़र को अपडेट करें ।','bupdate': 'ब्राउज़र अपडेट करें','bignore': 'नजरअंदाज करें', 'remind': 'आपको {days} दिनों में याद दिलाया जाएगा।', 'bnever': 'फिर कभी मत दिखाना'}
t.hu= {'msg': 'Az Ön webböngészője ({brow_name}) elavult.','msgmore': 'Frissítse böngészőjét a nagyobb biztonság, sebesség és élmény érdekében!','bupdate': 'Böngésző frissítése','bignore': 'Mellőzés', 'remind': 'Újra emlékeztetünk {days} napon belül.', 'bnever': 'Ne mutassa többet'}
t.id= {'msg': 'Peramban web ({brow_name}) Anda sudah usang.','msgmore': 'Perbarui peramban Anda untuk pengalaman terbaik, lebih aman, dan cepat di situs ini.','bupdate': 'Perbarui peramban','bignore': 'Abaikan', 'remind': 'Anda akan diingatkan kembali dalam {days} hari.', 'bnever': 'Jangan pernah tampilkan lagi'}
t.it= {'msg': 'Il tuo browser ({brow_name}) non è aggiornato.','msgmore': 'Aggiorna il browser per una maggiore sicurezza, velocità e la migliore esperienza su questo sito.','bupdate': 'Aggiorna browser','bignore': 'Ignora', 'remind': 'Riceverai un promemoria tra {days} giorni.', 'bnever': 'Non mostrare di nuovo'}
t.ja= {'msg': 'お使いのブラウザ（{brow_name}）は最新版ではありません。','msgmore': 'セキュリティ、スピード、そしてこのサイトでの最良の体験のためにお使いのブラウザを更新してください。','bupdate': 'ブラウザを更新する','bignore': '無視する', 'remind': '{days} 日後にもう一度お知らせします。', 'bnever': '次回から表示しない'}
t.ko= {'msg': '귀하의 웹 브라우저({brow_name})는 오래되었습니다.','msgmore': '이 사이트에서 보안, 속도와 최상의 경험을 얻으려면 브라우저를 업데이트하십시오.','bupdate': '브라우저 업데이트하기','bignore': '무시하기', 'remind': '{days}일 후에 알려 드립니다.', 'bnever': '다시 표시하지 않기'}
t.lt= {'msg': 'Jūsų naršyklė ({brow_name}) yra pasenusi.','msgmore': 'Atsinaujinkite savo naršyklę norėdami gauti daugiau saugumo, greičio ir pačių geriausių patirčių šioje svetainėje.','bupdate': 'Atnaujinti naršyklę','bignore': 'Nepaisyti', 'remind': 'Jums bus priminta po {days} dienų.', 'bnever': 'Daugiau niekada nerodyti'}
t.lv= {'msg': 'Jūsu pārlūkprogramma ({brow_name}) ir novecojusi.','msgmore': 'Atjaunojiet savu pārlūkprogrammu lielākai drošībai, ātrumam un labākai pieredzei ar šo vietni.','bupdate': 'Atjaunināt pārlūkprogrammu','bignore': 'Ignorēt', 'remind': 'Jums tiks parādīts atgādinājums pēc {days} dienām.', 'bnever': 'Vairs nerādīt'}
t.ms= {'msg': 'Pelayar web anda ({brow_name}) sudah lapuk.','msgmore': 'Kemas kini pelayar anda untuk lebih keselamatan, kelajuan dan pengalaman terbaik di laman web ini.','bupdate': 'Kemas kini pelayar','bignore': 'Abaikan', 'remind': 'Anda akan diingatkan dalam {days} hari.', 'bnever': 'Jangan tunjukkan lagi'}
t.nl= {'msg': 'Uw webbrowser ({brow_name}) is verouderd.','msgmore': 'Update uw browser voor meer veiligheid, snelheid en om deze site optimaal te kunnen gebruiken.','bupdate': 'Browser updaten','bignore': 'Negeren', 'remind': 'We zullen u er in {days} dagen aan herinneren.', 'bnever': 'Nooit meer tonen'}
t.no=t.nn=t.nb= {'msg': 'Nettleseren din ({brow_name}) er utdatert.','msgmore': 'Oppdater nettleseren din for økt sikkerhet, hastighet og den beste opplevelsen på dette nettstedet.','bupdate': 'Oppdater nettleser','bignore': 'Ignorer', 'remind': 'Du vil få en påminnelse om {days} dager.', 'bnever': 'Aldri vis igjen'}
t.pl= {'msg': 'Twoja przeglądarka ({brow_name}) jest nieaktualna.','msgmore': 'Zaktualizuj przeglądarkę, by korzystać z tej strony bezpieczniej, szybciej i po prostu sprawniej.','bupdate': 'Aktualizuj przeglądarkę','bignore': 'Ignoruj', 'remind': 'Przypomnimy o tym za {days} dni.', 'bnever': 'Nie pokazuj więcej'}
t.pt= {'msg': 'Seu navegador da web ({brow_name}) está desatualizado.','msgmore': 'Atualize seu navegador para ter mais segurança e velocidade, além da melhor experiência neste site.','bupdate': 'Atualizar navegador','bignore': 'Ignorar', 'remind': 'Você será relembrado em {days} dias.', 'bnever': 'Não mostrar novamente'}
t.ro= {'msg': 'Browserul tău ({brow_name}) nu este actualizat.','msgmore': 'Actualizează browserul pentru o mai mare siguranță, viteză și cea mai bună experiență pe acest site.','bupdate': 'Actualizează browser','bignore': 'Ignoră', 'remind': 'Ți se va reaminti peste {days} zile.', 'bnever': 'Nu mai arăta'}
t.ru= {'msg': 'Ваш браузер ({brow_name}) устарел.','msgmore': 'Обновите ваш браузер для повышения уровня безопасности, скорости и комфорта использования этого сайта.','bupdate': 'Обновить браузер','bignore': 'Игнорировать', 'remind': 'Вы получите напоминание через {days} дней.', 'bnever': 'Больше не показывать '}
t.sk= {'msg': 'Váš internetový prehliadač ({brow_name}) je zastaraný.','msgmore': 'Pre väčšiu bezpečnosť, rýchlosť a lepšiu skúsenosť s touto stránkou si aktualizujte svoj prehliadač.','bupdate': 'Aktualizovať prehliadač','bignore': 'Ignorovať', 'remind': 'Bude vám to pripomenuté o {days} dní.', 'bnever': 'Už nikdy viac neukazovať'}
t.sl= {'msg': 'Vaš spletni brskalnik ({brow_name}) je zastarel.','msgmore': 'Posodobite svoj brskalnik za dodatno varnost, hitrost in najboljšo izkušnjo na tem spletnem mestu.','bupdate': 'Posodobi brskalnik','bignore': 'Prezri', 'remind': 'Opomnik boste prejeli čez toliko dni: {days}.', 'bnever': 'Ne prikaži več'}
t.sq= {'msg': 'Shfletuesi juaj ({brow_name}) është i vjetruar.','msgmore': 'Përditësoni shfletuesin tuaj për më tepër siguri, shpejtësi dhe për më të mirin e funksionimeve në këtë sajt.','bupdate': 'Përditëso shfletuesin','bignore': 'Shpërfille', 'remind': 'Do t’ju rikujtohet pas {days} ditësh.', 'bnever': 'Mos e shfaq kurrë më'}
t.sr= {'msg': 'Vaš pretraživač ({brow_name}) je zastareo.','msgmore': 'Ima poznate sigurnosne probleme i najverovatnije neće prikazati sve funkcionalnisti ovog i drugih sajtova.','bupdate': 'Nadogradi pretraživač','bignore': 'Ignorisi', 'remind': 'Zaboravićete za {days} dana.', 'bnever': 'Ne prikazuj opet'}
t.sv= {'msg': 'Din webbläsare ({brow_name}) är föråldrad. ','msgmore': 'Uppdatera din webbläsare för mer säkerhet, hastighet och den bästa upplevelsen på den här sajten. ','bupdate': 'Uppdatera webbläsaren','bignore': 'Ignorera', 'remind': 'Du får en påminnelse om {days} dagar.', 'bnever': 'Visa aldrig igen'}
t.th= {'msg': 'เว็บเบราว์เซอร์ของคุณ ({brow_name}) ล้าสมัยแล้ว','msgmore': 'อัปเดทเบราว์เซอร์เพื่อเพิ่มความปลอดภัย, ความเร็ว และประสบการณ์ที่ดีที่สุดบนเว็บไซต์นี้','bupdate': 'อัปเดทเบราว์เซอร์','bignore': 'ข้าม', 'remind': 'คุณจะได้รับการแจ้งเตือนใน {days} วัน', 'bnever': 'ไม่ต้องแสดงอีก'}
t.tr= {'msg': 'Web tarayıcınız ({brow_name}) güncel değil.','msgmore': 'Daha fazla güvenlik ve hız ile bu sitede en iyi deneyim için tarayıcınızı güncelleyin.','bupdate': 'Tarayıcıyı güncelle','bignore': 'Yok say', 'remind': '{days} gün sonra bir hatırlatma alacaksınız.', 'bnever': 'Bir daha gösterme'}
t.uk= {'msg': 'Ваш браузер ({brow_name}) застарілий.','msgmore': 'Оновіть свій браузер для більшої безпеки, швидкості та повноцінної роботи цього сайту.','bupdate': 'Оновити браузер','bignore': 'Пропустити', 'remind': 'Ви отримаєте нагадування через {days} днів.', 'bnever': 'Більше не показувати'}
t.uz= {'msg': 'Sizning ({brow_name}) veb-brauzeringiz eskirgan','msgmore': 'Xavfsizlik, tezkorlik va ushbu sayt imkoniyatlaridan to`liq foydalanish uchun brauzeringizni yangilang.','bupdate': 'Brauzeringizni yangilang','bignore': 'E’tibor bermaslik', 'remind': 'Sizga {days} kundan so`ng eslatammiz.', 'bnever': 'Hech qachon qayta ko\'rsatmang'}
t.vi= {'msg': 'Trình duyệt web của bạn ({brow_name}) đã lỗi thời.','msgmore': 'Cập nhật trình duyệt của bạn để có thêm bảo mật, tốc độ và trải nghiệm tốt nhất trên trang web này.','bupdate': 'Cập nhật trình duyệt','bignore': 'Bỏ qua', 'remind': 'Bạn sẽ được nhắc nhở sau {days} ngày.', 'bnever': 'Không bao giờ hiển thị lại'}
t.zh= {'msg': '您的网页浏览器（{brow_name}）已过期。','msgmore': '更新您的浏览器，以便在该网站上获得更安全、更快速和最好的体验。','bupdate': '更新浏览器','bignore': '忽略', 'remind': '会在{days}天后提醒您。', 'bnever': '不再显示'}
t["zh-tw"]= t["zh-hans-cn"] ={'msg': '您的網路瀏覽器（{brow_name}）已過舊。','msgmore': '更新您的瀏覽器以獲得更佳的安全性、速度以及在此網站的最佳體驗。','bupdate': '更新瀏覽器','bignore': '忽略', 'remind': '您將在 {days} 天後收到提醒。', 'bnever': '不要再顯示'}

var custom_text = op["text_for_"  + bb.n + "_in_" + op.ll] || op["text_for_" + bb.n] || op["text_" + op.llfull] || op["text_in_" + op.ll] || op["text_" + op.ll]  ||   op.text



t = ta = t[op.llfull] || t[op.ll] || t.en;
if (custom_text) {
    if (typeof custom_text === 'string')
        t=ta=custom_text;
    else {
        for (var i in custom_text) {
            ta[i] = custom_text[i]
        }
    }
}
if (op.browser.is_insecure && ta.insecure) {
    ta.msg=ta.insecure
}
if (ta.msg)
    t = '<b class="buorg-mainmsg">' + t.msg + '</b> <span class="buorg-moremsg">' + t.msgmore + '</span> <span class="buorg-buttons"><a{up_but}>' + t.bupdate + '</a> <a{ignore_but}>' + t.bignore + '</a></span>'

var tar = "";
if (op.newwindow)
    tar = ' target="_blank" rel="noopener"';

var div = op.div = document.createElement("div");
div.id = div.className= "buorg";

var style = '<style>.buorg-icon {width: 22px; height: 16px; vertical-align: middle; position: relative; top: -0.05em; display: inline-block; background: no-repeat 0px center url(https://browser-update.org/static/img/small/' + bb.n + '.png);}</style>';
var style2 = '<style>.buorg {position:absolute;position:fixed;z-index:111111; width:100%; top:0px; left:0px; border-bottom:1px solid #A29330; text-align:center;  color:#000; background-color: #fff8ea; font: 18px Calibri,Helvetica,sans-serif; box-shadow: 0 0 5px rgba(0,0,0,0.2);animation: buorgfly 1s ease-out 0s;}'
    + '.buorg-pad { padding: 9px;  line-height: 1.7em; }'
    + '.buorg-buttons { display: block; text-align: center; }'
    + '#buorgig,#buorgul,#buorgpermanent { color: #fff; text-decoration: none; cursor:pointer; box-shadow: 0 0 2px rgba(0,0,0,0.4); padding: 1px 10px; border-radius: 4px; font-weight: normal; background: #5ab400;    white-space: nowrap;    margin: 0 2px; display: inline-block;}'
    + '#buorgig { background-color: #edbc68;}'
    + '@media only screen and (max-width: 700px){.buorg div { padding:5px 12px 5px 9px; line-height: 1.3em;}}'
    + '@keyframes buorgfly {from {opacity:0;transform:translateY(-50px)} to {opacity:1;transform:translateY(0px)}}'
    + '.buorg-fadeout {transition: visibility 0s 8.5s, opacity 8s ease-out .5s;}</style>';
if (ta.msg && (op.ll=="ar"||op.ll=="he"||op.ll=="fa"))
    style2+='<style>.buorg {direction:RTL; unicode-bidi:embed;}</style>';
if (!ta.msg && t.indexOf && t.indexOf("%s") !== -1) {//legacy style
    t = busprintf(t, bb.t, ' id="buorgul" href="' + op.url + '"' + tar);

    style += '<style>.buorg {position:absolute;position:fixed;z-index:111111; width:100%; top:0px; left:0px; border-bottom:1px solid #A29330; text-align:left; cursor:pointer; color:#000; font: 13px Arial,sans-serif;color:#000;}'
        + '.buorg div { padding:5px 36px 5px 40px; }'
        + '.buorg>div>a,.buorg>div>a:visited{color:#E25600; text-decoration: underline;}'
        + '#buorgclose{position:absolute;right:6px;top:0px;height:20px;width:12px;font:18px bold;padding:0;}'
        + '#buorga{display:block;}'
        + '@media only screen and (max-width: 700px){.buorg div { padding:5px 15px 5px 9px; }}</style>';
    div.innerHTML = '<div>' + t + '<div id="buorgclose"><a id="buorga">&times;</a></div></div>' + style;
    op.addmargin = true;
}
else {
    if (op.style === "bottom") {
        style2 += '<style>.buorg {bottom:0; top:auto; border-top:1px solid #A29330; } @keyframes buorgfly {from {opacity:0;transform:translateY(50px)} to {opacity:1;transform:translateY(0px)}}</style>';
    }
    else if (op.style === "corner") {
        style2 += '<style> .buorg { text-align: left; width:300px; top:50px; right:50px; left:auto; border:1px solid #A29330; } .buorg-buttons, .buorg-mainmsg, .buorg-moremsg { display: block; } .buorg-buttons a {margin: 4px 2px;} .buorg-icon {display: none;}</style>';
    }
    else {
        op.addmargin = true;
    }
    t = t.replace("{brow_name}", bb.t).replace("{up_but}", ' id="buorgul" href="' + op.url + '"' + tar).replace("{ignore_but}", ' id="buorgig" role="button" tabindex="0"');
    div.innerHTML = '<div class="buorg-pad" role="status" aria-live="polite"><span class="buorg-icon"> </span>' + t + '</div>' + style + style2;
}

op.text = t;
if (op.container) {
    op.container.appendChild(div);
    op.addmargin = false;
}
else
    document.body.insertBefore(div, document.body.firstChild);

var updatebutton=document.getElementById("buorgul");
if (updatebutton) {
    updatebutton.onclick = function (e) {
        div.onclick = null;
        op.onclick(op);
        if (op.noclose)
            return
        op.setCookie(op.reminderClosed);
        if (!op.noclose) {
            div.style.display = "none";
            if (op.addmargin && op.shift_page_down !== false)
                hm.style.marginTop = op.bodymt;
        }
    };
}
if (!custom_text) {//make whole bar clickable except if custom text is set
    div.style.cursor="pointer";
    div.onclick = function () {
        if (op.newwindow)
            window.open(op.url, "_blank");
        else
            window.location.href = op.url;
        op.setCookie(op.reminderClosed);
        op.onclick(op);
    };
}

if (op.addmargin && op.shift_page_down !== false) {
    var hm = document.getElementsByTagName("html")[0] || document.body;
    op.bodymt = hm.style.marginTop;
    hm.style.marginTop = (div.clientHeight) + "px";
}
var ignorebutton = document.getElementById("buorga") || document.getElementById("buorgig");
if (ignorebutton) {
    ignorebutton.onclick = function (e) {
        div.onclick = null;
        op.onclose(op);
        if (op.addmargin && op.shift_page_down !== false)
            hm.style.marginTop = op.bodymt;
        op.setCookie(op.reminderClosed);
        if (!op.no_permanent_hide && ta.bnever && ta.remind) {
            op.div.innerHTML = '<div class="buorg-pad"><span class="buorg-moremsg">' + (op.reminderClosed > 24 ? ta.remind.replace("{days}", Math.round(op.reminderClosed/24)):"") + '</span> <span class="buorg-buttons"><a id="buorgpermanent" role="button" tabindex="0" href="' + op.url_permanent_hide +'"' + tar + '>' + ta.bnever + '</a></span></div>' + style + style2;
            div.className = "buorg buorg-fadeout";
            document.getElementById("buorgpermanent").onclick = function (e) {
                op.setCookie(24 * 365);
                op.div.style.display = "none";
            }
            op.div.style.opacity = 0;
            op.div.style.visibility = "hidden";
            return false;
        }
        op.div.style.display = "none";
        return false;
    }
    if (op.noclose || op.reminderClosed==0) {
        ignorebutton.parentNode.removeChild(ignorebutton)
    }
}


op.onshow(op);

if (op.test && !op.dont_show_debuginfo) {
    var e = document.createElement("script");
    e.src = op.domain + "/update.test.js";
    document.body.appendChild(e);
}

};


