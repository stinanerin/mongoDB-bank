export const displayAlert = (container, error) => {
    container.innerHTML = ` 
        <div class="alert-danger" role="alert">
            <div>
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
                <span>${error}</span>
            </div>
        </div>`;
}