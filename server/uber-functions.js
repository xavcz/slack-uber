/**
 * Created by thomas on 17/10/15.
 */

getPriceEstimates = function(starting, ending, access_token) {
    // var geo = new GeoCoder();
    // var result = geo.geocode('29 champs elysée paris');
    // var arrivee = geo.geocode('10 rue dupleix paris');

    var url = "https://api.uber.com/v1/estimates/price";
    var response = HTTP.get(url, {
        params: {
            access_token: access_token,
            start_latitude: starting.latitude,
            start_longitude: starting.longitude,
            end_latitude: ending.latitude,
            end_longitude: ending.longitude
        }
    });
    console.log(response);

    var list_uber = [];
    for (var i = 0; i < response.data.prices.length; i++) {
        if (response.data.prices[i].display_name == 'uberX') {
            list_uber.push(response.data.prices[i]);
        }
    }

    // return list_uber;
    // console.log(response.data.prices);
    // console.log(list_uber);
    console.log(list_uber);

    var mind = list_uber[0].duration % (60 * 60);
    // var minutes = Math.floor(mind / 60);

    var toto = {
        minutes: Math.floor(mind / 60),
        estimate: list_uber[0].estimate
    };

    // return list_uber[0].estimate;
    return toto;
};

fetchUber = function() {
    return 'https://login.uber.com/oauth/v2/authorize?response_type=code&scope=profile%20request&client_id=' + uber.defaults.client_id;
};

getUberProducts = function(lat, lng, type, access_token){
    var url = "https://sandbox-api.uber.com/v1/products";
    //var access_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsicHJvZmlsZSIsImhpc3RvcnlfbGl0ZSIsImhpc3RvcnkiXSwic3ViIjoiZjBhNzQ0MTMtM2U3Ni00MWE2LWI2NzQtY2RkMjI3MTcxZWZlIiwiaXNzIjoidWJlci11czEiLCJqdGkiOiI2ZDQwZGU4OC02YjFkLTRkNGUtOGMxYy1kNDcyMDI3OTc0OTMiLCJleHAiOjE0NDcxMTI1MDIsImlhdCI6MTQ0NDUyMDUwMiwidWFjdCI6IkFzb3dkbG9CUko0aExrbWNDVUpxV0xZeURyWlI2USIsIm5iZiI6MTQ0NDUyMDQxMiwiYXVkIjoiNGxsYWxqOU5JSXg5S2NsQk9zYnBwT29JMmh3UmVUczkifQ.O6c_v910FQAUsEeDtJVdFBPyWN0ZlIwE46vlgprmCK0JHe5njvbWl0yz22cylH6irMNocCZQIJwQF9-xsPvAbWzQOGOJ8gWyIE4aalcuRErmxiT6IMw_64t32eDBKcHQT8di1L_7h0iQ8gQjvoLP-OqpmG4CflkBNMD38q-Dres9GQDC79mSZWvt-_VNrs3_UDjVjbDOBpvr7rxJ-Nqew4g37oANhKNPUGv104Up1TSyxRf2xjHIVFDUNLSqcBiK6rR_0QuizpwWWT4SzXJf9AY81XmWCcPGoAPzSB4gk_yLC_yCFEryX8kNeYbAo4ozmNLVvFrLdSA7OPW6OVE-EA";
    var response =  HTTP.get(url, {
        params: {
            access_token: access_token,
            latitude: lat,
            longitude: lng
        }
    });

    var list_uber = new Array();
    for(var i = 0; i < response.data.products.length; i++){
        if(response.data.products[i].display_name = type){
            list_uber.push(response.data.products[i])
        }
    }

    return list_uber;
};

fetchIdentity = function (accessToken) {
    try {
        return HTTP.get("https://api.uber.com/v1/me", {
            headers: { Authorization: 'Bearer ' + accessToken }
        }).data;
    } catch (err) {
        throw new Error("Failed to fetch identity from Uber " + err.message);
    }
};

requestUber = function(driver, latStart, lngStart, latEnd, lngEnd, access_token, surge_confirmation_id){
    var params;
    if(surge_confirmation_id){
        params = {
            product_id: driver[0].product_id,
            start_latitude: latStart,
            start_longitude: lngStart,
            end_latitude: latEnd,
            end_longitude: lngEnd,
            surge_confirmation_id: surge_confirmation_id
        };
    }else{
        params = {
            product_id: driver[0].product_id,
            start_latitude: latStart,
            start_longitude: lngStart,
            end_latitude: latEnd,
            end_longitude: lngEnd
        };
    }

    try {
        if (!SANDBOX) {
            url = 'https://api.uber.com/v1/requests';
        } else {
            url = 'https://sandbox-api.uber.com/v1/requests';
        }
        return HTTP.post(url, {
            data: params,
            headers: {
                Authorization: 'Bearer ' + access_token,
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    } catch (err) {
        console.log('error', err);
        return err;
    }
};

cancelUber = function(requestId, access_token) {
    var response = HTTP.del('https://api.uber.com/v1/requests/'+ requestId, {
        headers: { Authorization: 'Bearer ' + access_token }
    });

    REQUEST_ID = null;

    return response;
};

detailsRequest = function(id_request, access_token){
    var details = HTTP.get('https://sandbox-api.uber.com/v1/requests/'+ id_request, {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json; charset=utf-8'
        },
        params: {
            request_id: id_request
        }
    });
    return details.data;
};

mapRequest = function(id_request, access_token){
    return  HTTP.get('https://sandbox-api.uber.com/v1/requests/'+ id_request+'/map/', {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
};

changeStatusRequest = function(id_request, status, access_token){
    return  HTTP.get('https://sandbox-api.uber.com/v1/sandbox/requests/'+ id_request, {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json; charset=utf-8'
        },
        params: {
            status: status,
            request_id: id_request
        }
    });
};
