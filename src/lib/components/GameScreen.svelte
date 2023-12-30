<script lang="ts">
    import {
        currentPlayer,
        owner,
        player,
        state,
        word,
        words,
    } from "$lib/stores";
    import Board from "./Board.svelte";
    import quit from "$lib/assets/quit.svg";
    import { Action, publishMessage } from "$lib/game";
    import { goto } from "$app/navigation";

    const quitGame = () => {
        publishMessage(Action.Quit);
        goto("/");
    };

    const startGame = () => {
        publishMessage(Action.Start);
    };

    const pickWord = (event: Event) => {
        const value = (event.target as HTMLButtonElement).value;
        publishMessage(Action.Pick, value);
        $word = value;
    };
</script>

<div id="screen">
    <div
        class="d-flex w-100 justify-content-between"
        style="border-bottom: 1px solid;"
    >
        <div class="d-flex justify-content-center w-100">
            {#if $state == "drawing" && $player == $currentPlayer}
                <span>{$word}</span>
            {/if}
        </div>
        <button class="image-button" on:click={quitGame}>
            <img src={quit} alt="Quit Game" />
        </button>
    </div>
    <div id="game">
        {#if $state == "waiting"}
            <span>Waiting for players</span>
            {#if $owner == $player}
                <button class="btn btn-primary" on:click={startGame}
                    >Start</button
                >
            {/if}
        {:else if $state == "starting"}
            <span>Round is starting</span>
        {:else if $state == "picking"}
            {#if $currentPlayer == $player}
                <span>Pick a word</span>
                <div>
                    <button
                        class="btn btn-primary"
                        value={$words[0]}
                        on:click={pickWord}>{$words[0]}</button
                    >
                    <button
                        class="btn btn-primary"
                        value={$words[1]}
                        on:click={pickWord}>{$words[1]}</button
                    >
                </div>
            {:else}
                <span>Waiting for player to pick a word</span>
            {/if}
        {:else if $state == "ending"}
            <span>Game finished!</span>
        {/if}
        <Board />
    </div>
</div>

<style>
    #screen {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        border: 2px solid;
        border-radius: 0.5rem;

        padding-left: 0px;
        padding-right: 0px;

        width: 100%;
        aspect-ratio: 16/9;
        max-height: 100%;
    }

    #game {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 1rem;

        width: 100%;
        height: 100%;
    }

    .image-button {
        all: unset;
        cursor: pointer;
    }
</style>
