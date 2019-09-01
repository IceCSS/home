// console.log(json);

// Display JSON file, basically a download
fetch('https://api.jsonbin.io/b/5d6b3c9e0290f7369dd580e5/latest', {
    'method': 'GET',
    'headers': {
        'secret-key': '$2a$10$ujgF1P5MYKf5yb8K9DNm1.RYh6OPMWG3Cl0FTX7Fbg5HSgCUihWp6'
    }
})
    .then(r => r.json())
    .then(j => {
        json = j;
        // Display Information
        json.countries.forEach(c => {
            let tag = createFlag(c.code, 'flat', 64);
            document.getElementById('root').appendChild(tag);
            document.getElementById('root').appendChild(document.createTextNode(`${c.visitors}`));

        });
    })

let join = document.getElementById('join-btn');
join.addEventListener('click', function() {
    console.log('join');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

        var latlng = {
            lat: parseFloat(position.coords.latitude),
            lng: parseFloat(position.coords.longitude)
        };

        // ip-api API
        fetch('http://ip-api.com/json/')
            .then(r => r.json())
            .then(j => {
                let userCountry = j.country.toLowerCase();
                let userCountryCode = j.countryCode.toLowerCase();

                let newCountry = true;
                json.countries.forEach(c => {
                if(userCountryCode === c.code) {
                    c.visitors += 1;
                    newCountry = false;
                    }
                });

                // push to json
                if(newCountry) {
                    // { "country": "australia", "code": "au" "visitors": "135" }
                    let countryObj = {
                        "visitors": 1,
                        "code": userCountryCode,
                        "country": userCountry
                    }
                    json.countries.push(countryObj);
                }

                // Display JSON file, basically a download
                fetch('https://api.jsonbin.io/b/5d6b3c9e0290f7369dd580e5', {
                    'method': 'PUT',
                    'headers': {
                        'Content-Type': 'application/json',
                        'secret-key': '$2a$10$ujgF1P5MYKf5yb8K9DNm1.RYh6OPMWG3Cl0FTX7Fbg5HSgCUihWp6',
                        'versioning': false
                    },
                    'body': JSON.stringify(json)
                })
                    .then(r => r.json())
                    .then(j => {
                        console.log('You have participated');
                    })
            });
      });
    }
});

// <img src="https://www.countryflags.io/:country_code/:style/:size.png">
function createFlag(code, style, size) {
    let img = document.createElement('img');
    img.setAttribute('src', `https://www.countryflags.io/${code}/${style}/${size}.png`);

    return img;
}
