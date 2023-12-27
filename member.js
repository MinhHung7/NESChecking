function renderDataToUI(data) {
    // JavaScript to populate the person's information and avatar
    const infoPart = document.getElementById('infoPart');
    const avatarPart = document.getElementById('avatarPart');

    const createdAtDate = new Date(data['data'].attributes.createdAt);
    const formattedTimeCreatedAt = createdAtDate.toLocaleString('en-US', { hour24: true });
    const updatedAtDate = new Date(data['data'].attributes.updatedAt);
    const formattedTimeUpdatedAt = updatedAtDate.toLocaleString('en-US', { hour24: true });
    // Example person's information

    const personInfo = {
        "Họ và tên": data['data'].attributes.name,
        "Mã UID": data['data'].attributes.uid,
        "MSSV": data['data'].attributes.sid,
        "Thời gian tạo" : formattedTimeCreatedAt,
        "Thời gian cập nhật": formattedTimeUpdatedAt,
    };

    // Create and append elements to the left part (information)
    for (const key in personInfo) {
        const p = document.createElement('p');
        const strong = document.createElement('strong'); // Create a <strong> element
        strong.textContent = key; // Set the strong element's text content to the key (bold)
        p.appendChild(strong); // Append the strong element to the <p> element
        p.innerHTML += `: ${personInfo[key]}`; // Append the value part after the strong element
        infoPart.appendChild(p);
    }

    // Create and append the avatar image to the right part
    const avatar = document.createElement('img');
    avatar.src = data['data'].attributes.avatar.data.attributes.formats.thumbnail.url; // Replace with the actual path to the avatar image
    avatar.alt = 'Avatar'; // You can set an appropriate alt text
    avatar.style.width = '200px';
    avatar.style.height = '200px';
    avatar.style.objectFit = 'cover';
    avatarPart.appendChild(avatar)
}

function callAPIGetMemberInfo(id, jwt) {
    // prepare to call GET info api
    const url = `http://14.225.254.74:1338/api/people/${id}?populate[avatar]=true`;
    const requestOptions = {
        method: 'GET', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
    };
    // Make the GET request using fetch
    fetch(url, requestOptions)
        .then(async (res) => {
            const data = await res.json();
            if (res.ok) {
                renderDataToUI(data);
            }
            else {
                console.log("goi request that bai!");
                console.log(data);
            }
        });
}

function handleLogout() {
    // Your custom code here, for example:
    localStorage.removeItem('jwt');
    window.location.href = "/index.html";
    console.logout(localStorage);
}

///////////////////////////////////////////////////////////////////////////
const storedJwtToken = localStorage.getItem('jwt');
console.log(storedJwtToken);

const searchParams = new URLSearchParams(window.location.search);
let id = searchParams.get('id') || 'undefined';

document.getElementById('logout').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default link behavior (navigating to the href)
    handleLogout();
});

// call at start
callAPIGetMemberInfo(id, storedJwtToken);


// Get a reference to the "Sửa" button using its ID
var editButton = document.getElementById('editButton');

// Add a click event listener to the button
editButton.addEventListener('click', function () {
    // Remove any existing form
    var existingForm = document.getElementById('dynamicForm');
    if (existingForm) {
        existingForm.remove();
    }

    // Create a form element
    var form = document.createElement('form');
    form.id = 'dynamicForm';

    // Define form structure
    form.innerHTML = `
        <div class="form-row">
            <div class="form-group col-md-12">
                <label for="inputname">Họ và tên</label>
                <input type="text" class="form-control" id="inputname" placeholder="Họ và tên">
            </div>
            <div class="form-group col-md-12">
                <label for="inputMSSV">MSSV</label>
                <input type="text" class="form-control" id="inputMSSV" placeholder="MSSV">
            </div>
            <div class="form-group col-md-12"> <!-- Fix the class name from form-row to form-group -->
                <label for="fileInput">Chọn Avatar</label>
                <input type="file" class="form-control-file" id="fileInput" accept=".png, .gif, .jpg">
            </div>
        </div>
        <div class="form-row">
            <div class="col-md-12 text-center">
                <!-- Two buttons in the same row -->
                <button type="button" id="submitButton" class="btn btn-primary" style="margin-top: 10px;">Submit</button>
                <button type="button" id="cancelButton" class="btn btn-secondary" style="margin-top: 10px; margin-left: 10px;">Cancel</button>
            </div>
        </div>
    `;

    // Append the form to the document body
    document.body.appendChild(form);

    var cancelButton = document.getElementById('cancelButton');
    cancelButton.addEventListener('click', function () {
        // Remove the form when "Cancel" is clicked
        form.remove();
    });

    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function () {
        // Get input values
        var fullname = document.getElementById('inputname').value;
        var mssv = document.getElementById('inputMSSV').value;
        var fileInput = document.getElementById('fileInput');

        // Use 'fetch' here
        const storedJwtToken = localStorage.getItem('jwt');

        const fileurl = `http://14.225.254.74:1338/api/upload/`;

        var formData = new FormData();
        formData.append('files', fileInput.files[0]);

        var fileOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${storedJwtToken}`,
            },
            body: formData,
        };
        fetch(fileurl, fileOptions)
            .then((res) => res.json())
            .then((json) => {
                console.log(json[0]['id']);
                const puturl = `http://14.225.254.74:1338/api/people/${id}?populate[avatar]=true`;

                var putOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedJwtToken}`
                    },
                    body: JSON.stringify({
                        "data": {
                            "name": fullname,
                            "sid": mssv,
                            "avatar": json[0]['id'],
                        }
                    })
                };

                fetch(puturl, putOptions)
                    .then((res) => res.json())
                    .then((json) => {
                        const data = json;
                        window.location.href = `/member.html?id=${data['data']['id']}`;
                        callAPIGetMemberInfo(data['data']['id'], storedJwtToken);
                    });
            });


    });

});