$('#example').DataTable({
    language: {
        search: "Tìm kiếm",
        paginate: {
            previous: 'Trang trước',
            next:     'Trang kế'
        },
        info: 'Hiển thị từ _START_ đến _END_ trong tổng cộng _TOTAL_ mục',
        infoEmpty: 'Không có mục để hiển thị',
        lengthMenu: 'Hiển thị _MENU_ mục'
    }
} );

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("avatar-upload");
    const profileImage = document.getElementById("profile-image");

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        
        if (file) {
            const imageURL = URL.createObjectURL(file);
            profileImage.src = imageURL;
        }
    });
});

