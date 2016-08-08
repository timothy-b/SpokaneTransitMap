showPromptSaveMarker: function(onestop_id)
            {
				var stopsArr.push(JSON.parse(getSavedStops()));
                var sname = prompt("Please enter the stop name");
                if (sname != null && sname != "") {
                    stopsArr[stopsArr.length] = {name: sname, onestop_id: onestop_id, index: 0};
					document.cookie = "SavedStops" + "=" + JSON.stringify(stopsArr) + "; expires=Thu, 18 Dec 2200 12:00:00 UTC; path=/";
                }
            }

function getSavedStops(cname="SavedStops") {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}