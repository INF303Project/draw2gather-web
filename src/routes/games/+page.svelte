<script lang="ts">
    import type { PageData } from "./$types";
    import CreateGame from "$lib/components/CreateGame.svelte";
    import Game from "$lib/components/GameCard.svelte";

    // export let data: PageData;

    const createGame = () => {
        const games = document.getElementById("games");
        const createGame = document.getElementById("create-game");
        games?.classList.toggle("d-none");
        createGame?.classList.toggle("d-none");
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
                <select class="form-select">
                    <option disabled selected>Language</option>
                    <option value="TR">Turkish</option>
                    <option value="EN">English</option>
                    <option value="DE">German</option>
                </select>
            </div>
        </div>

        <div id="game-list">
            <Game gameId="1234" currentPlayers={5} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={2} maxPlayers={5} lang="TR" />
            <Game gameId="1234" currentPlayers={5} maxPlayers={5} lang="TR" />
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
