<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let name: string;
    let language: string;
    let word: string;
    let words: string[];

    const dispatch = createEventDispatcher();

    const createWordSet = async () => {};
</script>

<div id="create-word-set">
    <div class="row text-center">
        <p style="font-weight: bold;">Create Word Set</p>
        <hr />
    </div>

    <div class="row">
        <label>
            Name
            <input
                class="form-control"
                type="text"
                placeholder="Name"
                bind:value={name}
            />
        </label>
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
        <span>Words</span>
    </div>

    <div id="words"></div>

    <form class="row">
        <div class="col-8">
            <input
                class="form-control"
                type="text"
                placeholder="Word"
                bind:value={word}
            />
        </div>
        <div class="col-4">
            <button class="btn btn-primary w-100">Add</button>
        </div>
    </form>

    <div class="row">
        <div class="col text-center">
            <button
                type="button"
                class="btn btn-secondary"
                on:click={(_) => dispatch("back")}>Back</button
            >
        </div>

        <div class="col text-center">
            <button type="submit" class="btn btn-primary text-center"
                >Create</button
            >
        </div>
    </div>
</div>

<style>
    #create-word-set {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        border: 2px solid;
        border-radius: 0.5rem;

        height: 100%;
        padding: 1rem;

        text-align: left;
    }

    #words {
        display: flex;
        flex-direction: column;

        border: 1px solid;
        border-radius: 0.25rem;

        height: 100%;
        overflow-y: auto;
    }
</style>
