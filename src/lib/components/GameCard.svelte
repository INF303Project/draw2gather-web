<script lang="ts">
    import { goto } from "$app/navigation";
    import group from "$lib/assets/group.svg";
    import language from "$lib/assets/lang.svg";

    export let gameId: string;
    export let currentPlayers: number;
    export let maxPlayers: number;
    export let lang: string;

    const gotoGame = async () => {
        await goto(`/${gameId}`);
    };
</script>

<div id="game">
    <h5 class="text-center">Game</h5>

    <div id="info">
        <div>
            <img src={group} alt="Players" />
            <span>{currentPlayers}/{maxPlayers}</span>
        </div>
        <div>
            <img src={language} alt="Language" />
            <span>{lang}</span>
        </div>
    </div>

    {#if currentPlayers == maxPlayers}
        <button class="btn" disabled>Join</button>
    {:else}
        <button class="btn btn-primary" on:click={gotoGame}>Join</button>
    {/if}
</div>

<style>
    #game {
        display: flex;
        flex-direction: column;
        border: 2px solid;
        border-radius: 8px;
        padding: 0.5rem;
        width: fit-content;
        height: fit-content;
    }

    #game > * {
        margin: 0.25rem;
    }

    #info {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
</style>
