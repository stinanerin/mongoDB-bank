
const renderAccList = async() => {
    const accArr = await fetchData("/api/accounts");

    if (accArr) {
        const ul = 

    } else {
        // No registered accounts
    }
    console.log(accArr);
}

renderAccList()

/* 
<ul class="members-list">
                <% if (errorMessage) { %>
                    <div class="error-message">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <%= errorMessage %>
                    </div>
                <% } %>
                <% if (members.length > 0) { %>
                <!-- create a form for each book, which sends a DELETE request to the server when submitted -->
                    <% members.forEach(({_id, name, email, phone_number, registered, optional}) => { %>
                            <li>
                                <a href="/member/<%=_id%>">
                                    <i class="fa-solid fa-user"></i>
                                    <%= name %>
                                </a>
                            </li>
                
                    <% }); %>
                <% } %>
            </ul>
*/