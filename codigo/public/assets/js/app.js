function getQueryParam(key) {
    let res = "";
    if(typeof(key) == String) {
        const queryParams = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (!urlParams.has(key)) {
            res = "";
        } else {
            res = urlParams.get(key);
        }
    }
    return res;
}

function fetchTable(table, filters) {
    console.log(table);
    if(typeof(table) != String) return {};
    let searchQuery = `/${table}`
    if (filters.lenght() > 0) {
        searchQuery += '?';
        filters.array.forEach(element => {
            searchQuery += element;
        });
    }
    const response = fetch(searchQuery);
    return response.json()
}