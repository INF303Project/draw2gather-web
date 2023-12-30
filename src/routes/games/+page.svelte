<script lang="ts">
    import type { PageData } from "./$types";
    import type { GetGameResp } from "$lib/dto";
    import CreateGame from "$lib/components/CreateGame.svelte";
    import Game from "$lib/components/GameCard.svelte";
    import { API_URL } from "$lib";
    import CreateWordSet from "$lib/components/CreateWordSet.svelte";

    export let data: PageData;
    let user = data.user;
    $: games = data.games;
    $: word_sets = data.word_sets;

    const createGame = () => {
        const games = document.getElementById("games");
        const createGame = document.getElementById("create-game");
        games?.classList.toggle("d-none");
        createGame?.classList.toggle("d-none");
    };

    const createWordSet = () => {
        const createGame = document.getElementById("create-game");
        const createSet = document.getElementById("create-set");
        createGame?.classList.toggle("d-none");
        createSet?.classList.toggle("d-none");
    };

    const filterLang = async (e: Event) => {
        const lang = (e.target as HTMLSelectElement).value;
        if (lang === "ALL") {
            const res = await fetch(`http://${API_URL}/games`, {
                credentials: "include",
            });
            const newData = (await res.json()) as GetGameResp;
            games = newData;
        } else {
            const res = await fetch(
                `http://${API_URL}/games?lang=${lang}`,
                {
                    credentials: "include",
                },
            );
            const newData = (await res.json()) as GetGameResp;
            games = newData;
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
            {#each games.games as game}
                <Game
                    gameId={game.id}
                    lang={game.language}
                    currentPlayers={game.current_players.length}
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
        <CreateGame
            word_sets={word_sets?.word_sets}
            on:back={createGame}
            on:create-word-set={createWordSet}
        />
    </div>

    <div id="create-set" class="d-none h-100">
        <CreateWordSet on:back={createWordSet} />
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

    #create-set {
        overflow: hidden;
    }
</style>
