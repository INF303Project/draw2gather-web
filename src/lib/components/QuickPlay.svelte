<script lang="ts">
    import type { CreateUserReq } from "$lib/dto";
    import { API_URL } from "$lib";
    import { goto, invalidateAll } from "$app/navigation";
    import { loading } from "$lib/stores";

    export let name: string;
    let newName = name;

    const gotoGames = async () => {
        $loading = true;
        await fetch(`http://${API_URL}/user`, {
            method: "POST",
            body: JSON.stringify({
                name: newName,
            } as CreateUserReq),
            credentials: "include",
        });
        await invalidateAll();
        await goto("/games");
        $loading = false;
    };
</script>

<div id="anonymous">
    <div class="text-center">
        <h4>Quick Play</h4>
        <span>Have fun quickly!</span>
    </div>

    <form id="anon-form" on:submit={gotoGames}>
        <label>
            Username
            <input
                class="form-control"
                type="text"
                placeholder="Enter your username"
                minlength="1"
                bind:value={newName}
            />
        </label>
        <button class="btn btn-primary">Play</button>
    </form>
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
