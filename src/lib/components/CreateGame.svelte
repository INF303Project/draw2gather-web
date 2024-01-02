<script lang="ts">
    import type { CreateGameReq, CreateGameResp } from "$lib/dto";
    import { API_URL } from "$lib";
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    import type { WordSet } from "$lib/models";
    import { loading } from "$lib/stores";

    export let word_sets: WordSet[] | undefined;

    const dispatch = createEventDispatcher();

    let language: string;
    let word_set: string;
    let maxPlayers: number;
    let targetScore: number;
    let visibility: boolean;

    const createGame = async () => {
        $loading = true;
        const resp = await fetch(`http://${API_URL}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                max_players: maxPlayers,
                target_score: targetScore,
                language,
                visibility,
                word_set,
            } as CreateGameReq),
            credentials: "include",
        });
        const data = (await resp.json()) as CreateGameResp;
        const gameId = data.id;
        await goto(`/${gameId}`);
        $loading = false;
    };
</script>

<div id="create-game">
    <form on:submit|preventDefault={createGame}>
        <div class="row text-center">
            <p style="font-weight: bold;">Create Game</p>
            <hr />
        </div>

        <div class="row">
            <label>
                Language
                <select class="form-select" bind:value={language}>
                    <option value="TR">Turkish</option>
                    <option value="EN">English</option>
                    <option value="DE">German</option>
                </select>
            </label>
        </div>

        <div class="row">
            <label>
                Word Set
                <select
                    disabled={word_sets == undefined}
                    class="form-select"
                    bind:value={word_set}
                >
                    <option value="default" selected>Default</option>
                    {#if word_sets}
                        {#each word_sets as set}
                            {#if set.language == language}
                                <option value={set.name}>{set.name}</option>
                            {/if}
                        {/each}
                    {/if}
                </select>
            </label>
        </div>

        <div class="row">
            <label>
                Max Players
                <select class="form-select" bind:value={maxPlayers}>
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                </select>
            </label>
        </div>

        <div class="row">
            <label>
                Target Score
                <select class="form-select" bind:value={targetScore}>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                </select></label
            >
        </div>

        <div class="row">
            <label>
                Visibility
                <div class="form-switch">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        bind:checked={visibility}
                    />
                </div>
            </label>
        </div>

        <div class="row">
            <div class="col text-center">
                <button
                    type="button"
                    class="btn btn-secondary"
                    on:click={(_) => dispatch("back")}>Back</button
                >
            </div>

            {#if word_sets}
                <div class="col text-center">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        on:click={(_) => {
                            dispatch("create-word-set");
                        }}
                    >
                        Create Word Set
                    </button>
                </div>
            {/if}

            <div class="col text-center">
                <button type="submit" class="btn btn-primary">Play</button>
            </div>
        </div>
    </form>
</div>

<style>
    #create-game {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        border: 2px solid;
        border-radius: 0.5rem;

        padding: 1rem;

        text-align: left;
    }
</style>
