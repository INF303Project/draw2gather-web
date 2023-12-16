<script lang="ts">
    import { players } from "$lib/stores";
</script>

<div id="player-list">
    <div class="row" style="border-bottom: 2px solid;">
        <p style="font-weight: bold;">Players</p>
    </div>
    <div id="players">
        {#each $players as player}
            <div class="row" style="border-bottom: 1px solid;">
                <b>{player.name}</b>
                <p class="mb-0">{player.score}</p>
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
</style>
