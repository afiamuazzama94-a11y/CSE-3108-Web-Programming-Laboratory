const API_URL =
    "https://pokeapi.co/api/v2/pokemon/";


const searchForm =
    document.getElementById("searchForm");

const pokemonInput =
    document.getElementById("pokemonInput");

const searchButton =
    document.getElementById("searchButton");

const clearButton =
    document.getElementById("clearButton");

const statusElement =
    document.getElementById("status");

const resultElement =
    document.getElementById("result");

const quickButtons =
    document.querySelectorAll(".quick-button");



/*
    Names of the six Pokémon base stats
*/

const statNames = {

    hp: "HP",

    attack: "Attack",

    defense: "Defense",

    "special-attack": "Sp. Attack",

    "special-defense": "Sp. Defense",

    speed: "Speed"

};



/*
    Clean the user's input
*/

function cleanName(name) {

    return name
        .trim()
        .toLowerCase();

}



/*
    Make names easier to read
*/

function formatName(name) {

    return name
        .replaceAll("-", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}



/*
    Prevent unsafe HTML characters
*/

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}



/*
    Update status text
*/

function setStatus(message, type = "") {

    statusElement.textContent =
        message;

    statusElement.className = "";

    if (type) {

        statusElement.classList.add(type);

    }

}



/*
    Loading state
*/

function showLoading(name) {

    resultElement.innerHTML = `

        <div class="message-card">

            <div>

                <div class="spinner"></div>

                <h2>
                    Searching for
                    ${escapeHtml(name)}...
                </h2>

                <p>
                    Waiting for the PokeAPI response.
                </p>

            </div>

        </div>

    `;

}



/*
    Error state
*/

function showError(message) {

    resultElement.innerHTML = `

        <div class="message-card error-card">

            <div>

                <h2>
                    Pokémon not found
                </h2>

                <p>
                    ${escapeHtml(message)}
                </p>

            </div>

        </div>

    `;


    setStatus(
        "Search failed. Try another Pokémon name.",
        "error"
    );

}



/*
    Create the type CSS class
*/

function getTypeClass(types) {

    const type =
        types[0]?.type?.name ||
        "normal";

    return `type-${type}`;

}



/*
    Render all six base stats
*/

function renderStats(stats) {

    return stats.map(stat => {

        const value =
            stat.base_stat;


        /*
            Maximum used only for the
            visual progress bar.
        */

        const width =
            Math.min(
                (value / 180) * 100,
                100
            );


        const name =
            statNames[stat.stat.name] ||
            formatName(stat.stat.name);


        return `

            <div class="stat-row">

                <span class="stat-name">
                    ${escapeHtml(name)}
                </span>


                <div class="stat-bar">

                    <div
                        class="stat-fill"
                        style="width: ${width}%"
                    ></div>

                </div>


                <span class="stat-number">
                    ${value}
                </span>

            </div>

        `;

    }).join("");

}



/*
    Render the Pokémon card
*/

function renderPokemon(pokemon) {

    const types =
        pokemon.types || [];


    const abilities =
        pokemon.abilities || [];


    const stats =
        pokemon.stats || [];


    const typeClass =
        getTypeClass(types);


    /*
        Get official artwork first.
        If unavailable, use normal sprite.
    */

    const artwork =
        pokemon.sprites?.other?.[
            "official-artwork"
        ]?.front_default ||

        pokemon.sprites?.front_default;



    if (!artwork) {

        throw new Error(
            "No Pokémon artwork was found."
        );

    }



    /*
        Create type badges
    */

    const typePills =
        types.map(type => {

            return `

                <span class="type-pill">

                    ${escapeHtml(
                        type.type.name
                    )}

                </span>

            `;

        }).join("");



    /*
        Create ability badges
    */

    const abilityPills =
        abilities.map(item => {

            return `

                <span class="ability">

                    ${escapeHtml(
                        item.ability.name
                    )}

                </span>

            `;

        }).join("");



    /*
        Put everything into the page
    */

    resultElement.innerHTML = `

        <article
            class="pokemon-card ${typeClass}"
        >


            <!-- Top -->

            <div class="card-top">


                <div class="card-info">

                    <p class="card-type">

                        ${escapeHtml(
                            types[0]?.type?.name ||
                            "pokemon"
                        )}

                        Type

                    </p>


                    <h2 class="pokemon-name">

                        ${escapeHtml(
                            pokemon.name
                        )}

                    </h2>


                    <p class="pokemon-id">

                        #${String(
                            pokemon.id
                        ).padStart(4, "0")}

                    </p>


                    <div class="types">

                        ${typePills}

                    </div>

                </div>



                <!-- Artwork -->

                <div class="art-area">

                    <img
                        src="${artwork}"
                        alt="${escapeHtml(
                            pokemon.name
                        )}"
                    >

                </div>


            </div>



            <!-- Basic information -->

            <div class="details">


                <div class="detail">

                    <div class="detail-label">
                        Height
                    </div>

                    <div class="detail-value">

                        ${(
                            pokemon.height / 10
                        ).toFixed(1)} m

                    </div>

                </div>



                <div class="detail">

                    <div class="detail-label">
                        Weight
                    </div>

                    <div class="detail-value">

                        ${(
                            pokemon.weight / 10
                        ).toFixed(1)} kg

                    </div>

                </div>



                <div class="detail">

                    <div class="detail-label">
                        Abilities
                    </div>

                    <div class="detail-value">

                        ${abilities.length}

                    </div>

                </div>


            </div>



            <!-- Stats + Abilities -->

            <div class="bottom-section">


                <!-- Stats -->

                <section class="section">

                    <p class="small-title">
                        BASE STATS
                    </p>

                    <h3 class="section-title">
                        Battle Profile
                    </h3>


                    <div class="stats">

                        ${renderStats(stats)}

                    </div>

                </section>



                <!-- Abilities -->

                <section class="section">

                    <p class="small-title">
                        ABILITIES
                    </p>

                    <h3 class="section-title">
                        Special Abilities
                    </h3>


                    <div class="abilities">

                        ${abilityPills}

                    </div>

                </section>


            </div>


        </article>

    `;


    setStatus(
        `${formatName(
            pokemon.name
        )} loaded successfully.`,

        "success"
    );

}



/*
    Main API function
*/

async function searchPokemon(name) {


    const cleanedName =
        cleanName(name);



    /*
        Validate input
    */

    if (!cleanedName) {

        setStatus(
            "Please enter a Pokémon name.",
            "error"
        );

        return;

    }



    /*
        Loading state
    */

    setStatus(
        `Loading ${cleanedName}...`,
        "loading"
    );


    showLoading(cleanedName);


    searchButton.disabled =
        true;

    searchButton.textContent =
        "Loading...";



    try {


        /*
            Build the API URL

            Example:

            https://pokeapi.co/api/v2/pokemon/pikachu
        */

        const response =
            await fetch(
                API_URL +
                encodeURIComponent(
                    cleanedName
                )
            );



        /*
            Check HTTP response
        */

        if (!response.ok) {


            if (response.status === 404) {

                throw new Error(
                    `No Pokémon named "${cleanedName}" was found.`
                );

            }


            throw new Error(
                `Server error: HTTP ${response.status}`
            );

        }



        /*
            Convert response to JSON
        */

        const pokemon =
            await response.json();



        /*
            Check important API fields
        */

        if (

            !pokemon.name ||

            !pokemon.id ||

            !pokemon.sprites ||

            !Array.isArray(
                pokemon.types
            ) ||

            !Array.isArray(
                pokemon.stats
            ) ||

            !Array.isArray(
                pokemon.abilities
            )

        ) {

            throw new Error(
                "The API response is missing required data."
            );

        }



        /*
            Make sure all six stats exist
        */

        if (
            pokemon.stats.length !== 6
        ) {

            throw new Error(
                "The API did not return all six base stats."
            );

        }



        /*
            Display the data
        */

        renderPokemon(pokemon);


    } catch (error) {


        console.error(
            "Pokémon API error:",
            error
        );


        showError(
            error.message ||
            "The request failed. Please check your internet connection."
        );


    } finally {


        /*
            Enable search button again
        */

        searchButton.disabled =
            false;

        searchButton.textContent =
            "Search ↗";

    }

}



/*
    Search form
*/

searchForm.addEventListener(
    "submit",

    function(event) {

        event.preventDefault();

        searchPokemon(
            pokemonInput.value
        );

    }
);



/*
    Quick search buttons
*/

quickButtons.forEach(
    button => {

        button.addEventListener(
            "click",

            function() {

                const name =
                    button.dataset.pokemon;


                pokemonInput.value =
                    name;


                searchPokemon(name);

            }
        );

    }
);



/*
    Clear input button
*/

clearButton.addEventListener(
    "click",

    function() {

        pokemonInput.value =
            "";

        pokemonInput.focus();

    }
);



/*
    Load Pikachu when the page opens
*/

window.addEventListener(
    "DOMContentLoaded",

    function() {

        searchPokemon("pikachu");

    }
);