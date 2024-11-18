document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.querySelector(".toggle-select-btn");
    const selectOptions = document.querySelector(".select-options");
    const toggleIcon = toggleButton.querySelector("i");

    toggleButton.addEventListener("click", function() {
        if (selectOptions.style.display === "none" || selectOptions.style.display === "") {
            selectOptions.style.display = "flex";
            toggleIcon.classList.remove("fa-chevron-down");
            toggleIcon.classList.add("fa-chevron-up");
        } else {
            selectOptions.style.display = "none";
            toggleIcon.classList.remove("fa-chevron-up");
            toggleIcon.classList.add("fa-chevron-down");
        }
    });
});
