<script lang="ts">
    import { boardUtility, guesses } from "$lib/stores";
    import { Action } from "$lib/board_utils";
    import swap from "$lib/assets/swap.svg";
    import Message from "./Message.svelte";
    import { createEventDispatcher } from "svelte";

    let message: string = "";
    const sendMessage = () => {
        $boardUtility.sendMessage(Action.Guess, { value: message });
        guesses.update((messages) => [
            ...messages,
            { name: "You", message: message },
        ]);
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
                <Message user={message.name} message={message.message} />
            {/each}
        </div>
    </div>
    <div class="row">
        <form class="row" on:submit={sendMessage}>
            <div class="col-9">
                <input
                    class="form-control"
                    type="text"
                    placeholder="Answer..."
                    required
                    bind:value={message}
                />
            </div>
            <div class="col-3">
                <button class="btn btn-secondary">Send</button>
            </div>
        </form>
    </div>
</div>

<style>
    #chatbox {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        border: 2px solid;
        border-radius: 0.5rem;

        /* max-height: 100%; */
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
