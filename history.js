document.getElementById('logout').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default link behavior (navigating to the href)

    // Your custom code here, for example:
    localStorage.removeItem('jwt');
    window.location.href = "/index.html";
    console.logout(localStorage);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
const storedJwtToken = localStorage.getItem('jwt');
console.log(storedJwtToken)

// Define the URL to which you want to send the POST request
const page = 1;
const url = `http://14.225.254.74:1338/api/groups/1/history?pagination[page]=${page}&pagination[pageSize]=6&sort[0]=time:desc&populate[device]=true&populate[person]=true`

// Define the data you want to send as the request body (usually in JSON format)

// Create an object to configure the request
const requestOptions = {
    method: 'GET', // Specify the HTTP method
    headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${storedJwtToken}`
    },
};

// Create function to make table
function makeTable(data) {
    $(document).ready(function () {
        var table = $('#example').DataTable();

        // Variable to store the page length
        var currentPageLength = table.page.len();

        for (let i = 0; i < Math.min(currentPageLength, data['data'].length); i++) {
            const date = new Date(data['data'][i].attributes.createdAt);
            const formattedTime = date.toLocaleString('en-US', { hour24: true });

            table.row.add([
                i + 1,
                data['data'][i].attributes.uid,
                formattedTime,
                data['data'][i].attributes.device.node_id,
                data['data'][i].attributes.person == null ? `<a href = "#" style = "color: red; text-decoration: none;"> Thêm thành viên </a>` : `<a href = "/member.html?id=${data['data'][i].attributes.person.id}" style= "text-decoration: none;">${data['data'][i].attributes.person.name}</a>`,
            ]).draw();
        }

        // Listen for the change event on the page length select box
        $('#example').on('length.dt', function (e, settings, len) {
            table.clear();
            // Update the variable when the page length changes
            currentPageLength = len;
            console.log(`Current page length value: ${currentPageLength}`);
            for (let i = 0; i < Math.min(currentPageLength, data['data'].length); i++) {
                const date = new Date(data['data'][i].attributes.createdAt);
                const formattedTime = date.toLocaleString('en-US', { hour24: true });

                table.row.add([
                    i + 1,
                    data['data'][i].attributes.uid,
                    formattedTime,
                    data['data'][i].attributes.device.node_id,
                    data['data'][i].attributes.person == null ? `<a href = "#" style = "color: red; text-decoration: none;"> Thêm thành viên </a>` : `<a href = "/member.html?id=${data['data'][i].attributes.person.id}" style= "text-decoration: none;">${data['data'][i].attributes.person.name}</a>`,
                ]).draw();
            }
        });
    });
}

// Make the POST request using fetch
fetch(url, requestOptions)
    .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
            console.log("goi request thanh cong!");
            makeTable(data);
        }
        else {
            console.log("goi request that bai!");
            console.log(data);
        }

    })
