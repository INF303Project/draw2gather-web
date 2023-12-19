<script lang="ts">
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let language: string;
    let maxPlayers: number;
    let targetScore: number;
    let visibility: boolean;

    const createGame = async () => {
        const create = await fetch("http://localhost:8080/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                max_players: maxPlayers,
                target_score: targetScore,
                language,
                visibility,
            }),
            credentials: "include",
        });
        const data = await create.json();
        const gameId = data.id;
        await goto(`/${gameId}`);
    };
</script>

<div id="form">
    <form on:submit={createGame}>
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
                Max Players
                <select class="form-select" bind:value={maxPlayers}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </label>
        </div>

        <div class="row">
            <label>
                Target Score
                <select class="form-select" bind:value={targetScore}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
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
            <div class="col text-center">
                <button type="submit" class="btn btn-primary">Play</button>
            </div>
        </div>
    </form>
</div>

<style>
    #form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        border: 2px solid;
        border-radius: 0.5rem;

        padding: 1rem;

        text-align: left;
    }
</style>
