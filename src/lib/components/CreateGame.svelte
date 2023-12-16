<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let language: string;
    let numberOfPlayers: number;
    let points: number;
    let rounds: number;
    let visibility: boolean;

    const log = () => {
        console.log(language);
        console.log(numberOfPlayers);
        console.log(points);
        console.log(rounds);
        console.log(visibility);
    };
</script>

<div id="form">
    <form on:submit={log}>
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
                Number of Players
                <select class="form-select" bind:value={numberOfPlayers}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </label>
        </div>

        <div class="row">
            <label>
                Points
                <select class="form-select" bind:value={points}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select></label
            >
        </div>

        <div class="row">
            <label>
                Rounds
                <select class="form-select" bind:value={rounds}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </label>
        </div>

        <div class="row">
            <label>
                Visibility
                <div class="form-switch">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked
                        bind:value={visibility}
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
