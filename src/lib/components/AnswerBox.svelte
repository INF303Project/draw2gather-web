<script lang="ts">
    import {
        answered,
        currentPlayer,
        guesses,
        player,
        state,
    } from "$lib/stores";
    import swap from "$lib/assets/swap.svg";
    import Message from "./Message.svelte";
    import { createEventDispatcher } from "svelte";
    import { Action, publishMessage } from "$lib/game";

    let message: string = "";
    const sendMessage = () => {
        publishMessage(Action.Guess, message);
        message = "";
    };

    const dispatch = createEventDispatcher();
    const swapChat = () => {
        dispatch("swap");
    };
</script>

<div id="chatbox">
    <div class="row">
        <div class="col">
            <p style="font-weight: bold;">Answers</p>
        </div>
        <div class="col d-md-none">
            <button id="swap-btn" class="btn" on:click={swapChat}>
                <img src={swap} alt="Swap" />
            </button>
        </div>
    </div>
    <div id="messages" class="row">
        <div>
            {#each $guesses as message}
                <Message user={message.player} message={message.message} />
            {/each}
        </div>
    </div>
    <form class="row" on:submit={sendMessage}>
        <div class="col-8">
            <input
                disabled={$state != "drawing" ||
                    $player == $currentPlayer ||
                    $answered}
                class="form-control"
                type="text"
                placeholder="Answer..."
                minlength={1}
                required
                bind:value={message}
            />
        </div>
        <div class="col-4">
            <button
                class="btn btn-secondary w-100"
                disabled={$state != "drawing" ||
                    $player == $currentPlayer ||
                    $answered}>Send</button
            >
        </div>
    </form>
</div>

<style>
    #chatbox {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        border: 2px solid;
        border-radius: 0.5rem;

        width: 100%;
        height: 100%;

        padding: 1rem;
    }

    #messages {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end safe;
        align-items: center;

        border: 1px solid;
        border-radius: 0.25rem;

        height: 100%;

        padding: 0.5rem;
        margin-top: 0.25rem;
        margin-bottom: 1rem;

        overflow: auto;
    }

    #swap-btn {
        float: right;
        padding: 0;
    }

    #swap-btn :hover {
        background-color: #ccc;
    }
</style>
