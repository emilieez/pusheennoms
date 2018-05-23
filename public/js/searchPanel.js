var pushleft = true;

/**
 * Gets all the search form values and populate into object to be POSTED to the server.
 * Also adds the search query to the search history
 */
function submitForms() {
    var healthFormElements = document.getElementById('ingredient-form').elements;
    var dietFormElements = document.getElementById('ingredient-form1').elements;
    var params = {
        q: document.getElementById('ingredient-bar').value,
        healthLabels: [],
        dietLabels: [],
        excluded: document.getElementById('allergies-bar').value
    };

    // Main search bar query cannot be empty
    if (params.q && params.q.length > 0) {
        // Get healthLabels
        for (var i = 0; i < healthFormElements.length; i++) {
            if (healthFormElements[i].checked) {
                params.healthLabels.push(healthFormElements[i].value);
            }
        }
        // Get dietLabels
        for (var i = 0; i < dietFormElements.length; i++) {
            if (dietFormElements[i].checked) {
                params.dietLabels.push(dietFormElements[i].value);
            }
        }

        // Add search parameters to search history
        addIngredient(params);

        // Submit final search form
        document.getElementById('final-search-query').value = jQuery.param(params);
        document.getElementById('final-form').submit();
    } else {
        swal('Error: Empty Query', 'Please enter at least 1 ingredient or dish in the search bar!', 'error');
    }
}

/**
 * Adds a query to search history
 * @param {object} queryParams - the query object containing all attributes and values from search form
 */
function addIngredient(queryParams) {
    let queryStr = jQuery.param(queryParams);
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Add to search history
    // Do not add duplicate search history
    let duplicateSearch = false;
    for (i = 0; i < currentSearchHistory[currentUser].length; i++) {
        if (currentSearchHistory[currentUser][i].query === `${queryStr}`) {
            duplicateSearch = true;
            break;
        }
    }
    if (!duplicateSearch) {
        currentSearchHistory[currentUser].push({
            value: `${queryParams.q}`,
            healthLabels: `${queryParams.healthLabels}`,
            dietLabels: `${queryParams.dietLabels}`,
            excluded: `exclude ${queryParams.excluded}`,
            query: queryStr
        })
    }

    localStorage.setItem('searchHistory', JSON.stringify(currentSearchHistory));
}

/**
 * Displays the search history below search bar
 */
function showSearchHistory() {
    currentSearchHistory = JSON.parse(localStorage.getItem('searchHistory'));

    // Create a search history object if there isn't already one
    if (!currentSearchHistory) {
        currentSearchHistory = {};
        currentSearchHistory[currentUser] = [];

        localStorage.setItem('searchHistory', JSON.stringify(currentSearchHistory));
        currentSearchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    }

    var foodList = document.getElementById('food-list');

    // Create a list for a user if they don't already have a search history
    if (!currentSearchHistory[currentUser]) {
        currentSearchHistory[currentUser] = [];
    }

    foodList.style.display = 'block';

    var ndiv2 = document.createElement('div');
    ndiv2.setAttribute('id', 'searchlist');

    // Create search history items
    for (i = 0; i < currentSearchHistory[currentUser].length; i++) {
        var ndiv = document.createElement("a");
        ndiv.innerHTML = currentSearchHistory[currentUser][i].value;
        var tags = Object.values(currentSearchHistory[currentUser][i]);
        for (j = 1; j < tags.length - 1; j++) {
            if (` ${tags[j]} `.trim() === "exclude") {
                break;
            }
            if (j === 1) { //Health tags
                var ntext1 = document.createElement("i");
                ntext1.style.color = "black";
                ntext1.innerHTML += ` ${tags[j]} `;
                ndiv.appendChild(ntext1);
            }
            if (j === 2) { //Diet tags
                var ntext2 = document.createElement("i");
                ntext2.style.color = "green";
                ntext2.innerHTML += ` ${tags[j]} `;
                ndiv.appendChild(ntext2);
            }
            if (j === 3) { //Exclude tags
                var ntext3 = document.createElement("i");
                ntext3.style.color = "red";
                ntext3.innerHTML += ` ${tags[j]} `;
                ndiv.append(ntext3);
            }
        }

        var seperator = document.createElement("b");
        seperator.style.color = "blue";
        seperator.innerHTML = '***';

        ndiv.className = "added-ingredients";
        ndiv.style.cursor = "pointer";
        ndiv.setAttribute('href', '/search?' + currentSearchHistory[currentUser][i].query);
        foodList.appendChild(ndiv2);
        ndiv2.appendChild(ndiv);
        ndiv2.appendChild(document.createElement('br'));
        ndiv2.appendChild(seperator);
        ndiv2.appendChild(document.createElement('br'));
    }
}

/**
 * Clears the search history
 */
function clearSearchHist() {
    if (currentSearchHistory[currentUser]) {
        currentSearchHistory[currentUser] = []
    }
    localStorage.setItem('searchHistory', JSON.stringify(currentSearchHistory));
    var list = document.getElementById('searchlist');
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}

/**
 * Generate dropdown filters
 * @param {list} list - list of filters
 * @param {string} type - name of filter
 * @param {string} form - id of the form the filter belongs to
 */
function generateFilter(list, type, form) {
    for (var i = 0; i < list.length; i++) {
        let label = document.createElement('label');
        label.className = 'listcontainer';
        label.innerHTML = list[i];

        let input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', type);
        input.setAttribute('value', list[i].replace(/ /g, '-'));

        let span = document.createElement('span');
        span.className = 'checkmark';

        label.appendChild(input);
        label.appendChild(span);
        document.getElementById(form).appendChild(label);
    }

}


// ========== INTERACTIONS & DISPLAYS ================
var healthFilters = ['Vegetarian', 'Vegan', 'Dairy Free', 'Gluten Free', 'Red Meat Free', 'Wheat Free', 'Kidney Friendly', 'Sugar Conscious', 'Alcohol Free'];
var dietFilters = ['Balanced', 'High Fiber', 'High Protein', 'Low Fat', 'Low Sodium', 'Low Carb'];
generateFilter(healthFilters, 'health', 'ingredient-form');
generateFilter(dietFilters, 'diet', 'ingredient-form1');

/**
 * once user presses enter on the ingredients search bar, the forms are submitted
 */
document.getElementById("ingredient-bar").addEventListener("keydown", function (ev) {
    if (ev.keyCode === 13) {
        submitForms();
    }
});

/**
 * open collapsibles on click
 */
for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

/**
 * Opens the search panel
 */
function showPusheen() {
    document.getElementById("outerpanel").style.left = '0px';
    pushleft = 0;
}

/**
 * Closes the search panel
 */
function hidePusheen() {
    document.getElementById("outerpanel").style.left = '-80%';
    pushleft = 1;
}

/**
 * click the cat, show or hide the control panel
 */
document.getElementById("hiddenpusheen").onclick = function () {
    pushleft = !pushleft;

    if (pushleft) {
        hidePusheen();
    } else if (!pushleft) {
        showPusheen();
    }
};