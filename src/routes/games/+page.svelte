<script lang="ts">
    import type { PageData } from "./$types";
    import CreateGame from "$lib/components/CreateGame.svelte";
    import Game from "$lib/components/GameCard.svelte";

    export let data: PageData;

    const createGame = () => {
        const games = document.getElementById("games");
        const createGame = document.getElementById("create-game");
        games?.classList.toggle("d-none");
        createGame?.classList.toggle("d-none");
    };

    const filterLang = async (e: Event) => {
        const lang = (e.target as HTMLSelectElement).value;
        if (lang === "ALL") {
            const res = await fetch("http://192.168.0.10:8080/games", {
                credentials: "include",
            });
            const newData = await res.json();
            data = newData;
        } else {
            const res = await fetch(
                `http://192.168.0.10:8080/games?lang=${lang}`,
                {
                    credentials: "include",
                },
            );
            const newData = await res.json();
            data = newData;
        }
    };
</script>

<div id="rooms" class="container">
    <div>
        <h2>Draw2Gather</h2>
    </div>

    <div id="games">
        <div id="topbar">
            <h4 style="margin: 0px;">Games</h4>

            <div>
                <select class="form-select" on:change={filterLang}>
                    <option disabled selected>Language</option>
                    <option value="ALL">All</option>
                    <option value="TR">Turkish</option>
                    <option value="EN">English</option>
                    <option value="DE">German</option>
                </select>
            </div>
        </div>

        <div id="game-list">
            {#each data.games as game}
                <Game
                    gameId={game.id}
                    lang={game.language}
                    currentPlayers={game.current_players}
                    maxPlayers={game.max_players}
                />
            {/each}
        </div>

        <button
            class="btn btn-primary"
            style="width: fit-content; align-self: center;"
            on:click={createGame}>Create Game</button
        >
    </div>

    <div id="create-game" class="d-none">
        <CreateGame on:back={createGame} />
    </div>
</div>

<style>
    #rooms {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 1rem;

        height: 100%;

        padding: 1rem;

        text-align: center;
    }

    #games {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 1rem;

        height: 100%;

        overflow: hidden;
    }

    #topbar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    #game-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        border: 2px solid;
        border-radius: 0.5rem;

        height: 100%;
        padding: 1rem;

        overflow-y: auto;
    }
</style>
