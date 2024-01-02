<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { API_URL } from "$lib";
    import { loading } from "$lib/stores";
    import { createEventDispatcher } from "svelte";

    let name: string;
    let language: string;
    let word: string;
    let words: string[] = [];
    let wordSet = new Set<string>();

    const dispatch = createEventDispatcher();

    const createWordSet = async () => {
        if (words.length < 50) {
            alert("Word set must have at least 50 words.");
        } else {
            $loading = true;
            const res = await fetch(`http://${API_URL}/set`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    language,
                    words,
                }),
            });
            if (!res.ok) {
                alert(await res.text());
            } else {
                await invalidateAll();
                dispatch("back");
            }
            $loading = false;
        }
    };

    const addWord = () => {
        wordSet.add(word);
        word = "";
        words = Array.from(wordSet.values()).sort();
    };
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
                required
                bind:value={name}
            />
        </label>
    </div>

    <div class="row">
        <label>
            Language
            <select class="form-select" bind:value={language} required>
                <option value="TR">Turkish</option>
                <option value="EN">English</option>
                <option value="DE">German</option>
            </select>
        </label>
    </div>

    <div class="row">
        <span>Words</span>
    </div>

    <div id="words">
        {#each words as w}
            <div class="word">
                <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    on:click={() => {
                        wordSet.delete(w);
                        words = Array.from(wordSet.values());
                    }}
                    >x
                </button>
                <span>{w}</span>
            </div>
        {/each}
    </div>

    <form class="row" on:submit|preventDefault={addWord}>
        <div class="col-8">
            <input
                class="form-control"
                type="text"
                placeholder="Word"
                required
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
            <button
                type="submit"
                class="btn btn-primary text-center"
                on:click={createWordSet}>Create</button
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
        flex-flow: column wrap;
        justify-content: flex-start;
        gap: 0.5rem;

        border: 1px solid;
        border-radius: 0.25rem;
        padding: 0.5rem;

        height: 100%;
        overflow-y: auto;
    }

    .word {
        flex-direction: row;
        gap: 0.5rem;

        border: 1px solid;
        border-radius: 0.25rem;

        /* height: fit-content; */
        /* width: fit-content; */
        padding: 0.25rem;
    }
</style>
