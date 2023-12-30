<script lang="ts">
    import { owner, player, players } from "$lib/stores";
    import kick from "$lib/assets/kick.svg";
    import { Action, publishMessage } from "$lib/game";

    const kickPlayer = (event: Event) => {
        const value = (
            (event.target as HTMLElement).parentElement as HTMLButtonElement
        ).value;
        publishMessage(Action.Kick, value);
    };
</script>

<div id="player-list">
    <div class="row" style="border-bottom: 2px solid;">
        <p style="font-weight: bold;">Players</p>
    </div>
    <div id="players">
        {#each $players as p}
            <div class="row" style="border-bottom: 1px solid;">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        {#if $player == p.id}
                            <b style="color: blue;">{p.name}</b>
                        {:else}
                            <b>{p.name}</b>
                        {/if}
                        <br />
                        <span>{p.score}</span>
                    </div>
                    {#if $owner == $player && $player != p.id}
                        <div>
                            <button
                                class="image-button"
                                value={p.id}
                                on:click={kickPlayer}
                            >
                                <img src={kick} alt="kick" />
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    #player-list {
        display: flex;
        flex-direction: column;

        border: 2px solid;
        border-radius: 0.5rem;

        width: 100%;
        height: 100%;

        padding: 1rem;
    }

    #players {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .image-button {
        all: unset;
        cursor: pointer;
    }
</style>
