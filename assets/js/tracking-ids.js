(function () {
    if (!window.madeit_tracking) {
        return;
    }

    function getParam(name) {
        var params = new URLSearchParams(window.location.search || "");
        return params.get(name) || "";
    }

    function getCookie(name) {
        var value = document.cookie.split(";").map(function (c) {
            return c.trim();
        }).find(function (c) {
            return c.indexOf(name + "=") === 0;
        });

        if (!value) {
            return "";
        }

        return decodeURIComponent(value.split("=").slice(1).join("="));
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    var gclid = getParam("gclid");
    var fbclid = getParam("fbclid");
    var hasTrackingParams = !!(gclid || fbclid);
    var visitorId = getCookie(madeit_tracking.cookie_name);
    var cookieDays = parseInt(madeit_tracking.cookie_days, 10) || 90;

    if (!hasTrackingParams) {
        return;
    }

    if (gclid) {
        setCookie(madeit_tracking.cookie_gclid, gclid, cookieDays);
    }

    if (fbclid) {
        setCookie(madeit_tracking.cookie_fbclid, fbclid, cookieDays);
    }

    var data = new FormData();
    data.append("action", "madeit_store_tracking_ids");
    if (gclid) {
        data.append("gclid", gclid);
    }
    if (fbclid) {
        data.append("fbclid", fbclid);
    }
    if (visitorId) {
        data.append("visitor_id", visitorId);
    }

    fetch(madeit_tracking.ajax_url, {
        method: "POST",
        credentials: "same-origin",
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (resp) {
        if (resp && resp.success && resp.data && resp.data.visitor_id) {
            setCookie(madeit_tracking.cookie_name, resp.data.visitor_id, cookieDays);
        }
    }).catch(function () {
        // silent
    });
})();
