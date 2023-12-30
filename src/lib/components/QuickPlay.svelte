<script lang="ts">
    import type { CreateUserReq } from "$lib/dto";
    import { API_URL } from "$lib";
    import { goto } from "$app/navigation";

    export let name: string;

    const gotoGames = async () => {
        await fetch(`http://${API_URL}:8080/user`, {
            method: "POST",
            body: JSON.stringify({
                name: name,
            } as CreateUserReq),
            credentials: "include",
        });
        await goto("/games");
    };
</script>

<div id="anonymous">
    <div class="text-center">
        <h4>Quick Play</h4>
        <span>Have fun quickly!</span>
    </div>

    <div id="anon-form">
        <label>
            Username
            <input
                class="form-control"
                type="text"
                placeholder="Enter your username"
                minlength="1"
                bind:value={name}
            />
        </label>
        <button class="btn btn-primary" on:click={gotoGames}>Play</button>
    </div>
</div>

<style>
    #anonymous {
        display: flex;
        flex-direction: column;
        align-items: center;

        border: 2px solid;
        border-radius: 0.5rem;

        height: 100%;
        width: 100%;

        padding: 1rem;
    }

    #anon-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        height: 100%;
        width: 100%;

        padding: 1rem;
    }
</style>
