// Global
let totalVisitors = 0;
let count = document.getElementsByClassName('count');

/**
    Acts as a small db, displayed in a JSON file.
    The JSON file is stored in json variable where it is edited
    API: https://api.jsonbin.io
 */
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
        let changeToTable2 = 0;
        let table = document.getElementById('table-1');
        json.countries.forEach(c => {
            if (changeToTable2 >= 5) {
                table = document.getElementById('table-2');
            }
            let tag = createFlag(c, 'flat', 64);
            table.appendChild(tag);
            totalVisitors += c.visitors;
            changeToTable2++;
        });

        while (changeToTable2 < 10) {
            let empty = { country: "", code: "", visitors: 0 };
            let tag = createFlag(empty, 'flat', 64);
            table.appendChild(tag);
            changeToTable2++;
        }

        let count = document.getElementsByClassName('count');
        count[0].innerText = totalVisitors;
        animateCount();
    })

let join = document.getElementById('join-btn');
join.addEventListener('click', function() {

    if(localStorage.getItem('participated') === null) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {

            var latlng = {
                lat: parseFloat(position.coords.latitude),
                lng: parseFloat(position.coords.longitude)
            };

            /**
             *  API: https://ipapi.co
             */
            fetch('https://ipapi.co/json/')
                .then(r => r.json())
                .then(j => {
                    let userCountry = j.country_name.toLowerCase();
                    let userCountryCode = j.country.toLowerCase();

                    let newCountry = true;
                    json.countries.forEach(c => {
                    if(userCountryCode === c.code) {
                        c.visitors += 1;
                        newCountry = false;
                        }
                    });

                    // Push to json { "country": "string", "code": "string" "visitors": int }
                    if(newCountry) {
                        let countryObj = {
                            "visitors": 1,
                            "code": userCountryCode,
                            "country": userCountry
                        }
                        json.countries.push(countryObj);
                    }

                    /**
                     *  Dumps the variable json back into api, overwriting the latest version
                     *  API: https://api.jsonbin.io
                     */
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
                            document.getElementById('root-msg').innerHTML = "";
                            document.getElementById('root-msg').appendChild(document.createTextNode('You Already Participated'));
                            localStorage.setItem('participated', true);
                        })
                });
            });
        }
    } else {
        document.getElementById('root-msg').innerHTML = "";
        document.getElementById('root-msg').appendChild(document.createTextNode('You Already Participated'));
    }
});

/**
 *  <tr>
 *      <td>Rank</td>
 *      <td><img src="https://www.countryflags.io/:country_code/:style/:size.png"></td>
 *      <td>Number of Visitors</td>
 *  </tr>
 *
 *  Source: https://www.countryflags.io
 */
function createFlag(country, style, size) {
    let tr = document.createElement('tr');

    let tdRank = document.createElement('td');
    tdRank.appendChild(document.createTextNode('TBA'));
    tr.appendChild(tdRank);

    let tdCountry = document.createElement('td');
    if(country.code != '') {
        let img = document.createElement('img');
        img.setAttribute('src', `https://www.countryflags.io/${country.code}/${style}/${size}.png`);
        tdCountry.appendChild(img);
    } else {
        let msg = document.createElement('p');
        msg.appendChild(document.createTextNode('Add your country'));
        tdCountry.appendChild(msg);
    }
    tr.appendChild(tdCountry);

    let tdVisits = document.createElement('td');
    tdVisits.appendChild(document.createTextNode(`${country.visitors}`));
    tr.appendChild(tdVisits);

    return tr;
}
