function renderfiles(datalist) {
    const fileList = document.getElementById("List");
    fileList.innerHTML = ""; // Clear previous results
    for (let i = 0; i < datalist.length; i++) {
        const filename = datalist[i];
        const fileItem = document.createElement('div');
        fileItem.className = 'file';
        fileItem.innerHTML = `
            <div>
                <strong>${filename}</strong>
            </div>
            <a href="/storage/${filename}" download="${filename}" target="_blank" style="color:white;">Download</a>
        `;
        fileList.appendChild(fileItem);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("get-data-btn");
    const result = document.getElementById("result");
    const uploadbutton = document.getElementById("uploadBtn");
    const input = document.getElementById("fileInput");

    button.addEventListener("click", () => {
        fetch("/storage")
            .then(res => res.json())
            .then(data => {
                renderfiles(data.files);
            })
            .catch(err => {
                result.textContent = "Error: " + err;
            });
    });
    uploadbutton.addEventListener("click", () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        fetch("/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                result.textContent = data.message;
            })
            .catch(err => {
                result.textContent = "Error: " + err;
            });
    });
});


