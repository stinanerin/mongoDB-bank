const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#closeModal");

closeModal.addEventListener("click", () => {
    modal.close();
});

export const displayModal = (error) => {
    modal.querySelector("p").innerText =  error ? error : "Please try again later. ";
    modal.showModal();
};
